"""
Task database model with status tracking.
"""

import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base


class TaskStatus(str, enum.Enum):
    """Task status enumeration for workflow management."""
    TODO = "To Do"
    IN_PROGRESS = "In Progress"
    DONE = "Done"


class Task(Base):
    """
    Task model for task management.

    Attributes:
        id: Primary key
        title: Task title
        description: Detailed task description
        status: Current task status (To Do, In Progress, Done)
        owner_id: Foreign key to user who owns this task
        created_at: Timestamp of task creation
        updated_at: Timestamp of last update
        owner: Relationship to the user who owns this task
    """

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    owner = relationship("User", back_populates="tasks")

    def __repr__(self) -> str:
        return f"<Task {self.title} - {self.status.value}>"
