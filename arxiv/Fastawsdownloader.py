import os
import tarfile
import json
import datetime
import time
from pathlib import Path
from typing import List, Dict, Optional, Set, Tuple
from dataclasses import dataclass
import threading
import xml.etree.ElementTree as ET
from queue import Queue, Empty
from tqdm import tqdm
import boto3
from botocore.config import Config
import sys
import shutil
import logging
import hashlib # For MD5 calculation

# --- Configuration ---
# Where to download tar files temporarily
DOWNLOAD_DIR = Path("arxiv_downloads")
# Path to the arXiv manifest file (local path after download from S3)
LOCAL_MANIFEST_PATH = Path("arxiv_manifest.xml")
# S3 Key for the manifest file
S3_MANIFEST_KEY = "src/arXiv_src_manifest.xml" # Common key for arXiv manifest
# Path to the simplified progress file (tracks completed downloads in JSONL format)
PROGRESS_FILE = "./download_progress.jsonl" # Changed to .jsonl
# Number of parallel download workers
DOWNLOADER_COUNT = 8  # Reduced to 8 as requested
# Max attempts to download a single file
MAX_DOWNLOAD_RETRIES = 5
# Delay in seconds before retrying a failed download
RETRY_DELAY_SECONDS = 5
# S3 Bucket Name
S3_BUCKET = "arxiv"
# Retry configuration for S3
S3_RETRY_CONFIG = Config(
    retries=dict(max_attempts=20, mode='standard'),
    max_pool_connections=128, # Can remain high as it's a pool for many connections over time
    tcp_keepalive=True,
)
# --- End Configuration ---

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
log = logging.getLogger(__name__)

@dataclass
class TarInfo:
    filename: str  # Relative path in S3 (e.g., 'src/arXiv_src_0001_001.tar')
    size: int
    md5sum: str
    # Add other fields if needed

# --- Utility for MD5 Calculation ---
def calculate_md5(file_path: Path, chunk_size: int = 8192) -> str:
    """Calculates the MD5 hash of a file."""
    md5 = hashlib.md5()
    try:
        with open(file_path, 'rb') as f:
            while chunk := f.read(chunk_size):
                md5.update(chunk)
        return md5.hexdigest()
    except Exception as e:
        log.error(f"Error calculating MD5 for {file_path}: {e}")
        return "" # Indicate failure to calculate, will cause a mismatch

# --- Manifest and Progress File Handling ---

def download_manifest_from_s3(s3_client, s3_key: str, local_path: Path):
    """
    Downloads the manifest XML file from S3 if it doesn't exist locally,
    or if its size doesn't match a quick S3 check.
    """
    log.info(f"Checking for manifest file: {local_path}")
    if local_path.exists():
        try:
            # Check S3 object metadata for size to see if local file might be outdated/incomplete
            s3_object_head = s3_client.head_object(
                Bucket=S3_BUCKET,
                Key=s3_key,
                RequestPayer='requester' # Corrected: Direct parameter, not in ExtraArgs
            )
            s3_size = s3_object_head['ContentLength']
            if local_path.stat().st_size == s3_size:
                log.info(f"Manifest file already exists locally and size matches S3: {local_path}")
                return
            else:
                log.warning(f"Local manifest size mismatch. Expected {s3_size}, got {local_path.stat().st_size}. Redownloading.")
                os.remove(local_path) # Delete old/corrupt one
        except s3_client.exceptions.ClientError as e:
            if e.response['Error']['Code'] == '404':
                log.error(f"Manifest file {s3_key} not found in S3 bucket {S3_BUCKET}.")
                sys.exit(1)
            elif e.response['Error']['Code'] == '403':
                log.error(f"Access Denied (403) for manifest file {s3_key}. "
                          f"Ensure your AWS credentials have s3:GetObject permission on s3://{S3_BUCKET}/{s3_key} "
                          f"and your account is configured for 'Requester Pays'. Original error: {e}")
                sys.exit(1)
            else:
                log.error(f"Error checking S3 manifest object {s3_key}: {e}")
                sys.exit(1)
        except Exception as e:
            log.warning(f"Could not check local manifest file consistency: {e}. Attempting redownload.")
            if local_path.exists():
                os.remove(local_path)

    log.info(f"Downloading manifest from s3://{S3_BUCKET}/{s3_key} to {local_path}...")
    try:
        s3_client.download_file(S3_BUCKET, s3_key, str(local_path), ExtraArgs={'RequestPayer': 'requester'})
        log.info("Manifest download complete.")
    except Exception as e:
        log.error(f"Failed to download manifest {s3_key} from S3: {e}")
        sys.exit(1)


