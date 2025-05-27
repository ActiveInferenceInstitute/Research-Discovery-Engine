#!/usr/bin/env python3
"""
Research Discovery Engine - Script Orchestrator
Main script that coordinates execution of all setup, data, workflow, and deployment scripts
"""

import os
import sys
import subprocess
import argparse
import json
import time
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

# Add emoji support for cross-platform compatibility
import platform
if platform.system() == "Windows":
    # Enable ANSI escape sequences on Windows
    os.system("color")

class ScriptStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"

@dataclass
class ScriptInfo:
    name: str
    path: str
    description: str
    category: str
    dependencies: List[str]
    optional: bool = False
    args: Optional[List[str]] = None

class ScriptOrchestrator:
    def __init__(self):
        self.scripts_dir = Path(__file__).parent
        self.project_root = self.scripts_dir.parent.parent
        self.src_dir = self.scripts_dir.parent  # src/ directory
        self.results_dir = self.src_dir / "orchestrator-results"
        self.execution_log = []
        self.start_time: Optional[datetime] = None
        
        # Script definitions in execution order
        self.scripts = [
            # Setup Phase
            ScriptInfo(
                name="fast-setup",
                path="setup/fast-setup.sh",
                description="Fast setup and dependency installation for DE",
                category="setup",
                dependencies=[],
                optional=False
            ),
            
            # DE Function Testing Phase
            ScriptInfo(
                name="verify-de-ready",
                path="setup/verify-de-ready.sh",
                description="Final verification that DE is ready and show launch instructions",
                category="setup",
                dependencies=["fast-setup"],
                optional=False
            ),
            
            # Data Phase (with default args for demo)
            ScriptInfo(
                name="import-concepts",
                path="data/import-concepts.sh",
                description="Import concept data into knowledge graph (demo mode)",
                category="data",
                dependencies=["verify-de-ready"],
                optional=True,
                args=["--dry-run", "DE/KG/materials.md"]  # Demo with existing data
            ),
            
            # Workflow Phase (with default domain)
            ScriptInfo(
                name="research-pipeline",
                path="workflows/research-pipeline.sh",
                description="Run complete research discovery pipeline (demo mode)",
                category="workflow",
                dependencies=["verify-de-ready"],
                optional=True,
                args=["--dry-run", "materials-science"]  # Demo with materials science
            ),
            
            # Export Phase (skip if no backend)
            ScriptInfo(
                name="export-graph",
                path="data/export-graph.sh", 
                description="Export knowledge graph in multiple formats",
                category="data",
                dependencies=["verify-de-ready"],
                optional=True
            ),
            
            # Deployment Phase
            ScriptInfo(
                name="deploy",
                path="deployment/deploy.sh",
                description="Deploy to production environment",
                category="deployment",
                dependencies=["verify-de-ready"],
                optional=True
            )
        ]
        
        self.status = {script.name: ScriptStatus.PENDING for script in self.scripts}

    def print_header(self):
        """Print a beautiful header with project information."""
        print("\n" + "=" * 80)
        print("🔬 RESEARCH DISCOVERY ENGINE - SCRIPT ORCHESTRATOR")
        print("=" * 80)
        print(f"📅 Execution Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📁 Project Root: {self.project_root}")
        print(f"📊 Total Scripts: {len(self.scripts)}")
        print("=" * 80 + "\n")

    def print_script_overview(self):
        """Print an overview of all scripts to be executed."""
        print("📋 SCRIPT EXECUTION PLAN")
        print("-" * 50)
        
        categories = {}
        for script in self.scripts:
            if script.category not in categories:
                categories[script.category] = []
            categories[script.category].append(script)
        
        category_emojis = {
            "setup": "⚙️",
            "data": "📊",
            "workflow": "🔬",
            "deployment": "🚀"
        }
        
        for category, scripts in categories.items():
            emoji = category_emojis.get(category, "📁")
            print(f"\n{emoji} {category.upper()} PHASE:")
            for script in scripts:
                status_emoji = "⏳" if not script.optional else "🔵"
                required_text = "Required" if not script.optional else "Optional"
                print(f"  {status_emoji} {script.name:<20} - {script.description} ({required_text})")
        
        print("\n" + "-" * 50)

    def log_step(self, emoji: str, message: str, level: str = "INFO"):
        """Log a step with emoji and formatting."""
        timestamp = datetime.now().strftime("%H:%M:%S")
        colored_message = self.colorize_message(message, level)
        log_entry = f"[{timestamp}] {emoji} {colored_message}"
        print(log_entry)
        
        self.execution_log.append({
            "timestamp": timestamp,
            "emoji": emoji,
            "message": message,
            "level": level
        })

    def colorize_message(self, message: str, level: str) -> str:
        """Add color to messages based on level."""
        colors = {
            "INFO": "\033[94m",      # Blue
            "SUCCESS": "\033[92m",   # Green
            "WARNING": "\033[93m",   # Yellow
            "ERROR": "\033[91m",     # Red
            "RESET": "\033[0m"       # Reset
        }
        
        color = colors.get(level, colors["INFO"])
        return f"{color}{message}{colors['RESET']}"

    def check_dependencies(self, script: ScriptInfo) -> bool:
        """Check if script dependencies are satisfied."""
        for dep in script.dependencies:
            if self.status[dep] != ScriptStatus.COMPLETED:
                return False
        return True

    def check_script_prerequisites(self, script: ScriptInfo) -> bool:
        """Check if script-specific prerequisites are met."""
        # For export-graph, check if API is available
        if script.name == "export-graph":
            try:
                import subprocess
                result = subprocess.run(
                    ["curl", "-s", "--fail", "http://localhost:8000/api/v1/health/"],
                    capture_output=True, timeout=5
                )
                if result.returncode != 0:
                    self.log_step("⚠️", "Backend API not available - skipping export-graph", "WARNING")
                    return False
            except Exception:
                self.log_step("⚠️", "Cannot check API availability - skipping export-graph", "WARNING")
                return False
        
        # For deploy, check if deployment tools are available
        if script.name == "deploy":
            try:
                import subprocess
                result = subprocess.run(
                    ["which", "vercel"], capture_output=True
                )
                if result.returncode != 0:
                    self.log_step("⚠️", "Vercel CLI not installed - skipping deploy", "WARNING")
                    self.log_step("💡", "Install with: npm i -g vercel", "INFO")
                    return False
            except Exception:
                self.log_step("⚠️", "Cannot check deployment tools - skipping deploy", "WARNING")
                return False
        
        return True

    def check_script_exists(self, script: ScriptInfo) -> bool:
        """Check if script file exists."""
        script_path = self.scripts_dir / script.path
        return script_path.exists() and script_path.is_file()

    def make_executable(self, script_path: Path):
        """Make script executable on Unix systems."""
        if platform.system() != "Windows":
            os.chmod(script_path, 0o755)

    def execute_script(self, script: ScriptInfo, args: Optional[List[str]] = None) -> Tuple[bool, str, str]:
        """Execute a single script and return success status with output."""
        script_path = self.scripts_dir / script.path
        
        if not self.check_script_exists(script):
            return False, "", f"Script not found: {script_path}"
        
        # Make executable
        self.make_executable(script_path)
        
        # Prepare command
        cmd = [str(script_path)]
        if args:
            cmd.extend(args)
        if script.args:
            cmd.extend(script.args)
        
        self.log_step("🚀", f"Executing: {script.name}")
        self.log_step("📝", f"Command: {' '.join(cmd)}")
        
        try:
            # Execute with real-time output
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                cwd=self.project_root,
                bufsize=1,
                universal_newlines=True
            )
            
            stdout_lines = []
            stderr_lines = []
            
            # Read output in real-time
            while True:
                if process.stdout is not None:
                    output = process.stdout.readline()
                    if output == '' and process.poll() is not None:
                        break
                    if output:
                        line = output.strip()
                        stdout_lines.append(line)
                        # Show important output lines
                        if any(keyword in line.lower() for keyword in ['error', 'success', 'completed', 'failed']):
                            self.log_step("📤", f"  {line}", "INFO")
                else:
                    break
            
            # Get remaining output
            remaining_stdout, remaining_stderr = process.communicate()
            if remaining_stdout:
                stdout_lines.extend(remaining_stdout.strip().split('\n'))
            if remaining_stderr:
                stderr_lines.extend(remaining_stderr.strip().split('\n'))
            
            stdout = '\n'.join(stdout_lines)
            stderr = '\n'.join(stderr_lines)
            
            return process.returncode == 0, stdout, stderr
            
        except Exception as e:
            return False, "", str(e)

    def save_execution_report(self):
        """Save detailed execution report."""
        self.results_dir.mkdir(exist_ok=True)
        
        report = {
            "execution_id": f"orchestrator-{int(time.time())}",
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": datetime.now().isoformat(),
            "duration_seconds": int((datetime.now() - self.start_time).total_seconds()) if self.start_time else 0,
            "scripts": {
                script.name: {
                    "status": self.status[script.name].value,
                    "description": script.description,
                    "category": script.category,
                    "optional": script.optional,
                    "dependencies": script.dependencies
                }
                for script in self.scripts
            },
            "execution_log": self.execution_log,
            "summary": self.get_execution_summary()
        }
        
        report_file = self.results_dir / f"execution-report-{int(time.time())}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        self.log_step("💾", f"Execution report saved: {report_file}")

    def launch_discovery_engine(self):
        """Launch Discovery Engine and keep it running in foreground with logging."""
        self.log_step("🚀", "Launching Discovery Engine web interface...", "SUCCESS")
        print(f"\n{'='*80}")
        print("🚀 DISCOVERY ENGINE LAUNCHING")
        print(f"{'='*80}")
        
        de_path = self.project_root / "DE"
        
        # Check if DE directory exists
        if not de_path.exists():
            self.log_step("❌", f"Discovery Engine directory not found: {de_path}", "ERROR")
            return False
        
        # Check if dependencies are installed
        if not (de_path / "node_modules").exists():
            self.log_step("❌", "Dependencies not installed", "ERROR")
            self.log_step("💡", "Run setup first: python src/scripts/main.py --categories setup", "INFO")
            return False
        
        # Display launch information
        print("\n🌐 WEB INTERFACE STARTING...")
        print(f"   📍 Location: {de_path}")
        print(f"   🔗 URL: http://localhost:5173")
        print(f"   📊 Logs: Real-time output below")
        print(f"\n{'='*80}")
        print("📊 SERVER LOGS (Press Ctrl+C to stop)")
        print(f"{'='*80}\n")
        
        # Change to DE directory and start server
        import os
        import subprocess
        
        try:
            # Start the development server in foreground
            os.chdir(str(de_path))
            
            # Open browser after a delay
            def open_browser_delayed():
                import time
                import webbrowser
                time.sleep(8)  # Wait for server to start
                try:
                    webbrowser.open("http://localhost:5173")
                    print("\n🌐 Browser opened: http://localhost:5173")
                except Exception:
                    print("\n🌐 Please open your browser and go to: http://localhost:5173")
            
            # Start browser opener in background thread
            import threading
            browser_thread = threading.Thread(target=open_browser_delayed)
            browser_thread.daemon = True
            browser_thread.start()
            
            # Show initial success message
            print("🚀 Starting Vite development server...")
            print("⏳ Server initializing... (will auto-open browser)")
            print("🔗 Manual access: http://localhost:5173")
            print(f"{'='*50}")
            
            # Run npm dev in foreground - this will keep the script running
            result = subprocess.run(["npm", "run", "dev"], check=True)
            
            return True
            
        except KeyboardInterrupt:
            print(f"\n\n{'='*80}")
            print("🛑 Discovery Engine stopped by user")
            print(f"{'='*80}")
            print("\n✅ To restart: python src/scripts/main.py --categories setup --launch")
            print("✅ Or manually: cd DE && npm run dev")
            return True
            
        except subprocess.CalledProcessError as e:
            self.log_step("❌", f"Failed to start Discovery Engine: {e}", "ERROR")
            self.log_step("💡", "Try: cd DE && npm install && npm run dev", "INFO")
            return False
            
        except Exception as e:
            self.log_step("❌", f"Unexpected error launching Discovery Engine: {e}", "ERROR")
            return False

    def get_execution_summary(self) -> Dict:
        """Generate execution summary statistics."""
        summary = {
            "total_scripts": len(self.scripts),
            "completed": sum(1 for status in self.status.values() if status == ScriptStatus.COMPLETED),
            "failed": sum(1 for status in self.status.values() if status == ScriptStatus.FAILED),
            "skipped": sum(1 for status in self.status.values() if status == ScriptStatus.SKIPPED),
            "success_rate": 0.0
        }
        
        executed = summary["completed"] + summary["failed"]
        if executed > 0:
            summary["success_rate"] = (summary["completed"] / executed) * 100
        
        return summary

    def print_final_summary(self):
        """Print final execution summary."""
        summary = self.get_execution_summary()
        duration = (datetime.now() - self.start_time).total_seconds() if self.start_time else 0
        
        print("\n" + "=" * 80)
        print("📊 EXECUTION SUMMARY")
        print("=" * 80)
        print(f"⏱️  Total Duration: {duration:.1f} seconds")
        print(f"📈 Success Rate: {summary['success_rate']:.1f}%")
        print(f"✅ Completed: {summary['completed']}")
        print(f"❌ Failed: {summary['failed']}")
        print(f"⏭️  Skipped: {summary['skipped']}")
        print()
        
        # Show individual script status
        for script in self.scripts:
            status = self.status[script.name]
            emoji_map = {
                ScriptStatus.COMPLETED: "✅",
                ScriptStatus.FAILED: "❌",
                ScriptStatus.SKIPPED: "⏭️",
                ScriptStatus.PENDING: "⏳"
            }
            emoji = emoji_map.get(status, "❓")
            print(f"{emoji} {script.name:<20} - {script.description}")
        
        print("=" * 80)
        
        if summary['failed'] > 0:
            print("\n⚠️  Some scripts failed. Check the logs above for details.")
            print("💡 You can run individual scripts manually if needed.")
        elif summary['completed'] > 0:
            print("\n🎉 All executed scripts completed successfully!")
            
            # Provide next steps based on what was completed
            completed_scripts = [script_name for script_name, status in self.status.items() if status == ScriptStatus.COMPLETED]
            
        # Always show launch instructions if core setup is complete
        if "fast-setup" in [script_name for script_name, status in self.status.items() if status == ScriptStatus.COMPLETED] and \
           "verify-de-ready" in [script_name for script_name, status in self.status.items() if status == ScriptStatus.COMPLETED]:
            print(f"\n{'='*80}")
            print("🚀 DISCOVERY ENGINE IS READY TO LAUNCH!")
            print(f"{'='*80}")
            print("\n🌟 START THE DISCOVERY ENGINE:")
            print("   Method 1 (Recommended): ./start-de.sh")
            print("   Method 2 (Manual):      cd DE && npm run dev")
            print("\n🌐 ACCESS THE WEB INTERFACE:")
            print("   🔗 http://localhost:5173")
            print("   📱 Open this URL in your browser")
            print("\n✨ AVAILABLE FEATURES:")
            print("   🧠 Interactive 3D Knowledge Graph Visualization")
            print("   🎨 Concept Design and AI-Assisted Discovery")
            print("   🤖 Agent-Based Research Assistance")
            print("   📚 Multi-Modal Knowledge Browsing")
            print("   🔍 Real-time Graph Exploration")
            print(f"\n{'='*80}")
            
        completed_scripts = [script_name for script_name, status in self.status.items() if status == ScriptStatus.COMPLETED]
        if any("import" in script or "export" in script for script in completed_scripts):
            print("\n📊 Data operations completed successfully")
            
        if "research-pipeline" in completed_scripts:
            print("\n🔬 Research pipeline executed - check results")
            
        if "deploy" in completed_scripts:
            print("\n🚀 Deployment completed - check deployment status")
        
        print(f"\n📁 Results saved in: {self.results_dir}")
        print(f"📄 Execution report: {self.results_dir}/execution-report-{int(time.time())}.json")

    def run_all(self, categories: Optional[List[str]] = None, skip_optional: bool = False, dry_run: bool = False):
        """Run all scripts in the correct order."""
        self.start_time = datetime.now()
        
        self.print_header()
        self.print_script_overview()
        
        if dry_run:
            self.log_step("🔍", "DRY RUN MODE - No scripts will be executed", "WARNING")
            print()
        
        # Filter scripts by categories if specified
        scripts_to_run = self.scripts
        if categories:
            scripts_to_run = [s for s in self.scripts if s.category in categories]
            self.log_step("🎯", f"Filtering by categories: {', '.join(categories)}")
        
        if skip_optional:
            scripts_to_run = [s for s in scripts_to_run if not s.optional]
            self.log_step("⚡", "Skipping optional scripts")
        
        self.log_step("🎬", f"Starting execution of {len(scripts_to_run)} scripts...")
        print()
        
        for i, script in enumerate(scripts_to_run, 1):
            print(f"{'='*60}")
            self.log_step("📋", f"PHASE {i}/{len(scripts_to_run)}: {script.name.upper()}")
            self.log_step("📝", f"Description: {script.description}")
            self.log_step("📂", f"Category: {script.category.upper()}")
            self.log_step("⚙️", f"Required: {'Yes' if not script.optional else 'No (Optional)'}")
            print(f"{'='*60}")
            
            # Check dependencies
            if script.dependencies:
                self.log_step("🔗", f"Dependencies: {', '.join(script.dependencies)}")
                if not self.check_dependencies(script):
                    self.log_step("⚠️", f"Dependencies not met for {script.name}", "WARNING")
                    missing_deps = [dep for dep in script.dependencies if self.status[dep] != ScriptStatus.COMPLETED]
                    self.log_step("🔍", f"Missing: {', '.join(missing_deps)}")
                    self.status[script.name] = ScriptStatus.SKIPPED
                    continue
                else:
                    self.log_step("✅", "All dependencies satisfied")
            else:
                self.log_step("🔗", "No dependencies required")
            
            # Check if script exists
            if not self.check_script_exists(script):
                self.log_step("❌", f"Script not found: {script.path}", "ERROR")
                self.status[script.name] = ScriptStatus.FAILED
                continue
            
            # Check script-specific prerequisites for optional scripts
            if script.optional and not self.check_script_prerequisites(script):
                self.log_step("⏭️", f"Prerequisites not met for {script.name} - skipping", "WARNING")
                self.status[script.name] = ScriptStatus.SKIPPED
                continue
            
            script_path = self.scripts_dir / script.path
            self.log_step("📍", f"Script location: {script_path}")
            
            if dry_run:
                self.log_step("👀", f"Would execute: {script.path}")
                self.status[script.name] = ScriptStatus.COMPLETED
                continue
            
            # Execute script
            self.status[script.name] = ScriptStatus.RUNNING
            start_time = datetime.now()
            success, stdout, stderr = self.execute_script(script)
            execution_time = (datetime.now() - start_time).total_seconds()
            
            if success:
                self.log_step("✅", f"Completed: {script.name} (in {execution_time:.1f}s)", "SUCCESS")
                self.status[script.name] = ScriptStatus.COMPLETED
                
                # Log specific success messages based on script type
                if script.name == "fast-setup":
                    self.log_step("🎉", "Discovery Engine setup completed - components ready!")
                elif script.name == "verify-de-ready":
                    self.log_step("🚀", "DE verification complete - ready to launch!")
                elif "import" in script.name:
                    self.log_step("📊", "Data import completed successfully")
                elif "export" in script.name:
                    self.log_step("💾", "Data export completed successfully")
                elif script.name == "research-pipeline":
                    self.log_step("🔬", "Research pipeline execution completed")
                elif script.name == "deploy":
                    self.log_step("🌐", "Deployment process completed")
                    
            else:
                self.log_step("❌", f"Failed: {script.name} (after {execution_time:.1f}s)", "ERROR")
                if stderr:
                    self.log_step("🚨", f"Error output: {stderr[:200]}...", "ERROR")
                self.status[script.name] = ScriptStatus.FAILED
                
                # Ask if user wants to continue
                if not script.optional:
                    response = input(f"\n❓ {script.name} failed. Continue anyway? (y/N): ")
                    if response.lower() != 'y':
                        self.log_step("🛑", "Execution stopped by user")
                        break
                else:
                    self.log_step("⏭️", "Optional script failed - continuing with remaining scripts")
            
            print()
        
        self.print_final_summary()
        self.save_execution_report()

