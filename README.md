# IMY320

## How to run the system

### 1.1 cd backend
### 1.2 npm install
### 1.3 npm run dev

On another terminal:

### 1.3 cd frontend
### 1.4 npm install
### 1.5 npm start

### Test user details
- Email: test@example.com
- Password: password123

---

Here is a short tutorial overview and some guidance for anyone who migth be a bit lost or stuck at any point with how React works 

```markdown
# � Full Stack Project Setup: Frontend (React) + Backend (Node.js)

This project is split into two parts:
- `frontend/` → React-based web application (UI)
- `backend/` → Node.js/Express server (APIs, business logic)

## 📁 Folder Structure
```
project-root/
├── frontend/      # React app (client-side)
└── backend/       # Node.js app (server-side)
```

## 🚀 Quick Start
### 🔧 Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- Terminal access
- Code editor (VS Code recommended)

## 🌐 Frontend – React App
```bash
cd frontend
npm install
npm install react-router-dom
npm run dev
```
Access at: [http://localhost:5173](http://localhost:5173)

### Structure
```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Backend – Node.js/Express
```bash
cd backend
npm install
node index.js
# or with auto-reload:
npx nodemon index.js
```
Runs on: [http://localhost:3000](http://localhost:3000)

### Structure
```
backend/
├── index.js
├── routes/
├── controllers/
├── models/
└── package.json
```

## 🔁 Connecting Frontend to Backend
Frontend API call example:
```js
useEffect(() => {
  fetch('http://localhost:3000/api/data')
    .then(res => res.json())
    .then(data => setData(data));
}, []);
```

Backend CORS setup:
```js
const cors = require('cors');
app.use(cors());
```

## 🧪 Running Both Servers
**Terminal 1 (Frontend):**
```bash
cd frontend && npm start
```

**Terminal 2 (Backend):**
```bash
cd backend && node index.js
```

## ⚠️ Common Issues
| Problem                | Solution                          |
|------------------------|-----------------------------------|
| CORS errors            | Enable CORS in backend            |
| Port conflicts         | Use different ports (5173 & 3000) |
| Dependency issues      | Delete node_modules and reinstall |
| API not responding     | Check backend is running          |

## 📚 Resources
- [React Docs](https://reactjs.org/)
- [Express Docs](https://expressjs.com/)
- [Vite Docs](https://vitejs.dev/)
```

This is optimized for:
- Single copy-paste into your repo
- Clean Markdown formatting
- Essential information without fluff
- Mobile-friendly rendering on GitHub

The version above removes some decorative elements to make it more compact while keeping all critical information. If you prefer the more visually decorated version with emojis and tables, I can provide that alternative format instead.
