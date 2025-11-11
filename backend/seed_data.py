from datetime import datetime, timedelta
import random
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.account import Account
from app.models.transaction import Transaction
from app.utils.auth import get_password_hash

EXPENSE_CATEGORIES = ["Groceries", "Dining", "Transportation", "Entertainment", "Utilities", "Shopping", "Healthcare", "Rent", "Other"]
INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Other"]

EXPENSE_DESCRIPTIONS = {
    "Groceries": ["Whole Foods", "Trader Joe's", "Walmart"],
    "Dining": ["Starbucks", "McDonald's", "Restaurant"],
    "Transportation": ["Uber", "Gas Station", "Transit"],
    "Entertainment": ["Netflix", "Movie", "Spotify"],
    "Utilities": ["Electric", "Internet", "Phone"],
    "Shopping": ["Amazon", "Target", "Store"],
    "Healthcare": ["Pharmacy", "Doctor"],
    "Rent": ["Monthly Rent"],
    "Other": ["Miscellaneous"]
}

def create_seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        if db.query(User).filter(User.username == "demo").first():
            print("Demo user exists. Skipping.")
            return
        
        demo_user = User(email="demo@finsync.com", username="demo", hashed_password=get_password_hash("demo123"))
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        accounts = [
            Account(user_id=demo_user.id, account_name="Main Checking", account_type="checking", balance=5420.50, institution="Chase Bank"),
            Account(user_id=demo_user.id, account_name="Savings", account_type="savings", balance=12500.00, institution="Bank of America"),
            Account(user_id=demo_user.id, account_name="Credit Card", account_type="credit", balance=-1250.30, institution="Amex")
        ]
        
        for account in accounts:
            db.add(account)
        db.commit()
        
        transactions = []
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=180)
        
        current_date = start_date
        while current_date <= end_date:
            for _ in range(random.randint(0, 3)):
                transaction_type = "expense" if random.random() < 0.8 else "income"
                
                if transaction_type == "expense":
                    category = random.choice(EXPENSE_CATEGORIES)
                    amount = round(random.uniform(10, 500), 2)
                    description = random.choice(EXPENSE_DESCRIPTIONS.get(category, ["Purchase"]))
                    account = random.choice([accounts[0], accounts[2]])
                else:
                    category = random.choice(INCOME_CATEGORIES)
                    amount = round(random.uniform(500, 3000), 2)
                    description = category
                    account = accounts[0]
                
                transactions.append(Transaction(
                    user_id=demo_user.id, account_id=account.id, description=description,
                    amount=amount, category=category, transaction_date=current_date, transaction_type=transaction_type
                ))
            current_date += timedelta(days=1)
        
        for month_offset in range(6):
            trans_date = end_date - timedelta(days=30 * month_offset)
            transactions.append(Transaction(user_id=demo_user.id, account_id=accounts[0].id, description="Monthly Salary",
                                          amount=5000.00, category="Salary", transaction_date=trans_date, transaction_type="income"))
            transactions.append(Transaction(user_id=demo_user.id, account_id=accounts[0].id, description="Rent",
                                          amount=1500.00, category="Rent", transaction_date=trans_date, transaction_type="expense"))
        
        for transaction in transactions:
            db.add(transaction)
        db.commit()
        
        print(f"\n✅ Created demo user, {len(accounts)} accounts, {len(transactions)} transactions")
        print("Login: demo / demo123")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data()