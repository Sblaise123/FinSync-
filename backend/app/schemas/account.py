from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AccountBase(BaseModel):
    account_name: str
    account_type: str
    institution: str
    balance: Optional[float] = 0.0

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    user_id: int
    last_synced: datetime
    created_at: datetime

    class Config:
        from_attributes = True