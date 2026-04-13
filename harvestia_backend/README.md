# 🌿 Harvestia Backend — Complete Setup Guide

## Quick Start (3 minutes)

```bash
# 1. Go inside the backend folder
cd harvestia_backend

# 2. Create virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Install packages
pip install -r requirements_windows.txt

# 4. Create database tables
python manage.py migrate

# 5. Load demo data
python seed_demo_data.py

# 6. Start server
python manage.py runserver
```

**Backend ready at:** `http://localhost:8000`

---

## Demo Login
| | |
|---|---|
| Email | `demo@harvestia.in` |
| Password | `demo@123` |

---

## Key URLs
| URL | What |
|-----|------|
| `http://localhost:8000/api/health/` | Status check |
| `http://localhost:8000/api/docs/` | Swagger UI |
| `http://localhost:8000/admin/` | Django Admin |

---

## Frontend Connection
```bash
cd harvestia-frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## Deploy to Render.com (Free)

1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect your GitHub repo
4. Set these:
   - **Build command:** `pip install -r requirements.txt && python manage.py migrate && python seed_demo_data.py`
   - **Start command:** `gunicorn harvestia_backend.asgi:application -w 2 -k uvicorn.workers.UvicornWorker`
   - **Environment:** Python 3
5. Add environment variables:
   - `SECRET_KEY` = any random string
   - `DJANGO_SETTINGS_MODULE` = `harvestia_backend.settings.production`
   - `DATABASE_URL` = (Render auto-provides PostgreSQL URL)

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/v1/auth/login/` | Login → JWT tokens |
| POST | `/api/v1/auth/register/` | Register → JWT tokens |
| POST | `/api/v1/auth/logout/` | Logout |
| POST | `/api/v1/auth/refresh/` | Refresh token |
| GET/PATCH | `/api/v1/auth/profile/` | User profile |

### Farms
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/farms/` | List farms |
| POST | `/api/v1/farms/` | Create farm |
| GET | `/api/v1/farms/{id}/fields/` | Farm fields |

### AI Models
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/v1/ml/yield/predict/` | Yield prediction |
| POST | `/api/v1/ml/disease/detect/` | Disease detection |
| POST | `/api/v1/ml/irrigation/optimize/` | Irrigation AI |
| POST | `/api/v1/ml/pest/risk/` | Pest risk |
| POST | `/api/v1/ml/soil/analyze/` | Soil analysis |
| POST | `/api/v1/ml/price/forecast/` | Price forecast |
| GET | `/api/v1/ml/models/status/` | Model health |

### Other
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/alerts/` | All alerts |
| GET | `/api/v1/analytics/dashboard/` | Dashboard stats |
| GET | `/api/v1/marketplace/products/` | Store products |

---

## Tech Stack
- Django 4.2 + DRF
- JWT Auth (SimpleJWT)
- SQLite (dev) / PostgreSQL (prod)
- Django Channels (WebSocket)
- 7 ML Models (scikit-learn fallback)
