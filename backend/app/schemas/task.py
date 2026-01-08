"""
Pydantic schemas for Task model validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.models.task import TaskStatus


# Shared properties
class TaskBase(BaseModel):
    """Base task schema with common fields."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO


# Properties to receive on task creation
class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    pass


# Properties to receive on task update
class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None


# Properties to receive for status update only
class TaskStatusUpdate(BaseModel):
    """Schema for updating only the task status."""
    status: TaskStatus


# Properties shared by models stored in DB
class TaskInDBBase(TaskBase):
    """Base schema for task in database."""
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# Properties to return to client
class Task(TaskInDBBase):
    """Schema for task response."""
    pass


# Properties stored in DB
class TaskInDB(TaskInDBBase):
    """Schema for task in database."""
    pass
