from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class SubscriptionCreate(BaseModel):
    platform: str
    name: str
    cost: float
    billing_cycle: str
    renewal_date: date

class SubscriptionUpdate(BaseModel):
    platform: Optional[str] = None
    name: Optional[str] = None
    cost: Optional[float] = None
    billing_cycle: Optional[str] = None
    renewal_date: Optional[date] = None
    status: Optional[str] = None

class Subscription(BaseModel):
    id: Optional[str] = None
    user_id: str
    platform: str
    name: str
    cost: float
    billing_cycle: str
    renewal_date: date
    status: str = "active"
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class SubscriptionResponse(BaseModel):
    id: str
    platform: str
    name: str
    cost: float
    billing_cycle: str
    renewal_date: date
    status: str