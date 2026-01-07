"""
Database seeding script for test data.
Creates sample users and tasks for testing purposes.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models import User, UserRole, Task, TaskStatus


def seed_data(test: bool = False):
    """
    Seed the database with test data.

    Args:
        test: If True, use test database configuration
    """
    db = SessionLocal()

    try:
        print("Seeding database with test data...")

        # Create admin user
        admin = User(
            email="admin@taskflow.com",
            hashed_password=get_password_hash("Admin123!"),
            full_name="Admin User",
            role=UserRole.ADMIN,
            is_active=True,
        )
        db.add(admin)

        # Create regular users
        user1 = User(
            email="user1@taskflow.com",
            hashed_password=get_password_hash("User123!"),
            full_name="John Doe",
            role=UserRole.USER,
            is_active=True,
        )
        db.add(user1)

        user2 = User(
            email="user2@taskflow.com",
            hashed_password=get_password_hash("User123!"),
            full_name="Jane Smith",
            role=UserRole.USER,
            is_active=True,
        )
        db.add(user2)

        db.commit()
        db.refresh(admin)
        db.refresh(user1)
        db.refresh(user2)

        # Create sample tasks for user1
        tasks_user1 = [
            Task(
                title="Complete project documentation",
                description="Write comprehensive documentation for the TaskFlow project",
                status=TaskStatus.IN_PROGRESS,
                owner_id=user1.id,
            ),
            Task(
                title="Review pull requests",
                description="Review and merge pending pull requests",
                status=TaskStatus.TODO,
                owner_id=user1.id,
            ),
            Task(
                title="Fix authentication bug",
                description="Investigate and fix the authentication issue reported in #123",
                status=TaskStatus.DONE,
                owner_id=user1.id,
            ),
        ]

        # Create sample tasks for user2
        tasks_user2 = [
            Task(
                title="Design new UI mockups",
                description="Create mockups for the new dashboard design",
                status=TaskStatus.IN_PROGRESS,
                owner_id=user2.id,
            ),
            Task(
                title="Update dependencies",
                description="Update all npm and Python dependencies to latest versions",
                status=TaskStatus.TODO,
                owner_id=user2.id,
            ),
        ]

        for task in tasks_user1 + tasks_user2:
            db.add(task)

        db.commit()

        print(f"Successfully seeded database with:")
        print(f"  - 3 users (1 admin, 2 regular users)")
        print(f"  - 5 tasks")
        print(f"\nTest credentials:")
        print(f"  Admin: admin@taskflow.com / Admin123!")
        print(f"  User1: user1@taskflow.com / User123!")
        print(f"  User2: user2@taskflow.com / User123!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Seed the database with test data")
    parser.add_argument(
        "--test",
        action="store_true",
        help="Use test database configuration"
    )
    args = parser.parse_args()

    seed_data(test=args.test)
