# TaskBoard - Professional Task Management Dashboard

TaskBoard is a high-performance, modern, and beautiful task tracking application. It features a responsive grid dashboard, custom animated icons, and light/dark mode transitions built using React 19, Vite, Tailwind CSS v4, Motion (framer-motion v12), and custom-tailored components inspired by **Sera UI** and **Animate UI**.

## 🔗 Deployed Links

- **Frontend (Vercel)**: [https://cravita-task.vercel.app/](https://cravita-task.vercel.app/)
- **Backend (Render)**: [https://cravita-task.onrender.com](https://cravita-task.onrender.com)

---

## 🚀 Key Features

### 1. 🌓 Persistent Dark Mode Option
- Allows toggling between light and dark themes using a custom animated toggle button in the header.
- Automatically respects system theme preference on first load.
- Persists theme preference in the browser's `localStorage`.
- Automatically adjusts colors of cards, table rows, dropdowns, headers, and text inputs.

### 2. 📅 Sorting by Due Date
- Sort tasks dynamically by their due date timestamps.
- **Header click integration:** Click the **Due Date** column header in the table to toggle between:
  - Default order
  - Soonest first (ascending ▲)
  - Latest first (descending ▼)
- **Toolbar integration:** Select the desired sorting criteria using the dropdown selector in the dashboard filter toolbar.

### 3. 📱 Proper Mobile Responsiveness
- **Adaptive layout rendering:**
  - **Desktop (`md` and up):** Renders a structured data table using clean table components for high-density viewing.
  - **Mobile (`sm` and below):** Automatically transforms rows into separate task cards designed for single-column touch interactions.
- **Adaptive Header:** Responsive buttons hide text on small displays to preserve layout alignment.
- **Fluid Layout:** Stats cards scale from a 2-column grid on mobile to 4-column rows on larger monitors.
- **Clipped Menu Protection:** The status selection dropdown renders inside a React Portal on `document.body` so it floats above all layout containers and never gets hidden.

### 4. ⚡ Pagination
- Client-side table and card pagination (5 items per page) to ensure fluid rendering speeds.
- Includes pagination navigation buttons (Prev, Next, Page Numbers) and real-time records counts.

### 5. 🎯 Form Focus Fix
- Input field nodes do not lose focus on keypress (resolved focus recreation bug).

---

## 🛠️ Technology Stack

- **Core Framework:** React 19
- **Build Tool:** Vite 8
- **Styling System:** Tailwind CSS v4 (Class-based dark mode configuration)
- **Animations:** Motion (Framer Motion v12)
- **Notifications:** React Hot Toast
- **Date Manipulation:** Date-Fns

---

## 💻 Running the Application

### 1. Installation
Install all dependency packages:
```bash
npm install
```

### 2. Run Development Server
Start the client application locally:
```bash
npm run dev
```

### 3. Build Production Bundle
Bundle the application for production:
```bash
npm run build
```

### 4. Linter Check
Run code checks to check for rules violation:
```bash
npm run lint
```
