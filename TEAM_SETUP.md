# Team Setup & Collaboration Guide (4-Person Hackathon)

This guide gets all 4 team members up and running with the exact same verified environment in under 3 minutes.

---

## 🚀 Quick Start for Teammates

### 1. Clone & Environment Config
```bash
git clone <your-repo-url>
cd HACKATHON

# Copy the environment template
cp .env.example .env
```
*(Add your `GEMINI_API_KEY` into `.env` if you are working on the AI/LLM features.)*

### 2. Start PostgreSQL Database
```bash
docker compose up -d db
```
*Note: PostgreSQL is mapped to port **5433** to prevent conflicts with any local Postgres installations.*

### 3. Start Backend (FastAPI + SQLModel)
```bash
cd backend
uv sync
uv run alembic upgrade head
uv run python app/seed.py
uv run fastapi dev
```
* Backend API: http://localhost:8000
* Interactive Swagger Docs: http://localhost:8000/docs

### 4. Start Frontend (React 19 + Vite)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
* Frontend Web App: http://localhost:5173

---

## 👥 Recommended 4-Person Role Division

| Role | Member Focus | Key Files & Tools |
| :--- | :--- | :--- |
| **1. Frontend Lead** | UI screens, layouts, Tailwind styling, Stitch design imports (`DESIGN.md`) | `frontend/src/routes/`, `frontend/src/components/` |
| **2. Backend Lead** | SQLModel data models, Alembic migrations, CRUD API endpoints | `backend/app/models.py`, `backend/app/api/` |
| **3. AI / LLM Lead** | Gemini 2.5/3.6 Flash calls, prompt engineering, agent function calling | `backend/app/core/`, `google-genai` SDK |
| **4. Integration & Pitch Lead** | Wiring APIs to frontend, testing end-to-end flows, seed data, demo slides | `frontend/src/client/`, `app/seed.py`, pitch deck |

---

## 🌿 Git Collaboration Rules to Avoid Merge Conflicts

1. **Never commit directly to `main` during active coding**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Keep diffs scoped** to your assigned directories (as required in `AGENT.md`).
3. **Database Changes**: Only **one** person should generate Alembic revisions:
   ```bash
   uv run alembic revision --autogenerate -m "add_table_xyz"
   uv run alembic upgrade head
   ```
4. **Never commit `.env`**: `.env` is ignored in `.gitignore`. Only commit changes to `.env.example` if a new config variable is added.
