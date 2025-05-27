#!/usr/bin/env python3
"""
Research Discovery Engine - Script Runner
Convenience wrapper for the main script orchestrator
"""

import os
import sys
from pathlib import Path

# Add the src/scripts directory to the path
project_root = Path(__file__).parent
scripts_dir = project_root / "src" / "scripts"
sys.path.insert(0, str(scripts_dir))

# Change to project directory for proper execution context
os.chdir(project_root)

# Import and run the main orchestrator
if __name__ == "__main__":
    from main import main
    main() 