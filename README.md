# GradPath AI - Setup Guide

GradPath AI is an intelligent university and career mentor designed to guide students planning to study abroad.

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Google Gemini API Key** (Get one at [aistudio.google.com](https://aistudio.google.com/))

---

## 1. Backend Setup (FastAPI)

1. **Navigate to the root directory.**
2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure Environment Variables:**
   Create a `.env` file in the root based on `.env.example`:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   JWT_SECRET="gradpath-secret-key"
   ```
5. **Seed the Database (Optional):**
   This creates test users (`admin@test.com` / `student@test.com` with passwords `admin1234` / `test1234`).
   ```bash
   python backend/seed.py
   ```
6. **Start the Backend:**
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

---

## 2. Frontend Setup (Next.js)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   ```
4. **Start the Frontend:**
   ```bash
   npm run dev
   ```

---

## 3. API Reference

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/auth/signup` | POST | Public | Register new user |
| `/auth/login` | POST | Public | Get JWT token |
| `/profile` | GET | Token | Get student profile |
| `/profile` | POST | Token | Create/Update profile |
| `/ars` | GET | Token | Get Admission Readiness Score |
| `/ai/chat` | POST | Token | Chat with Gemini AI Mentor |
| `/universities`| POST | Token | Filter matched universities |
| `/loan` | GET | Public | EMI Calculator |
| `/admin/users` | GET | Admin | List all users |

### Create First Admin
The first user to sign up via `/auth/signup` is automatically granted the `admin` role. Alternatively, use `backend/seed.py`.
