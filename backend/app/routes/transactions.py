from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.account import Account
from app.schemas.transaction import Transaction as TransactionSchema, TransactionCreate, TransactionStats, CategoryStats
from app.utils.auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=List[TransactionSchema])
def get_transactions(limit: int = Query(100, le=500), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.transaction_date.desc()).limit(limit).all()

@router.post("/", response_model=TransactionSchema, status_code=status.HTTP_201_CREATED)
def create_transaction(transaction: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == transaction.account_id, Account.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    new_transaction = Transaction(user_id=current_user.id, **transaction.dict())
    
    if transaction.transaction_type == "income":
        account.balance += transaction.amount
    else:
        account.balance -= transaction.amount
    
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.get("/stats", response_model=TransactionStats)
def get_transaction_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    total_income = sum(t.amount for t in transactions if t.transaction_type == "income")
    total_expenses = sum(t.amount for t in transactions if t.transaction_type == "expense")
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_income": total_income - total_expenses,
        "transaction_count": len(transactions)
    }

@router.get("/category-stats", response_model=List[CategoryStats])
def get_category_stats(transaction_type: str = Query("expense"), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    results = db.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total'),
        func.count(Transaction.id).label('count')
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == transaction_type
    ).group_by(Transaction.category).all()
    
    total_amount = sum(r.total for r in results)
    
    return [{
        "category": r.category,
        "total": r.total,
        "count": r.count,
        "percentage": (r.total / total_amount * 100) if total_amount > 0 else 0
    } for r in sorted(results, key=lambda x: x.total, reverse=True)]

@router.get("/monthly", response_model=dict)
def get_monthly_summary(year: int = Query(datetime.now().year), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    monthly_data = db.query(
        extract('month', Transaction.transaction_date).label('month'),
        Transaction.transaction_type,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user.id,
        extract('year', Transaction.transaction_date) == year
    ).group_by('month', Transaction.transaction_type).all()
    
    result = {"months": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              "income": [0] * 12, "expenses": [0] * 12}
    
    for data in monthly_data:
        month_index = int(data.month) - 1
        if data.transaction_type == "income":
            result["income"][month_index] = float(data.total)
        else:
            result["expenses"][month_index] = float(data.total)
    
    return result

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    account = db.query(Account).filter(Account.id == transaction.account_id).first()
    if account:
        if transaction.transaction_type == "income":
            account.balance -= transaction.amount
        else:
            account.balance += transaction.amount
    
    db.delete(transaction)
    db.commit()
    return None