def parse_manifest(manifest_path: Path) -> List[TarInfo]:
    """Parses the XML manifest file."""
    log.info(f"Parsing manifest: {manifest_path}")
    try:
        tree = ET.parse(manifest_path)
        root = tree.getroot()
        tars = []
        for elem in root.findall('.//file'):
            filename_elem = elem.find('filename')
            size_elem = elem.find('size')
            md5sum_elem = elem.find('md5sum')

            if filename_elem is not None and size_elem is not None and md5sum_elem is not None:
                if filename_elem.text and filename_elem.text.endswith('.tar'):
                    tars.append(TarInfo(
                        filename=filename_elem.text,
                        size=int(size_elem.text),
                        md5sum=md5sum_elem.text,
                    ))
                else:
                    log.debug(f"Skipping non-tar or invalid filename entry in manifest: {filename_elem.text if filename_elem is not None else 'N/A'}")
            else:
                log.warning(f"Skipping incomplete entry in manifest: {ET.tostring(elem, encoding='unicode').strip()}")
        log.info(f"Parsed {len(tars)} tar file entries from manifest.")
        return tars
    except FileNotFoundError:
        log.error(f"Manifest file not found: {manifest_path}. Please ensure it's downloaded.")
        sys.exit(1)
    except ET.ParseError as e:
        log.error(f"Error parsing manifest XML {manifest_path}: {e}")
        sys.exit(1)
    except Exception as e:
        log.error(f"An unexpected error occurred during manifest parsing: {e}")
        sys.exit(1)


