#!/usr/bin/env python3
import logging
import gzip
import tarfile
import datetime
from io import BytesIO
from pathlib import Path
from dataclasses import dataclass
from collections import defaultdict
from concurrent.futures import ProcessPoolExecutor, as_completed

import pyarrow as pa
import pyarrow.ipc as ipc
import xml.etree.ElementTree as ET
from tqdm import tqdm

# ─── CONFIGURATION ────────────────────────────────────────────────────────────────
SRC_DIR       = Path("arxiv_downloads/src")
MANIFEST_XML  = Path("manifest.xml")
OUT_DIR       = Path("out")
PROCESSED_DIR = Path("processed")
LOG_FILE      = Path("pipeline.log")
BATCH_SIZE    = 1000
MAX_WORKERS   = None
# ────────────────────────────────────────────────────────────────────────────────

@dataclass
class TarInfo:
    filename: str
    size: int
    md5sum: str
    first_item: str
    last_item: str
    num_items: int
    yymm: str

def parse_manifest(manifest: Path) -> list[TarInfo]:
    tree = ET.parse(str(manifest))
    out = []
    for elem in tree.getroot().findall(".//file"):
        raw = elem.find("filename").text or ""
        base = Path(raw).name
        out.append(TarInfo(
            filename   = base,
            size       = int(elem.find("size").text),
            md5sum     = elem.find("md5sum").text,
            first_item = elem.find("first_item").text,
            last_item  = elem.find("last_item").text,
            num_items  = int(elem.find("num_items").text),
            yymm       = elem.find("yymm").text,
        ))
    return out

# Arrow schema: one row per paper
SCHEMA = pa.schema([
    pa.field("paper_id",         pa.string()),
    pa.field("full_tex",         pa.string()),
    pa.field("source_tar",       pa.string()),
    pa.field("md5sum",           pa.string()),
    pa.field("first_item",       pa.string()),
    pa.field("last_item",        pa.string()),
    pa.field("num_items_in_tar", pa.int32()),
    pa.field("yymm",             pa.string()),
])

def sentinel_path(filename: str) -> Path:
    return PROCESSED_DIR / f"{filename}.done"

def is_done(info: TarInfo) -> bool:
    return sentinel_path(info.filename).exists()

def mark_done(info: TarInfo, status: str):
    fn = sentinel_path(info.filename)
    fn.parent.mkdir(parents=True, exist_ok=True)
    fn.write_text(f"{status} @ {datetime.datetime.now().isoformat()}\n")

