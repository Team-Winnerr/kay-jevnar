from typing import Any

from fastapi import APIRouter, HTTPException, status
from sqlmodel import SQLModel

from app.api.deps import SessionDep
from app.core.config import settings
from app.seed import seed_db

router = APIRouter(prefix="/dev", tags=["dev"])


class SeedResponse(SQLModel):
    success: bool
    message: str
    created_users: int
    updated_users: int
    created_items: int
    updated_items: int
    total_users: int
    total_items: int


@router.post(
    "/seed",
    response_model=SeedResponse,
    summary="Seed database with demo data",
    description="Protected by local development environment flag. Seeds realistic users and items with diverse states.",
)
def dev_seed_database(session: SessionDep) -> Any:
    if settings.FASTAPI_ENV != "development":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Dev endpoints are disabled in non-development environments.",
        )

    try:
        result = seed_db(session)
        return SeedResponse(**result)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to seed database: {str(exc)}",
        ) from exc
