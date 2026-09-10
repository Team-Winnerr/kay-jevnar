from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app.core.config import settings
from app.models import Item, User
from app.seed import seed_db


def test_standalone_seed_db(db: Session) -> None:
    result = seed_db(db)
    assert result["success"] is True
    assert result["total_users"] >= 7
    assert result["total_items"] >= 15

    # Verify inactive user state
    inactive_user = db.exec(
        select(User).where(User.email == "jordan.lee@example.com")
    ).first()
    assert inactive_user is not None
    assert inactive_user.is_active is False
    assert inactive_user.created_at is not None

    # Verify active user with realistic timestamp
    active_user = db.exec(
        select(User).where(User.email == "sarah.chen@example.com")
    ).first()
    assert active_user is not None
    assert active_user.is_active is True
    assert active_user.full_name == "Sarah Chen"
    assert active_user.created_at is not None

    # Verify item relationships and timestamps
    items = db.exec(select(Item)).all()
    assert len(items) >= 15
    for item in items:
        assert item.owner_id is not None
        assert item.created_at is not None


def test_dev_seed_api_endpoint(client: TestClient, db: Session) -> None:
    response = client.post(f"{settings.API_V1_STR}/dev/seed")
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "total_users" in data
    assert "total_items" in data
    assert data["total_users"] >= 7
    assert data["total_items"] >= 15
