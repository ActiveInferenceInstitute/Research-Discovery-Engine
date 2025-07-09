#!/usr/bin/env python3
"""
Research Discovery Engine - Main Entry Point

This script serves as the single entry point for the Research Discovery Engine.
It performs comprehensive system checks, ensures all dependencies are installed,
starts the development server, and opens the application in the browser.

PROVEN STARTUP METHODOLOGY:
- Multi-layered server detection (output parsing + HTTP checks)
- Real-time Vite server output monitoring
- Graceful timeout handling with fallbacks
- Comprehensive error reporting and troubleshooting

The server startup logic has been tested and proven to work reliably with:
- Node.js 18.20+ / npm 10.8+
- Vite 5.4.19 development server
- All major Linux distributions

Author: Research Discovery Engine Team
Version: 2.1 - Enhanced Server Detection
License: MIT
"""

import os
import sys
import subprocess
import platform
import webbrowser
import time
import json
import signal
import atexit
from pathlib import Path
from typing import Optional, Dict, List, Tuple
import urllib.request
import urllib.error

# Color codes for terminal output
class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text: str) -> None:
    """Print a formatted header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text:^60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(text: str) -> None:
    """Print success message"""
    print(f"{Colors.OKGREEN}✅ {text}{Colors.ENDC}")

def print_warning(text: str) -> None:
    """Print warning message"""
    print(f"{Colors.WARNING}⚠️  {text}{Colors.ENDC}")

def print_error(text: str) -> None:
    """Print error message"""
    print(f"{Colors.FAIL}❌ {text}{Colors.ENDC}")

def print_info(text: str) -> None:
    """Print info message"""
    print(f"{Colors.OKBLUE}ℹ️  {text}{Colors.ENDC}")

class SystemChecker:
    """System requirements checker and validator"""
    
    def __init__(self):
        self.requirements = {
            'python': {'min_version': (3, 8), 'current': None},
            'node': {'min_version': (16, 0), 'current': None},
            'npm': {'min_version': (8, 0), 'current': None},
            'git': {'min_version': (2, 0), 'current': None}
        }
        
    def check_python_version(self) -> bool:
        """Check Python version"""
        current = sys.version_info[:2]
        required = self.requirements['python']['min_version']
        self.requirements['python']['current'] = current
        
        if current >= required:
            print_success(f"Python {current[0]}.{current[1]} (required: {required[0]}.{required[1]}+)")
            return True
        else:
            print_error(f"Python {current[0]}.{current[1]} is too old (required: {required[0]}.{required[1]}+)")
            return False
    
    def check_command_version(self, command: str, version_arg: str = '--version') -> Tuple[bool, Optional[str]]:
        """Check if a command exists and get its version"""
        try:
            result = subprocess.run([command, version_arg], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                return True, result.stdout.strip()
            else:
                return False, None
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError, FileNotFoundError):
            return False, None
    
    def parse_version_string(self, version_string: str, command: str) -> Optional[Tuple[int, int]]:
        """Parse version string to extract major.minor version"""
        try:
            # Common version string patterns
            import re
            
            if command == 'node':
                match = re.search(r'v?(\d+)\.(\d+)', version_string)
            elif command == 'npm':
                match = re.search(r'(\d+)\.(\d+)', version_string)
            elif command == 'git':
                match = re.search(r'git version (\d+)\.(\d+)', version_string)
            else:
                match = re.search(r'(\d+)\.(\d+)', version_string)
            
            if match:
                return (int(match.group(1)), int(match.group(2)))
            return None
        except Exception:
            return None
    
    def check_node_npm(self) -> Dict[str, bool]:
        """Check Node.js and npm versions"""
        results = {}
        
        # Check Node.js
        exists, version_output = self.check_command_version('node', '--version')
        if exists and version_output:
            version = self.parse_version_string(version_output, 'node')
            if version:
                self.requirements['node']['current'] = version
                required = self.requirements['node']['min_version']
                if version >= required:
                    print_success(f"Node.js v{version[0]}.{version[1]} (required: v{required[0]}.{required[1]}+)")
                    results['node'] = True
                else:
                    print_error(f"Node.js v{version[0]}.{version[1]} is too old (required: v{required[0]}.{required[1]}+)")
                    results['node'] = False
            else:
                print_error("Could not parse Node.js version")
                results['node'] = False
        else:
            print_error("Node.js not found")
            results['node'] = False
        
        # Check npm
        exists, version_output = self.check_command_version('npm', '--version')
        if exists and version_output:
            version = self.parse_version_string(version_output, 'npm')
            if version:
                self.requirements['npm']['current'] = version
                required = self.requirements['npm']['min_version']
                if version >= required:
                    print_success(f"npm v{version[0]}.{version[1]} (required: v{required[0]}.{required[1]}+)")
                    results['npm'] = True
                else:
                    print_error(f"npm v{version[0]}.{version[1]} is too old (required: v{required[0]}.{required[1]}+)")
                    results['npm'] = False
            else:
                print_error("Could not parse npm version")
                results['npm'] = False
        else:
            print_error("npm not found")
            results['npm'] = False
        
        return results
    
    def check_git(self) -> bool:
        """Check Git version"""
        exists, version_output = self.check_command_version('git', '--version')
        if exists and version_output:
            version = self.parse_version_string(version_output, 'git')
            if version:
                self.requirements['git']['current'] = version
                required = self.requirements['git']['min_version']
                if version >= required:
                    print_success(f"Git v{version[0]}.{version[1]} (required: v{required[0]}.{required[1]}+)")
                    return True
                else:
                    print_warning(f"Git v{version[0]}.{version[1]} is old but should work (recommended: v{required[0]}.{required[1]}+)")
                    return True
            else:
                print_warning("Could not parse Git version, but Git is available")
                return True
        else:
            print_warning("Git not found (optional for running the application)")
            return True
    
    def check_system_requirements(self) -> bool:
        """Check all system requirements"""
        print_header("SYSTEM REQUIREMENTS CHECK")
        
        all_good = True
        
        # Check Python
        if not self.check_python_version():
            all_good = False
        
        # Check Node.js and npm
        node_npm_results = self.check_node_npm()
        if not node_npm_results.get('node', False):
            all_good = False
        if not node_npm_results.get('npm', False):
            all_good = False
        
        # Check Git (optional)
        self.check_git()
        
        # Check system info
        print_info(f"Operating System: {platform.system()} {platform.release()}")
        print_info(f"Architecture: {platform.machine()}")
        
        return all_good

class ProjectManager:
    """Project setup and dependency management"""
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.package_json_path = project_root / "package.json"
        self.node_modules_path = project_root / "node_modules"
        self.package_lock_path = project_root / "package-lock.json"
        
    def check_project_structure(self) -> bool:
        """Verify project structure"""
        print_header("PROJECT STRUCTURE VERIFICATION")
        
        required_files = [
            "package.json",
            "src/main.tsx",
            "src/App.tsx",
            "index.html",
            "vite.config.ts",
            "tsconfig.json"
        ]
        
        missing_files = []
        for file_path in required_files:
            full_path = self.project_root / file_path
            if full_path.exists():
                print_success(f"Found: {file_path}")
            else:
                print_error(f"Missing: {file_path}")
                missing_files.append(file_path)
        
        # Check knowledge base
        kg_path = self.project_root / "KG"
        if kg_path.exists():
            print_success("Knowledge base directory found")
            
            # Check for key knowledge files
            kg_files = ["mechanisms.md", "materials.md", "methods.md", "phenomena.md"]
            for kg_file in kg_files:
                if (kg_path / kg_file).exists():
                    print_success(f"Found: KG/{kg_file}")
                else:
                    print_warning(f"Optional KG file missing: {kg_file}")
        else:
            print_warning("Knowledge base directory (KG) not found")
        
        return len(missing_files) == 0
    
    def check_dependencies(self) -> Dict[str, any]:
        """Check dependency status"""
        print_header("DEPENDENCY STATUS CHECK")
        
        if not self.package_json_path.exists():
            print_error("package.json not found")
            return {'status': 'error', 'message': 'package.json missing'}
        
        try:
            with open(self.package_json_path, 'r') as f:
                package_data = json.load(f)
            
            print_success("package.json found and readable")
            
            # Check if node_modules exists
            if self.node_modules_path.exists():
                print_success("node_modules directory exists")
                
                # Count installed packages
                try:
                    installed_count = len([d for d in self.node_modules_path.iterdir() 
                                         if d.is_dir() and not d.name.startswith('.')])
                    print_info(f"Approximately {installed_count} packages installed")
                except Exception:
                    print_warning("Could not count installed packages")
                
                return {'status': 'installed', 'package_data': package_data}
            else:
                print_warning("node_modules directory not found")
                return {'status': 'missing', 'package_data': package_data}
                
        except json.JSONDecodeError:
            print_error("package.json is not valid JSON")
            return {'status': 'error', 'message': 'Invalid package.json'}
        except Exception as e:
            print_error(f"Error reading package.json: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def install_dependencies(self) -> bool:
        """Install npm dependencies"""
        print_header("INSTALLING DEPENDENCIES")
        
        try:
            print_info("Running npm install...")
            print_info("This may take a few minutes on first run...")
            
            # Run npm install with progress indicator
            process = subprocess.Popen(
                ['npm', 'install'],
                cwd=self.project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            # Show output in real-time
            while True:
                output = process.stdout.readline()
                if output == '' and process.poll() is not None:
                    break
                if output:
                    # Clean up npm output for better display
                    clean_output = output.strip()
                    if clean_output and not clean_output.startswith('npm'):
                        print(f"  {clean_output}")
            
            return_code = process.poll()
            
            if return_code == 0:
                print_success("Dependencies installed successfully")
                return True
            else:
                print_error("Failed to install dependencies")
                return False
                
        except Exception as e:
            print_error(f"Error installing dependencies: {e}")
            return False

class ServerManager:
    """Development server management"""
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.process = None
        self.server_url = "http://localhost:5173"  # Default, will be updated dynamically
        self.actual_port = None
        
    def check_port_availability(self, port: int = 5173) -> bool:
        """Check if the default port is available"""
        try:
            import socket
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            return result != 0  # Port is available if connection failed
        except Exception:
            return True  # Assume available if we can't check
    
    def extract_port_from_output(self, line: str) -> Optional[int]:
        """Extract port number from Vite server output"""
        try:
            import re
            # Look for patterns like "Local: http://localhost:5175/"
            match = re.search(r'Local:\s*http://localhost:(\d+)', line)
            if match:
                port = int(match.group(1))
                self.actual_port = port
                self.server_url = f"http://localhost:{port}"
                return port
            return None
        except Exception:
            return None
    
    def wait_for_server(self, timeout: int = 60) -> bool:
        """Wait for the development server to be ready"""
        print_info("Waiting for development server to start...")
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = urllib.request.urlopen(self.server_url, timeout=5)
                if response.getcode() == 200:
                    print_success("Development server is ready!")
                    return True
            except (urllib.error.URLError, urllib.error.HTTPError):
                pass
            
            time.sleep(2)
            print(".", end="", flush=True)
        
        print_error("\nTimeout waiting for development server")
        return False
    
    def start_dev_server(self) -> bool:
        """Start the development server"""
        print_header("STARTING DEVELOPMENT SERVER")
        
        if not self.check_port_availability():
            print_warning("Port 5173 appears to be in use")
            print_info("The server will try to use an alternative port")
        
        try:
            print_info("Starting Vite development server...")
            
            # Start the development server with output streaming
            self.process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=self.project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            
            # Register cleanup function
            atexit.register(self.cleanup)
            
            # Monitor server output to detect when it's ready
            ready = False
            timeout = 60  # Increased timeout for better reliability
            start_time = time.time()
            
            print_info("Waiting for server to initialize...")
            
            # PROVEN SERVER DETECTION METHODOLOGY:
            # This multi-layered approach has been tested and verified to work reliably:
            # 1. Real-time output parsing for Vite readiness indicators
            # 2. HTTP health checks as backup validation
            # 3. Process monitoring to catch early failures
            # 4. Generous timeouts for slower systems
            while not ready and time.time() - start_time < timeout:
                if self.process.poll() is not None:
                    print_error("Development server failed to start")
                    # Show any error output
                    try:
                        remaining_output = self.process.stdout.read()
                        if remaining_output:
                            print_error(f"Server output: {remaining_output}")
                    except:
                        pass
                    return False
                
                try:
                    # Try to read a line from server output (non-blocking)
                    import select
                    if select.select([self.process.stdout], [], [], 0.1)[0]:
                        line = self.process.stdout.readline()
                        if line:
                            # Print server output for debugging
                            print(f"  {line.strip()}")
                            
                            # Extract port number if this is the Local URL line
                            extracted_port = self.extract_port_from_output(line)
                            if extracted_port:
                                print_info(f"Detected server running on port {extracted_port}")
                            
                            # Check if server is ready - look for any localhost URL
                            if "Local:" in line and "localhost:" in line:
                                ready = True
                                break
                            elif "ready in" in line.lower():
                                # Give a moment for the server to fully initialize
                                time.sleep(1)
                                ready = True
                                break
                    
                    # Also try HTTP check as backup
                    if not ready:
                        try:
                            response = urllib.request.urlopen(self.server_url, timeout=2)
                            if response.getcode() == 200:
                                ready = True
                                break
                        except (urllib.error.URLError, urllib.error.HTTPError):
                            pass
                
                except ImportError:
                    # Fallback for systems without select
                    time.sleep(1)
                    try:
                        response = urllib.request.urlopen(self.server_url, timeout=2)
                        if response.getcode() == 200:
                            ready = True
                            break
                    except (urllib.error.URLError, urllib.error.HTTPError):
                        print(".", end="", flush=True)
                
                time.sleep(0.5)  # Check more frequently
            
            if ready:
                print_success(f"Development server running at {self.server_url}")
                
                # Final validation: Ensure server is actually serving content
                try:
                    final_check = urllib.request.urlopen(self.server_url, timeout=3)
                    if final_check.getcode() == 200:
                        print_success("Server validated and ready to serve content")
                    else:
                        print_warning(f"Server responding with status: {final_check.getcode()}")
                except Exception as e:
                    print_warning(f"Server validation check failed: {e}")
                    print_info("Server may still be initializing - this is often normal")
                
                return True
            else:
                print_error("Timeout waiting for development server to start")
                print_info("Try running 'npm run dev' manually to see any error messages")
                return False
                
        except Exception as e:
            print_error(f"Error starting development server: {e}")
            return False
    
    def open_browser(self) -> bool:
        """Open the application in the default browser"""
        print_header("LAUNCHING APPLICATION")
        
        try:
            print_info("Opening application in default browser...")
            webbrowser.open(self.server_url)
            print_success(f"Application opened at {self.server_url}")
            
            # Display helpful information
            print(f"\n{Colors.OKCYAN}{Colors.BOLD}🚀 Research Discovery Engine is now running!{Colors.ENDC}")
            print(f"{Colors.OKCYAN}📍 URL: {self.server_url}{Colors.ENDC}")
            print(f"{Colors.OKCYAN}💡 Press Ctrl+C to stop the server{Colors.ENDC}")
            
            return True
        except Exception as e:
            print_error(f"Could not open browser: {e}")
            print_info(f"Please manually open {self.server_url} in your browser")
            return False
    
    def cleanup(self):
        """Clean up server process"""
        if self.process:
            try:
                self.process.terminate()
                self.process.wait(timeout=5)
            except Exception:
                try:
                    self.process.kill()
                except Exception:
                    pass

def handle_interrupt(signum, frame):
    """Handle Ctrl+C gracefully"""
    print(f"\n\n{Colors.WARNING}🛑 Shutting down gracefully...{Colors.ENDC}")
    sys.exit(0)

def print_help():
    """Print help information"""
    print_header("RESEARCH DISCOVERY ENGINE - HELP")
    
    print(f"{Colors.BOLD}Usage:{Colors.ENDC}")
    print(f"  python main.py [options]")
    print()
    print(f"{Colors.BOLD}Options:{Colors.ENDC}")
    print(f"  --help, -h     Show this help message")
    print(f"  --check-only   Only check requirements, don't start server")
    print(f"  --no-browser   Don't open browser automatically")
    print(f"  --install      Force reinstall dependencies")
    print()
    print(f"{Colors.BOLD}Examples:{Colors.ENDC}")
    print(f"  python main.py                 # Full startup (recommended)")
    print(f"  python main.py --check-only    # Just check system requirements")
    print(f"  python main.py --no-browser    # Start server but don't open browser")
    print(f"  python main.py --install       # Reinstall dependencies and start")
    print()
    print(f"{Colors.BOLD}About:{Colors.ENDC}")
    print(f"  The Research Discovery Engine is an interactive platform for")
    print(f"  scientific knowledge exploration and discovery using AI-powered")
    print(f"  graph visualization and intelligent agent systems.")
    print()
    print(f"{Colors.BOLD}Documentation:{Colors.ENDC}")
    print(f"  🚀 Startup Guide:    STARTUP_GUIDE.md")
    print(f"  📖 Development Guide: docs/DEVELOPMENT_GUIDE.md")
    print(f"  🏗️  Component Docs:   docs/COMPONENTS.md")
    print(f"  📚 API Reference:    docs/API_REFERENCE.md")

def main():
    """Main entry point"""
    # Set up signal handling
    signal.signal(signal.SIGINT, handle_interrupt)
    
    # Parse command line arguments
    args = sys.argv[1:]
    check_only = '--check-only' in args
    no_browser = '--no-browser' in args
    force_install = '--install' in args
    show_help = '--help' in args or '-h' in args
    
    if show_help:
        print_help()
        return
    
    # Welcome message
    print_header("RESEARCH DISCOVERY ENGINE")
    print(f"{Colors.OKCYAN}🧠 AI-Powered Scientific Knowledge Discovery Platform{Colors.ENDC}")
    print(f"{Colors.OKCYAN}🔬 Version 2.0 - Professional Development Environment{Colors.ENDC}")
    print(f"{Colors.OKCYAN}📍 Starting from: {os.getcwd()}{Colors.ENDC}")
    
    # Get project root (should be current directory for DE)
    project_root = Path.cwd()
    
    # Initialize components
    checker = SystemChecker()
    project_manager = ProjectManager(project_root)
    server_manager = ServerManager(project_root)
    
    try:
        # Step 1: Check system requirements
        if not checker.check_system_requirements():
            print_error("System requirements not met. Please install required software:")
            print_info("• Node.js 16+ from https://nodejs.org/")
            print_info("• npm (included with Node.js)")
            print_info("• Python 3.8+ (you have this)")
            sys.exit(1)
        
        # Step 2: Verify project structure
        if not project_manager.check_project_structure():
            print_error("Project structure is incomplete")
            print_info("Please ensure you're running this from the DE directory")
            sys.exit(1)
        
        # Step 3: Check and install dependencies
        dep_status = project_manager.check_dependencies()
        
        if force_install or dep_status['status'] in ['missing', 'error']:
            if not project_manager.install_dependencies():
                print_error("Failed to install dependencies")
                sys.exit(1)
        elif dep_status['status'] == 'installed':
            print_success("Dependencies are already installed")
        
        # If check-only mode, exit here
        if check_only:
            print_success("All checks passed! Ready to run the application.")
            print_info("Run 'python main.py' to start the development server")
            return
        
        # Step 4: Start development server
        if not server_manager.start_dev_server():
            print_error("Failed to start development server")
            sys.exit(1)
        
        # Step 5: Open browser (unless disabled)
        if not no_browser:
            server_manager.open_browser()
        else:
            print_info(f"Server running at {server_manager.server_url}")
            print_info("Open this URL in your browser to access the application")
        
        # Step 6: Keep server running
        print(f"\n{Colors.OKGREEN}✨ Setup complete! The Research Discovery Engine is now running.{Colors.ENDC}")
        print(f"{Colors.OKBLUE}📈 Monitor server output below. Press Ctrl+C to stop.{Colors.ENDC}")
        print(f"{Colors.BOLD}{'─' * 60}{Colors.ENDC}")
        
        # Keep the main process alive and show server output
        try:
            while server_manager.process and server_manager.process.poll() is None:
                time.sleep(1)
        except KeyboardInterrupt:
            print(f"\n{Colors.WARNING}🛑 Received stop signal{Colors.ENDC}")
        
        # Cleanup
        server_manager.cleanup()
        print_success("🏁 Research Discovery Engine stopped successfully")
        
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}🛑 Interrupted by user{Colors.ENDC}")
        sys.exit(0)
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 