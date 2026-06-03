# AI Business Growth Assistant

An AI-powered business growth platform for local businesses. The project is split into a React dashboard frontend and a FastAPI backend with a modular analysis pipeline for website intelligence, review intelligence, competitor research, SWOT generation, recommendations, and AI chat assistance.

## What I found in the prototype folders

- `overview_dashboard/` and `ai_business_growth_assistant/` both contained a light corporate dashboard prototype in a single `code.html` file.
- `ai_assistant_chat/` contained a matching chat experience prototype and a `screen.png` reference.
- `insight_kinetic/DESIGN.md` defined the brand direction: clean corporate SaaS, light workspace, dark sidebar, soft radii, indigo primary color, and business-first analytics.

## Project Structure

```text
ai_business_growth_assistant/
├─ frontend/                # React + Bootstrap 5 dashboard
│  ├─ src/
│  │  ├─ components/       # Reusable UI blocks
│  │  ├─ pages/            # Route-level pages
│  │  ├─ services/         # Axios API layer
│  │  ├─ data/             # Mock dashboard data
│  │  ├─ hooks/            # Shared React hooks
│  │  └─ styles/           # Global theme styles
│  └─ vite.config.js
├─ backend/                # FastAPI application
│  └─ app/
│     ├─ api/routes/       # API endpoints
│     ├─ core/             # Settings, security, dependencies
│     ├─ db/               # SQLAlchemy session and base
│     ├─ models/           # Database models
│     ├─ schemas/          # Pydantic response/request models
│     └─ services/         # AI, analysis, and reporting logic
├─ code.html               # Original prototype reference
└─ README.md
```

## Included Features

- Login and registration screens
- Dashboard overview with health score and action priorities
- Website analysis
- Review analytics
- Competitor intelligence
- SWOT analysis
- AI recommendations
- Prioritized action plan
- AI business consultant chat
- Settings and business profile management
- JWT auth, SQLite for dev, PostgreSQL-ready configuration
- Gemini, sentence-transformers, and ChromaDB service scaffolding
- PDF report generation endpoint

## Frontend Stack

- React.js with functional components and hooks
- React Router DOM
- Axios
- Bootstrap 5
- Custom CSS
- React Icons
- Recharts
- React Toastify

## Backend Stack

- Python FastAPI
- Uvicorn
- Pydantic validation
- JWT authentication
- Passlib password hashing
- SQLite for development
- PostgreSQL-ready database URL support
- Google Gemini integration layer
- Sentence Transformers and ChromaDB integration layer
- Pandas, NumPy, BeautifulSoup4, Requests, Playwright

## Run Locally

### Frontend

```bash
cd ai_business_growth_assistant/frontend
npm install
npm run dev
```

### Backend

```bash
cd ai_business_growth_assistant/backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Notes

- The frontend includes resilient fallback data so the dashboard still renders if the backend is offline.
- The backend services are structured to use real analysis logic first, then fall back to safe heuristics when external AI keys or browser tooling are not available.
- The existing prototype HTML files were used as visual references and preserved in the repo.

