# SlotBook — Pure Python + MySQL + HTML/CSS/JS

A slot booking web application built without any web framework.
Pure Python HTTP server + Vanilla JS frontend + MySQL database.

---

## Project Structure

```
slotbook/
├── backend/
│   ├── server.py           ← Pure Python HTTP server (no Django/Flask)
│   └── requirements.txt    ← Only needs mysql-connector-python
│
└── frontend/
    ├── index.html          ← Main HTML entry point
    ├── css/
    │   ├── base.css        ← CSS variables, reset, typography, animations
    │   ├── components.css  ← Buttons, cards, badges, forms, modal, toast, nav
    │   └── pages.css       ← Page-specific layouts (home, auth, bookings)
    └── js/
        ├── config.js       ← API base URL and app-wide config
        ├── api.js          ← All HTTP calls to the backend
        ├── auth.js         ← Login, register, logout logic
        ├── ui.js           ← Shared UI: nav, toast, modal, utility functions
        ├── slots.js        ← Slot listing, card rendering, detail modal
        ├── bookings.js     ← Book a slot, cancel, my bookings page
        ├── router.js       ← Client-side page routing
        └── app.js          ← App entry point — initializes everything
```

---

## Setup Instructions

### Step 1 — Install Python dependency
```bash
cd backend
pip install mysql-connector-python
```

### Step 2 — Set up MySQL user
Run these in MySQL Workbench or terminal:
```sql
CREATE USER 'slot_user'@'localhost' IDENTIFIED BY 'Abhi123';
GRANT ALL PRIVILEGES ON *.* TO 'slot_user'@'localhost';
FLUSH PRIVILEGES;
```
> The database and tables are created automatically when the server starts.

### Step 3 — Update password in server.py
Open `backend/server.py` and change:
```python
DB_CONFIG = {
    ...
    'password': 'Abhi123',   ← your MySQL password
    ...
}
```

### Step 4 — Start the backend server
```bash
cd backend
python server.py
```
Output:
```
🔧 Setting up database...
  ✓ Seeded 10 sample slots.
  ✓ Database ready.

🚀 Server running at → http://localhost:8000
   Press Ctrl+C to stop.
```

### Step 5 — Open the frontend
Double-click `frontend/index.html` to open in your browser.
Or drag it into Chrome/Firefox.

---

## API Endpoints

| Method | Endpoint          | Auth Required | Description              |
|--------|-------------------|---------------|--------------------------|
| GET    | /api/slots        | No            | List all upcoming slots  |
| GET    | /api/my-bookings  | Yes           | User's booking history   |
| GET    | /api/me           | Yes           | Current user info        |
| POST   | /api/register     | No            | Create a new account     |
| POST   | /api/login        | No            | Sign in                  |
| POST   | /api/logout       | Yes           | Sign out                 |
| POST   | /api/book         | Yes           | Book a slot              |
| POST   | /api/cancel       | Yes           | Cancel a booking         |

---

## Database Tables (auto-created)

**users** — stores registered users
**slots** — stores bookable time slots (seeded with 10 samples)
**bookings** — stores slot bookings per user

---

## Deploying

### Frontend → Netlify
1. Go to netlify.com/drop
2. Drag the `frontend/` folder
3. Done — you get a live URL like `https://xyz.netlify.app`
4. Update `frontend/js/config.js` → set `API_BASE` to your backend URL

### Backend → Railway (free)
1. Push `backend/` to a GitHub repo
2. Go to railway.app → New Project → Deploy from GitHub
3. Add a MySQL plugin from Railway dashboard
4. Set environment variables for DB credentials
5. Done — Railway gives you a URL like `https://xyz.railway.app`
