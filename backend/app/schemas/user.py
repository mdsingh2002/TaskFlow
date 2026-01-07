"""
Pydantic schemas for User model validation.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


# Shared properties
class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True


# Properties to receive on user creation
class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8, max_length=100)
    role: UserRole = UserRole.USER


# Properties to receive on user update
class UserUpdate(BaseModel):
    """Schema for updating a user."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8, max_length=100)
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None


# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    """Base schema for user in database."""
    id: int
    role: UserRole
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# Properties to return to client
class User(UserInDBBase):
    """Schema for user response."""
    pass


# Properties stored in DB
class UserInDB(UserInDBBase):
    """Schema for user in database with hashed password."""
    hashed_password: str
