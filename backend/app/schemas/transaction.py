from pydantic import BaseModel
from datetime import date, datetime

class TransactionBase(BaseModel):
    description: str
    amount: float
    category: str
    transaction_date: date
    transaction_type: str

class TransactionCreate(TransactionBase):
    account_id: int

class Transaction(TransactionBase):
    id: int
    user_id: int
    account_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionStats(BaseModel):
    total_income: float
    total_expenses: float
    net_income: float
    transaction_count: int

class CategoryStats(BaseModel):
    category: str
    total: float
    count: int
    percentage: float