def main():
    parser = argparse.ArgumentParser(
        description="Research Discovery Engine Script Orchestrator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py                           # Run all scripts and launch web interface
  python main.py --no-launch              # Run all scripts without launching
  python main.py --categories setup       # Run only setup scripts and launch
  python main.py --skip-optional          # Skip optional scripts and launch
  python main.py --dry-run               # Preview what would run
  python main.py --help                  # Show this help

Quick Start:
  python main.py                          # Setup, run all scripts, and launch interface
        """
    )
    
    parser.add_argument(
        "--categories",
        nargs="+",
        choices=["setup", "data", "workflow", "deployment"],
        help="Run only scripts from specified categories"
    )
    
    parser.add_argument(
        "--skip-optional",
        action="store_true",
        help="Skip optional scripts"
    )
    
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be executed without running anything"
    )
    
    parser.add_argument(
        "--list",
        action="store_true",
        help="List all available scripts and exit"
    )
    
    parser.add_argument(
        "--no-launch",
        action="store_true",
        help="Don't automatically launch Discovery Engine after setup (default is to launch)"
    )
    
    args = parser.parse_args()
    
    orchestrator = ScriptOrchestrator()
    
    if args.list:
        orchestrator.print_script_overview()
        return
    
    try:
        orchestrator.run_all(
            categories=args.categories,
            skip_optional=args.skip_optional,
            dry_run=args.dry_run
        )
        
        # Auto-launch by default (unless --no-launch or --dry-run)
        if not args.no_launch and not args.dry_run:
            setup_completed = all(
                orchestrator.status.get(script) == ScriptStatus.COMPLETED 
                for script in ["fast-setup", "verify-de-ready"]
            )
            if setup_completed:
                print(f"\n{'='*80}")
                print("🎯 LAUNCHING DISCOVERY ENGINE AUTOMATICALLY")
                print("   (Use --no-launch flag to skip this step)")
                print(f"{'='*80}")
                orchestrator.launch_discovery_engine()
            else:
                orchestrator.log_step("⚠️", "Setup not completed - cannot auto-launch", "WARNING")
                orchestrator.log_step("💡", "Run: python main.py --categories setup to complete setup", "INFO")
                
    except KeyboardInterrupt:
        orchestrator.log_step("🛑", "Execution interrupted by user", "WARNING")
        orchestrator.save_execution_report()
        sys.exit(1)
    except Exception as e:
        orchestrator.log_step("💥", f"Unexpected error: {str(e)}", "ERROR")
        orchestrator.save_execution_report()
        sys.exit(1)

if __name__ == "__main__":
    main() 