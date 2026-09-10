"""
Standalone database seeding script for SQLModel database.
Populates realistic demo data including varied timestamps, realistic names,
and diverse test states (active, inactive, admin, regular users).
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta
from typing import Any
import uuid

from sqlmodel import Session, select

from app.core.config import settings
from app.core.db import engine
from app.core.security import get_password_hash
from app.models import Item, User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEFAULT_PASSWORD = "Password123!"


def get_demo_users_data() -> list[dict[str, Any]]:
    now = datetime.now(UTC)
    return [
        {
            "email": "sarah.chen@example.com",
            "full_name": "Sarah Chen",
            "is_active": True,
            "is_superuser": False,
            "created_at": now - timedelta(days=92, hours=4),
        },
        {
            "email": "marcus.vance@example.com",
            "full_name": "Marcus Vance",
            "is_active": True,
            "is_superuser": False,
            "created_at": now - timedelta(days=75, hours=8),
        },
        {
            "email": "elena.rostova@example.com",
            "full_name": "Dr. Elena Rostova",
            "is_active": True,
            "is_superuser": False,
            "created_at": now - timedelta(days=58, hours=2),
        },
        {
            "email": "david.kim@example.com",
            "full_name": "David Kim",
            "is_active": True,
            "is_superuser": False,
            "created_at": now - timedelta(days=41, hours=14),
        },
        {
            "email": "priya.patel@example.com",
            "full_name": "Priya Patel",
            "is_active": True,
            "is_superuser": False,
            "created_at": now - timedelta(days=23, hours=6),
        },
        {
            "email": "jordan.lee@example.com",
            "full_name": "Jordan Lee",
            "is_active": False,  # Diverse test state: inactive/suspended user
            "is_superuser": False,
            "created_at": now - timedelta(days=120, hours=11),
        },
    ]


def get_demo_items_data(user_map: dict[str, uuid.UUID]) -> list[dict[str, Any]]:
    now = datetime.now(UTC)
    admin_id = user_map.get(settings.FIRST_SUPERUSER)
    sarah_id = user_map.get("sarah.chen@example.com", admin_id)
    marcus_id = user_map.get("marcus.vance@example.com", admin_id)
    elena_id = user_map.get("elena.rostova@example.com", admin_id)
    david_id = user_map.get("david.kim@example.com", admin_id)
    priya_id = user_map.get("priya.patel@example.com", admin_id)
    jordan_id = user_map.get("jordan.lee@example.com", admin_id)

    return [
        {
            "title": "TensorFlow Edge Inference Engine",
            "description": "Quantized MobileNetV3 pipeline optimized for real-time video defect detection on edge TPUs.",
            "owner_id": elena_id,
            "created_at": now - timedelta(days=48, hours=5),
        },
        {
            "title": "Autonomous Kubernetes Node Autoscaler",
            "description": "Custom controller scaling GPU worker pools dynamically based on pending inferencing queues.",
            "owner_id": david_id,
            "created_at": now - timedelta(days=36, hours=12),
        },
        {
            "title": "Google Stitch UI Design Tokens",
            "description": "Exported design system mapping calibrated semantic tokens into Tailwind CSS utility classes.",
            "owner_id": priya_id,
            "created_at": now - timedelta(days=18, hours=2),
        },
        {
            "title": "Zero-Trust Service Mesh Architecture",
            "description": "mTLS enforcement with SPIFFE/SPIRE cryptographic identities across container namespaces.",
            "owner_id": david_id,
            "created_at": now - timedelta(days=29, hours=7),
        },
        {
            "title": "Q3 Enterprise Product Roadmap",
            "description": "Strategic OKRs, user cohort analyses, and cross-functional team deliverables for next quarter.",
            "owner_id": sarah_id,
            "created_at": now - timedelta(days=80, hours=1),
        },
        {
            "title": "High-Throughput Webhook Ingestion Service",
            "description": "Asynchronous event broker processing 15k JSON payloads per second with dead-letter queue recovery.",
            "owner_id": marcus_id,
            "created_at": now - timedelta(days=64, hours=9),
        },
        {
            "title": "Vector Similarity Search Benchmark",
            "description": "Latency and recall evaluation comparing HNSW indexing in pgvector against Qdrant on 1M embeddings.",
            "owner_id": elena_id,
            "created_at": now - timedelta(days=22, hours=16),
        },
        {
            "title": "React 19 Server Components Migration Plan",
            "description": "Technical audit of client bundles, dynamic stream boundaries, and state hydration strategies.",
            "owner_id": priya_id,
            "created_at": now - timedelta(days=14, hours=3),
        },
        {
            "title": "Database Connection Pool Optimization",
            "description": "PgBouncer configuration tuning in transaction mode, increasing concurrent client capacity by 4x.",
            "owner_id": marcus_id,
            "created_at": now - timedelta(days=51, hours=18),
        },
        {
            "title": "WCAG 2.2 AAA Accessibility Audit",
            "description": "Comprehensive review of contrast ratios, ARIA live-regions, and keyboard navigation tab-indices.",
            "owner_id": priya_id,
            "created_at": now - timedelta(days=7, hours=4),
        },
        {
            "title": "Customer Churn Predictive Model",
            "description": "Ensemble gradient boosting model with SHAP value explainability dashboards for customer success.",
            "owner_id": elena_id,
            "created_at": now - timedelta(days=33, hours=10),
        },
        {
            "title": "Multi-Factor Authentication & Passkey Rollout",
            "description": "FIDO2 WebAuthn registration flows and step-up authentication policies for sensitive endpoints.",
            "owner_id": sarah_id,
            "created_at": now - timedelta(days=60, hours=11),
        },
        {
            "title": "Legacy Batch Billing Job (Deprecated)",
            "description": "Decommissioned nightly ETL batch script; preserved for historical accounting audit compliance.",
            "owner_id": jordan_id,
            "created_at": now - timedelta(days=115, hours=20),
        },
        {
            "title": "Centralized Observability & OpenTelemetry Traces",
            "description": "Unified distributed tracing setup with Grafana Tempo, Loki logging, and Prometheus alerts.",
            "owner_id": david_id,
            "created_at": now - timedelta(days=25, hours=8),
        },
        {
            "title": "AI Agent Function Calling Orchestrator",
            "description": "Deterministic JSON schema validation layer for multi-agent tool dispatching and execution.",
            "owner_id": marcus_id,
            "created_at": now - timedelta(days=5, hours=1),
        },
    ]


def seed_db(session: Session) -> dict[str, Any]:
    """
    Populate database with demo users and items idempotently.
    Returns a summary dictionary of seeded records.
    """
    logger.info("Starting database seeding...")
    user_map: dict[str, uuid.UUID] = {}

    # Ensure admin user is registered in user_map
    admin_user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if admin_user:
        user_map[admin_user.email] = admin_user.id

    hashed_default_pwd = get_password_hash(DEFAULT_PASSWORD)
    created_users = 0
    updated_users = 0

    # 1. Seed Users
    for user_data in get_demo_users_data():
        existing_user = session.exec(
            select(User).where(User.email == user_data["email"])
        ).first()

        if not existing_user:
            new_user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                is_active=user_data["is_active"],
                is_superuser=user_data["is_superuser"],
                hashed_password=hashed_default_pwd,
                created_at=user_data["created_at"],
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            user_map[new_user.email] = new_user.id
            created_users += 1
            logger.info(f"Created user: {new_user.email}")
        else:
            # Update attributes to ensure consistency
            existing_user.full_name = user_data["full_name"]
            existing_user.is_active = user_data["is_active"]
            existing_user.is_superuser = user_data["is_superuser"]
            if user_data.get("created_at"):
                existing_user.created_at = user_data["created_at"]
            session.add(existing_user)
            session.commit()
            session.refresh(existing_user)
            user_map[existing_user.email] = existing_user.id
            updated_users += 1
            logger.info(f"Updated user: {existing_user.email}")

    # 2. Seed Items
    created_items = 0
    skipped_items = 0
    for item_data in get_demo_items_data(user_map):
        owner_id = item_data.get("owner_id")
        if not owner_id:
            continue

        existing_item = session.exec(
            select(Item).where(
                Item.title == item_data["title"],
                Item.owner_id == owner_id,
            )
        ).first()

        if not existing_item:
            new_item = Item(
                title=item_data["title"],
                description=item_data["description"],
                owner_id=owner_id,
                created_at=item_data["created_at"],
            )
            session.add(new_item)
            created_items += 1
        else:
            existing_item.description = item_data["description"]
            if item_data.get("created_at"):
                existing_item.created_at = item_data["created_at"]
            session.add(existing_item)
            skipped_items += 1

    session.commit()
    logger.info(
        f"Seeding completed: {created_users} users created, {updated_users} updated; "
        f"{created_items} items created, {skipped_items} updated."
    )

    total_users = len(session.exec(select(User)).all())
    total_items = len(session.exec(select(Item)).all())

    return {
        "success": True,
        "message": "Demo data populated successfully",
        "created_users": created_users,
        "updated_users": updated_users,
        "created_items": created_items,
        "updated_items": skipped_items,
        "total_users": total_users,
        "total_items": total_items,
    }


def main() -> None:
    with Session(engine) as session:
        result = seed_db(session)
        print("Seed Result:", result)


if __name__ == "__main__":
    main()