def load_progress_log(progress_file: str) -> Dict[str, TarInfo]:
    """Loads metadata of successfully downloaded tar files from the JSONL progress file."""
    completed_metadata = {}
    try:
        if os.path.exists(progress_file):
            with open(progress_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line:
                        try:
                            data = json.loads(line)
                            # Reconstruct TarInfo from dict, ensure all fields are present
                            if 'filename' in data and 'size' in data and 'md5sum' in data:
                                tar_info = TarInfo(
                                    filename=data['filename'],
                                    size=data['size'],
                                    md5sum=data['md5sum']
                                )
                                completed_metadata[tar_info.filename] = tar_info
                            else:
                                log.warning(f"Skipping malformed JSON line in progress file (missing keys): {line}")
                        except json.JSONDecodeError as e:
                            log.warning(f"Skipping invalid JSON line in progress file ({e}): {line}")
            log.info(f"Loaded {len(completed_metadata)} completed downloads from {progress_file}")
    except Exception as e:
        log.error(f"Error loading progress file {progress_file}: {e}")
    return completed_metadata

def log_completion(progress_file: str, tar_info: TarInfo, lock: threading.Lock):
    with lock:
        try:
            with open(progress_file, 'a') as f:
                # Convert dataclass to dict before serializing to JSON
                f.write(json.dumps(tar_info.__dict__) + '\n')
        except Exception as e:
            log.error(f"Error writing to progress file {progress_file}: {e}")




def download_tar(s3_client, tar_info: TarInfo, download_dir: Path) -> bool:
    """Downloads a single tar file from S3 and performs MD5 validation."""
    download_path = download_dir / tar_info.filename
    os.makedirs(download_path.parent, exist_ok=True)

    # Check if file already exists and has correct MD5
    if download_path.exists():
        calculated_md5 = calculate_md5(download_path)
        if calculated_md5 == tar_info.md5sum:
            log.info(f"File {tar_info.filename} already exists locally and MD5 matches. Skipping download.")
            return True # File is verified and ready
        else:
            log.warning(f"MD5 mismatch for existing file {tar_info.filename}. Expected {tar_info.md5sum}, got {calculated_md5}. Deleting corrupted file.")
            os.remove(download_path) # Delete and redownload
    
    # If we reached here, the file needs to be downloaded (or re-downloaded)
    try:
        log.info(f"Downloading {tar_info.filename} (Size: {tar_info.size / (1024*1024):.2f} MB)")
        s3_client.download_file(
            S3_BUCKET,
            tar_info.filename,
            str(download_path),
            ExtraArgs={'RequestPayer': 'requester'}
        )
                
        # Verify MD5 AFTER download
        calculated_md5 = calculate_md5(download_path)
        if calculated_md5 != tar_info.md5sum:
            log.warning(f"MD5 checksum mismatch for {tar_info.filename}. Expected {tar_info.md5sum}, got {calculated_md5}. Deleting corrupted file.")
            os.remove(download_path) # Delete corrupted file
            return False # Indicate failure

        log.info(f"Successfully downloaded and verified {tar_info.filename}")
        return True # Success
    except Exception as e:
        log.error(f"Failed to download {tar_info.filename}: {e}")
        # Clean up potentially incomplete/corrupted file
        if download_path.exists():
            try:
                os.remove(download_path)
            except OSError as os_err:
                log.warning(f"Could not remove partial download {download_path}: {os_err}")
        return False


def downloader_worker(s3_client, task_queue: Queue, success_queue: Queue, download_dir: Path, progress_file: str, progress_lock: threading.Lock, stop_event: threading.Event):
    """Worker thread to download files from S3 with retry logic."""
    while not stop_event.is_set(): # Keep polling as long as stop_event is not set
        tar_info = None # Initialize to None for error logging outside try
        try:
            # Get item from queue with timeout to allow checking stop_event
            tar_info_tuple: Tuple[TarInfo, int] = task_queue.get(block=True, timeout=1.0)
            tar_info, current_retries = tar_info_tuple

            # Attempt download and validation
            success = download_tar(s3_client, tar_info, download_dir)
            if success:
                # Log completion with full TarInfo metadata
                log_completion(progress_file, tar_info, progress_lock)
                success_queue.put(True) # Signal main thread for tqdm update
            else:
                if current_retries < MAX_DOWNLOAD_RETRIES:
                    log.warning(f"Retrying download for {tar_info.filename} (attempt {current_retries + 1}/{MAX_DOWNLOAD_RETRIES})...")
                    time.sleep(RETRY_DELAY_SECONDS) # Add a delay before retrying
                    task_queue.put((tar_info, current_retries + 1)) # Re-queue for retry
                else:
                    log.error(f"Failed to download {tar_info.filename} after {MAX_DOWNLOAD_RETRIES} attempts. Skipping permanently.")
                    # No success_queue.put(True) because it wasn't a success.
                    # This means the pbar will reflect only successfully acquired files.
        except Empty: # Timeout occurred, check stop_event and continue
            continue
        except Exception as e:
            # Catch any unexpected errors within the worker loop
            filename_for_log = tar_info.filename if tar_info else 'unknown file'
            log.exception(f"Unexpected error in downloader worker for {filename_for_log}: {e}") # Use log.exception for full traceback
            if tar_info is not None: # If an item was successfully retrieved from the queue
                if current_retries < MAX_DOWNLOAD_RETRIES:
                    log.warning(f"Retrying download for {filename_for_log} (attempt {current_retries + 1}/{MAX_DOWNLOAD_RETRIES}) due to unexpected error.")
                    time.sleep(RETRY_DELAY_SECONDS)
                    task_queue.put((tar_info, current_retries + 1))
                else:
                    log.error(f"Failed to process {filename_for_log} after {MAX_DOWNLOAD_RETRIES} attempts due to unexpected errors. Skipping permanently.")
        finally:
            if tar_info is not None: # Ensure task_done is called only if an item was successfully retrieved
                task_queue.task_done()
    log.info(f"Downloader worker {threading.current_thread().name} stopping.") # Log worker stopping

if __name__ == "__main__":
    sys.stdout.reconfigure(line_buffering=True) # Ensure print statements appear immediately

    log.info("Starting arXiv download process (download-only).")
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    # --- Initialization ---
    s3 = boto3.client('s3', config=S3_RETRY_CONFIG)

    # 1. Download manifest first
    download_manifest_from_s3(s3, S3_MANIFEST_KEY, LOCAL_MANIFEST_PATH)

    # 2. Parse the manifest
    all_tars_from_manifest = parse_manifest(LOCAL_MANIFEST_PATH)
    # Load completed files metadata from JSONL
    downloaded_tars_metadata = load_progress_log(PROGRESS_FILE)

    # RISKY FAST RESUME: Trust the progress log - if it's logged, it's complete and validated
    tars_to_process = []
    initial_completed_count = 0
    
    log.info("Performing fast resume check (trusting progress log)...")
    
    for manifest_tar_info in all_tars_from_manifest:
        if manifest_tar_info.filename in downloaded_tars_metadata:
            initial_completed_count += 1
        else:
            # File needs to be processed
            tars_to_process.append(manifest_tar_info)

    total_files_in_manifest = len(all_tars_from_manifest)
    num_to_download_now = len(tars_to_process)

    if num_to_download_now == 0 and initial_completed_count == total_files_in_manifest:
        log.info("All tar files listed in the manifest have already been downloaded and are present locally.")
        sys.exit(0)

    log.info(f"Fast resume complete. Found {num_to_download_now} tar files to download.")
    if initial_completed_count > 0:
        log.info(f"({initial_completed_count} files already completed per progress log)")

    download_task_queue = Queue() # Queue of (TarInfo, retry_count) for downloaders
    success_queue = Queue() # Queue for workers to signal successful downloads to main thread
    progress_lock = threading.Lock() # Lock for writing to the progress file
    stop_event = threading.Event() # Signal for workers to stop gracefully

    log.info("Populating download queue...")
    for tar_info in tars_to_process:
        download_task_queue.put((tar_info, 0)) # Add initial retry count 0
    log.info("Download queue populated.")

    main_pbar = tqdm(total=total_files_in_manifest, desc="Overall Download Progress", unit="tar", initial=initial_completed_count, mininterval=0.5)

    download_threads = []
    log.info(f"Starting {DOWNLOADER_COUNT} download workers...")
    for i in range(DOWNLOADER_COUNT):
        thread = threading.Thread(
            target=downloader_worker,
            args=(s3, download_task_queue, success_queue, DOWNLOAD_DIR, PROGRESS_FILE, progress_lock, stop_event),
            daemon=True, # Daemon threads exit when main thread exits
            name=f"Downloader-{i+1}"
        )
        thread.start()
        download_threads.append(thread)

    try:
        # Loop while there are still tasks in the download_task_queue or workers are busy
        while True:
            # Update progress bar from success queue
            while True:
                try:
                    _ = success_queue.get_nowait()
                    main_pbar.update(1)
                except Empty:
                    break # No more new successes for now

            # This condition checks if all tasks initially put on the queue are marked 'done'.
            # download_task_queue.unfinished_tasks will only be 0 when task_done() has been called for every put()
            # This is robust even with retries because re-queued tasks still count towards unfinished_tasks until they finally succeed or are skipped.
            if download_task_queue.unfinished_tasks == 0:
                break
            
            time.sleep(0.1) # Short sleep to avoid busy-waiting too much

        # After the main loop, explicitly wait for all tasks to be done on the queue.
        # This is the most reliable way to ensure all tasks are accounted for.
        download_task_queue.join()
        log.info("Download queue finished.")

        # Final sweep of success queue to ensure all updates are propagated
        while True:
            try:
                _ = success_queue.get_nowait()
                main_pbar.update(1)
            except Empty:
                break

    except KeyboardInterrupt:
        log.warning("Keyboard interrupt received. Signalling workers to stop...")
        stop_event.set()

    finally:
        # Signal workers to stop (if not already stopped by interrupt)
        stop_event.set()
        log.info("Waiting for worker threads to finish...")

        # Wait for all threads to complete with timeout to avoid hanging
        for t in download_threads:
            t.join(timeout=30.0) # Wait up to 30 seconds per thread
            if t.is_alive():
                log.warning(f"Thread {t.name} did not terminate gracefully within 30 seconds.")

        main_pbar.close()
        log.info("All download workers finished. Process complete.")

        final_completed_tars_metadata = load_progress_log(PROGRESS_FILE)
        successfully_processed_count = len(final_completed_tars_metadata) # Total files now marked complete
        log.info(f"Total files in manifest: {total_files_in_manifest}. Total files logged as downloaded: {successfully_processed_count}.")
        if successfully_processed_count != total_files_in_manifest:
             log.warning(f"Mismatch detected. {total_files_in_manifest - successfully_processed_count} files were not successfully downloaded/logged.")
        else:
            log.info("All files from the manifest are now logged as downloaded.")
