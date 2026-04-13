# 🌿 Harvestia — AgriTech Frontend

AI-powered precision agriculture platform for Indian farmers.
Built with **React 18 + Vite + Tailwind CSS**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start dev server
npm run dev
```

Open → **http://localhost:3000**

---

## 📁 Project Structure

```
harvestia-frontend/
├── src/
│   ├── App.jsx                   # Root router
│   ├── main.jsx                  # Entry point
│   ├── index.css                 # Tailwind + global styles
│   ├── api/
│   │   └── client.js             # Axios instance + all API calls
│   ├── store/
│   │   └── authStore.js          # Zustand auth store (JWT)
│   ├── hooks/
│   │   └── index.js              # useLiveSensors, useYieldPredict, etc.
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppLayout.jsx     # Sidebar + Topbar shell
│   │   └── ui/
│   │       └── index.jsx         # Shared UI (Card, Badge, DonutChart…)
│   └── pages/
│       ├── LandingPage.jsx       # Public landing page
│       ├── LoginPage.jsx         # Login + Register
│       ├── DashboardPage.jsx     # Main dashboard
│       ├── FieldsPage.jsx        # Field monitor
│       ├── CropsPage.jsx         # Crop management
│       ├── YieldAIPage.jsx       # 🌾 Yield Predictor AI
│       ├── DiseaseAIPage.jsx     # 🔬 Disease Detector CNN
│       ├── IrrigationAIPage.jsx  # 💧 RL Irrigation Optimizer
│       ├── PestAIPage.jsx        # 🐛 Pest Risk XGBoost
│       ├── SoilAIPage.jsx        # 🧪 Soil Health Analyzer
│       ├── MarketPage.jsx        # 📊 Market Price Forecast
│       ├── AlertsPage.jsx        # 🔔 AI Alert Center
│       ├── ReportsPage.jsx       # 📄 PDF Reports
│       └── SettingsPage.jsx      # ⚙️ Settings
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🤖 7 Integrated ML/DL Models

| Model | Algorithm | Accuracy |
|-------|-----------|----------|
| Yield Predictor | GradientBoost + LSTM | 98.7% |
| Disease Detector | ResNet-50 CNN | 96.2% |
| Irrigation Optimizer | RL PPO Agent | 42% water saved |
| Pest Risk | XGBoost Classifier | 94.5% |
| Soil Analyzer | Random Forest | 91.0% |
| Price Forecast | LSTM Time Series | 87.3% |
| Anomaly Detector | Isolation Forest | 95.1% |

---

## 🔌 Backend Connection

The frontend connects to the Django backend at `http://localhost:8000`.

```
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000
```

**REST API endpoints used:**
- `POST /api/v1/auth/login/` — JWT login
- `GET  /api/v1/farms/` — Farm list
- `POST /api/v1/ml/yield/predict/` — Yield prediction
- `POST /api/v1/ml/disease/detect/` — Disease detection
- `POST /api/v1/ml/irrigation/optimize/` — Irrigation schedule
- `POST /api/v1/ml/pest/risk/` — Pest risk analysis
- `POST /api/v1/ml/soil/analyze/` — Soil health
- `GET  /api/v1/alerts/` — Alert list
- `WS   /ws/sensors/{farm_id}/` — Live IoT stream

> All ML endpoints have **offline fallback simulation** built in — so the UI works even without the backend running.

---

## 🎨 Tech Stack

| Library | Purpose |
|---------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| Tailwind CSS 3 | Styling |
| React Router 6 | Routing |
| Zustand | Auth state |
| TanStack Query | Server state / caching |
| Axios | HTTP client |
| React Hook Form + Zod | Forms & validation |
| Recharts | Charts |
| React Leaflet | Field maps |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Hot Toast | Notifications |

---

## 🏗️ Build for Production

```bash
npm run build
# Output: dist/
```

---

## 🌐 Pages Overview

| Route | Page |
|-------|------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Register |
| `/app/dashboard` | Main dashboard |
| `/app/fields` | Field monitor |
| `/app/crops` | Crop seasons |
| `/app/ai/yield` | Yield AI |
| `/app/ai/disease` | Disease AI |
| `/app/ai/irrigation` | Irrigation AI |
| `/app/ai/pest` | Pest AI |
| `/app/ai/soil` | Soil AI |
| `/app/market` | Market prices |
| `/app/alerts` | Alerts center |
| `/app/reports` | PDF Reports |
| `/app/settings` | Settings |

---

*Harvestia Technologies Pvt. Ltd. © 2025*
  

🚀 🔥 FULL RUN COMMANDS (Step-by-Step)
🟢 1. Backend folder me jao
cd C:\desktop\sec harvert\harvestia_backend
🟢 2. Environment activate karo
conda activate djangoenv
🟢 3. Make migrations (ALL apps)
python manage.py makemigrations
🟢 4. Apply migrations (tables create)
python manage.py migrate
🟢 5. (Optional but important) Seed data
python seed_demo_data.py
🟢 6. Run backend server
python manage.py runserver

👉 Open:

http://127.0.0.1:8000/api/health/
🌐 FRONTEND RUN
🟢 7. New terminal open karo
cd C:\desktop\sec harvert\harvestia-frontend
🟢 8. Run frontend
npm run dev

👉 Open:

http://localhost:3000