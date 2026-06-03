from fastapi import APIRouter

from . import analysis, auth, chat, dashboard, reports, settings


api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(analysis.router)
api_router.include_router(chat.router)
api_router.include_router(settings.router)
api_router.include_router(reports.router)
