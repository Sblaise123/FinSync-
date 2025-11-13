from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from decouple import config

from app.database import engine, Base
from app.routes import auth, accounts, transactions

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinSync API", version="1.0.0")

origins = [
    "https://fin-sync-phi.vercel.app/",  # Replace with your Vercel domain
    "http://localhost:3000",                    # Keep for local testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for now, until it’s working)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(accounts.router)
app.include_router(transactions.router)

@app.get("/")
def root():
    return {"message": "FinSync API", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}