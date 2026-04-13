# 🚀 Harvestia — Free Deployment Guide (Render.com)

## Step 1 — GitHub pe upload karo

### Backend
1. GitHub.com pe jaao → New Repository → Name: `harvestia-backend`
2. Public rakho → Create Repository
3. Apne computer mein:
```bash
cd harvestia_backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/harvestia-backend.git
git push -u origin main
```

### Frontend
```bash
cd harvestia-frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/harvestia-frontend.git
git push -u origin main
```

---

## Step 2 — Render.com pe Backend deploy karo

1. **render.com** pe jaao → Sign up (GitHub se login karo)
2. **New +** → **Web Service**
3. GitHub repo connect karo → `harvestia-backend` chunno
4. Yeh settings karo:

| Setting | Value |
|---------|-------|
| Name | `harvestia-api` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate && python seed_demo_data.py` |
| Start Command | `gunicorn harvestia_backend.wsgi:application --bind 0.0.0.0:$PORT --workers 2` |
| Plan | Free |

5. **Environment Variables** add karo:

| Key | Value |
|-----|-------|
| `DJANGO_SETTINGS_MODULE` | `harvestia_backend.settings.production` |
| `SECRET_KEY` | (koi bhi random string — 50 characters) |

6. **Create Web Service** click karo
7. 5-10 minute wait karo
8. ✅ Backend URL milegi: `https://harvestia-api.onrender.com`

---

## Step 3 — Render.com pe Frontend deploy karo

1. **New +** → **Static Site**
2. GitHub repo connect karo → `harvestia-frontend` chunno
3. Yeh settings karo:

| Setting | Value |
|---------|-------|
| Name | `harvestia-app` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

4. **Environment Variables** add karo:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://harvestia-api.onrender.com/api/v1` |
| `VITE_WS_URL` | `wss://harvestia-api.onrender.com` |

5. **Create Static Site** click karo
6. ✅ Frontend URL milegi: `https://harvestia-app.onrender.com`

---

## Step 4 — Backend mein Frontend URL add karo

Backend ka Environment Variables mein jaao:
| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://harvestia-app.onrender.com` |

Save karo → Backend auto-redeploy ho jaayega.

---

## Final Result

| | URL |
|---|---|
| 🌿 App | `https://harvestia-app.onrender.com` |
| 📖 API | `https://harvestia-api.onrender.com/api/docs/` |
| 🔑 Login | `demo@harvestia.in` / `demo@123` |

---

## Notes
- Free plan pe backend **sleep** ho jaata hai 15 min baad → pehli request slow (30 sec)
- Paid plan (₹600/mo) pe hamesha awake rehta hai
- Database PostgreSQL free mein 90 days ke baad delete — backup lena