def process_tar(info: TarInfo) -> dict:
    tar_path = SRC_DIR / info.filename
    if not tar_path.exists():
        return {"filename": info.filename, "status": "missing", "papers": 0}

    grouping = defaultdict(list)
    seen_papers = set()
    try:
        with open(tar_path, "rb") as fh, \
             tarfile.open(fileobj=fh, mode="r|*") as tf:
            for member in tf:
                if not member.isfile():
                    continue
                name = member.name
                lower = name.lower()
                f = tf.extractfile(member)
                if not f:
                    continue
                data = f.read()

                # (1) plain .tex
                if lower.endswith(".tex"):
                    pid = Path(name).stem
                    if pid in seen_papers:
                        return {"filename": info.filename, "status": "dup_paper", "paper_id": pid}
                    seen_papers.add(pid)
                    grouping[pid].append(data.decode("utf-8", errors="replace"))

                # (2) .tex.gz
                elif lower.endswith(".tex.gz"):
                    pid = Path(name[:-3]).stem
                    if pid in seen_papers:
                        return {"filename": info.filename, "status": "dup_paper", "paper_id": pid}
                    seen_papers.add(pid)
                    try:
                        raw = gzip.decompress(data)
                    except gzip.BadGzipFile:
                        return {"filename": info.filename, "status": "bad_gzip", "paper_id": pid}
                    grouping[pid].append(raw.decode("utf-8", errors="replace"))

                # (3) nested .tar.gz or .tgz
                elif lower.endswith((".tar.gz", ".tgz")):
                    try:
                        raw = gzip.decompress(data)
                    except gzip.BadGzipFile:
                        continue
                    with tarfile.open(fileobj=BytesIO(raw), mode="r|*") as nested:
                        for nm in nested:
                            if not nm.isfile() or not nm.name.lower().endswith(".tex"):
                                continue
                            pid = Path(nm.name).stem
                            if pid in seen_papers:
                                return {"filename": info.filename, "status": "dup_paper", "paper_id": pid}
                            seen_papers.add(pid)
                            nf = nested.extractfile(nm)
                            text = nf.read().decode("utf-8", errors="replace")
                            grouping[pid].append(text)
                # else: skip
    except Exception as e:
        return {"filename": info.filename, "status": "error_open", "error": str(e)}

    # no .tex at all?
    if not grouping:
        return {"filename": info.filename, "status": "no_tex", "papers": 0}

    # count‐mismatch check
    found = len(grouping)
    if found != info.num_items:
        return {
            "filename": info.filename,
            "status":   "count_mismatch",
            "expected": info.num_items,
            "found":    found
        }

    # stream out Arrow IPC
    out_path = OUT_DIR / f"{info.filename}.arrow"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sink   = pa.OSFile(str(out_path), "wb")
    writer = ipc.new_file(sink, SCHEMA)

    buffer = []
    total = 0
    for pid, chunks in grouping.items():
        buffer.append({
            "paper_id":         pid,
            "full_tex":         "\n".join(chunks),
            "source_tar":       info.filename,
            "md5sum":           info.md5sum,
            "first_item":       info.first_item,
            "last_item":        info.last_item,
            "num_items_in_tar": info.num_items,
            "yymm":             info.yymm,
        })
        total += 1
        if len(buffer) >= BATCH_SIZE:
            batch = pa.RecordBatch.from_pylist(buffer, schema=SCHEMA)
            writer.write_batch(batch)
            buffer.clear()

    if buffer:
        batch = pa.RecordBatch.from_pylist(buffer, schema=SCHEMA)
        writer.write_batch(batch)

    writer.close()
    sink.close()
    return {"filename": info.filename, "status": "ok", "papers": total}

def main():
    logging.basicConfig(
        filename=str(LOG_FILE),
        filemode="a",
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s"
    )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    all_tars = parse_manifest(MANIFEST_XML)
    to_do    = [t for t in all_tars if not is_done(t)]
    logging.info(f"Starting: {len(to_do)}/{len(all_tars)} tars to process")

    with ProcessPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(process_tar, t): t for t in to_do}
        for fut in tqdm(as_completed(futures), total=len(futures), desc="Tars", unit="tar"):
            info = futures[fut]
            try:
                res = fut.result()
            except Exception as e:
                logging.exception(f"Fatal error on {info.filename}: {e}")
                continue

            st = res["status"]
            if st == "ok":
                mark_done(info, st)
                logging.info( f"[OK]    {info.filename} → {res['papers']} papers" )
            elif st == "no_tex":
                mark_done(info, st)
                logging.info( f"[SKIP]  {info.filename} (no tex)" )
            elif st == "count_mismatch":
                mark_done(info, st)
                logging.error(f"[MISMATCH] {info.filename}: expected {res['expected']}, found {res['found']}")
            elif st == "missing":
                mark_done(info, st)
                logging.error(f"[MISSING] {info.filename} not found")
            elif st == "dup_paper":
                mark_done(info, st)
                logging.error(f"[DUPLICATE] {info.filename}: duplicate paper_id {res['paper_id']}")
            else:
                # other errors (gzip, open, etc.)
                mark_done(info, st)
                logging.error(f"[ERROR] {info.filename} status={st} info={res.get('error')}")

    logging.info("Pipeline complete.")

if __name__ == "__main__":
    main()
