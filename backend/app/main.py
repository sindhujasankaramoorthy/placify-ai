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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.db.session import Base, engine
from backend.app.api.v1.router import api_router
from backend.app.api.v1.endpoints.ats import router as ats_direct_router

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS middleware for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)
# Direct route support for /api/ats/presets, /api/ats/scan, /api/ats/history
app.include_router(ats_direct_router, prefix="/api", tags=["ats"])


@app.get("/health")
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}
