from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.account import Account
from app.schemas.account import Account as AccountSchema, AccountCreate
from app.utils.auth import get_current_user

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.get("/", response_model=List[AccountSchema])
def get_accounts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Account).filter(Account.user_id == current_user.id).all()

@router.post("/", response_model=AccountSchema, status_code=status.HTTP_201_CREATED)
def create_account(account: AccountCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_account = Account(user_id=current_user.id, **account.dict())
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(account_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id, Account.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()
    return None