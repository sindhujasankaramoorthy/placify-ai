import os
import sys
from pathlib import Path

# Disable C extensions so Windows Application Control policies don't block .pyd DLLs
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

# Add project root and backend dir to sys.path so imports work regardless of launch directory
_app_dir = Path(__file__).resolve().parent
_backend_dir = _app_dir.parent
_project_root = _backend_dir.parent

for _p in [str(_project_root), str(_backend_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)
