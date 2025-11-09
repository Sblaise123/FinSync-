# FinSync-
A modern, full-stack personal finance management application with transaction tracking, spending insights, and interactive visualizations.

💰 FinSync — Personal Finance Dashboard

FinSync is a modern full-stack personal finance management application that helps users track transactions, visualize spending, and gain financial insights with a clean, interactive dashboard.

🚀 Features

🔐 User Authentication — Secure JWT-based auth with FastAPI

💳 Transaction Management — Add, categorize, and track income/expenses

📊 Visual Analytics — Interactive charts with Chart.js

🧾 Category Insights — Breakdown of spending by category

📱 Responsive Design — Optimized for desktop and mobile

⚡ Mock Bank Integration — Simulated account connections

🔄 Real-Time Dashboard — Auto-refreshing financial summaries

🧩 Tech Stack

Frontend

Next.js 14 (App Router)

React 18 + TailwindCSS

Chart.js & react-chartjs-2

Axios for API calls

Backend

FastAPI + SQLAlchemy + PostgreSQL

JWT Authentication

Pydantic for data validation

DevOps

Docker & Docker Compose

Frontend → Vercel

Backend → Render / Railway

🏗️ Project Structure
finsync/
├── frontend/        # Next.js app
│   ├── app/         # Pages (dashboard, auth, analytics)
│   ├── components/  # UI & chart components
│   ├── lib/         # API + auth helpers
│   ├── public/
│   └── package.json
├── backend/         # FastAPI server
│   ├── app/         # Models, routes, schemas, utils
│   ├── seed_data.py
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
└── README.md

⚙️ Local Setup
Option 1 — Docker (Recommended)
git clone https://github.com/yourusername/finsync.git
cd finsync
docker-compose up --build


Frontend → http://localhost:3000

Backend → http://localhost:8000

API Docs → http://localhost:8000/docs

Demo Login

username: demo
password: demo123

Option 2 — Manual Setup
🖥 Backend (FastAPI)
cd backend
python -m venv venv
source venv/bin/activate   # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload


Backend runs at → http://localhost:8000

💻 Frontend (Next.js)
cd frontend
npm install
cp .env.example .env.local
npm run dev


Frontend runs at → http://localhost:3000

🌐 Deployment
Backend → Render

Build Command: pip install -r requirements.txt

Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

Add environment variables:

DATABASE_URL=<your-postgres-url>
SECRET_KEY=<your-secret-key>
CORS_ORIGINS=https://your-frontend.vercel.app

Frontend → Vercel

Root Directory: frontend

Environment Variables:

NEXT_PUBLIC_API_URL=https://your-backend.onrender.com


Click Deploy 🚀

📚 API Overview
Endpoint	Method	Description
/auth/register	POST	Register new user
/auth/login	POST	Login and get JWT
/accounts/	GET / POST	Manage accounts
/transactions/	GET / POST	Manage transactions
/transactions/stats	GET	Get spending summary
/transactions/category-stats	GET	Breakdown by category

Full interactive docs → /docs

🧠 Key Highlights

FastAPI backend ensures speed + scalability

Clean, modular code structure for easy extension

Uses Docker for full environment reproducibility

Production-ready with Vercel + Render deployment setup

🧪 Testing

Backend

cd backend
pytest


Frontend

cd frontend
npm test

💡 Future Enhancements

🔗 Real bank API integration (Plaid)

📱 Mobile-friendly dashboard improvements

🧮 Budget goal tracking

🧭 AI-powered spending recommendations
