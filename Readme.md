# TaskBoard - Modern Task Management Dashboard

TaskBoard is a modern, responsive, and highly interactive Task Management Dashboard web application. It features a complete CRUD workflow for tasks, priority levels, assignee management, responsive stat cards, status transitions, search/filtering, and animated user-interface interactions.

## 🔗 Deployed Links

- **Frontend (Vercel)**: [https://cravita-task.vercel.app/](https://cravita-task.vercel.app/)
- **Backend (Render)**: [https://cravita-task.onrender.com](https://cravita-task.onrender.com)

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 & Vite 8
- **Styling:** Tailwind CSS v4 (Vanilla Modern CSS architecture)
- **Animations:** Motion (Framer Motion)
- **Icons:** Custom compiled, TypeScript-free animated JSX components matching the [Animate UI](https://animate-ui.com/docs/icons) specification.
- **Utility Libraries:** `date-fns` (Date formatting), `axios` (HTTP clients), `react-hot-toast` (Toast notifications).
- **Linter:** `oxlint`

### Backend
- **Framework:** Node.js & Express v5
- **Database:** MongoDB & Mongoose
- **Validation:** `express-validator`
- **Development Tooling:** `nodemon` (hot reloading)

---

## 🛠️ Enhancements & Bug Fixes

### 1. Form Focus Loss Bug Fix
- **Issue:** Typing even a single character inside the task creation or edit form caused the input field to lose focus immediately.
- **Root Cause:** The `Field` component was defined inside the main `TaskForm` component. This nested component definition caused React to recreate and remount the DOM nodes on every state update (keystroke), destroying input focus.
- **Solution:** Extracted the `Field` helper component out of the `TaskForm` render body into global file scope in [TaskForm.jsx](file:///d:/Downloads/Cravita_Task/frontend/src/components/TaskForm.jsx). Focus is now preserved seamlessly as users type.

### 2. Animate UI Custom Icon Integration
- **Enhancement:** Replaced all static unicode symbols (`✎`, `🗑`, `▾`, `⌕`, etc.) and emoji icons with premium animated JSX components.
- **Components Created (under `src/components/animate-ui/`):**
  - Base wrapper primitives: `icon.jsx`, `slot.jsx`, `use-is-in-view.jsx`, `cn.js`
  - Animated icons: `plus.jsx` (new task), `trash.jsx` (delete action), `check.jsx` (completed badge), `clock.jsx` (pending badge), `rotate-ccw.jsx` (in-progress badge), `sparkles.jsx` (brand logo), `chevron-down.jsx` (dropdown), `x.jsx` (clear filters), `list.jsx` (total stats), `search.jsx` (search bar), `user.jsx` (assignee profiles), and a custom-designed wiggling `pencil.jsx` (edit action).
- All icons are configured with interactive animations (e.g., `animateOnHover`) using Framer Motion.

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Task request handlers
│   │   ├── models/        # Mongoose Schema definitions
│   │   ├── routes/        # API endpoints routing
│   │   └── index.js       # App entry point
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── animate-ui/ # Custom Animate UI wrapper and icons
    │   │   ├── DeleteConfirm.jsx
    │   │   ├── FilterBar.jsx
    │   │   ├── Modal.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── StatusBadge.jsx
    │   │   ├── StatusDropdown.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── TaskTable.jsx
    │   ├── pages/
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root with:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskboard
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   The API will run at `http://localhost:5000`.

### 2. Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🧪 Verification & Building

To run the linter and verify syntax check:
```bash
npm run lint
```

To compile and bundle for production:
```bash
npm run build
```

This compiles optimized assets in the `frontend/dist/` folder.
