
# 🍽️ MESSMATE — Smart Hostel Mess Management

**Making hostel mess management more transparent, organized, and student-friendly.**

MESSMATE is a web-based hostel mess management platform that helps students explore weekly meal schedules, submit structured food feedback, and view feedback analytics through a centralized dashboard. It also provides an Admin Portal to manage daily meal schedules and food availability.

## 🔗 Quick Links

- 🌐 [Live Demo — MESSMATE](https://messmate-two7.onrender.com)
- 🎓 [Student Portal](https://messmate-two7.onrender.com/student)
- 🛠️ [Admin Portal](https://messmate-two7.onrender.com/admin)
- 💻 [GitHub Repository](https://github.com/charithamalle-stack/MESSMATE)
- ✨ [Features](#-features)
- 🛠️ [Technologies Used](#️-technologies-used)
- 🚀 [Installation & Setup](#-installation--setup)
- 📁 [Project Structure](#-project-structure)
- ⚠️ [Current Limitations](#️-current-limitations)

---

## 🌐 Live Demo

Experience the deployed MESSMATE application:

### [🚀 Open MESSMATE](https://messmate-two7.onrender.com)

**Direct Portal Links:**

- 🎓 [Student Portal](https://messmate-two7.onrender.com/student)
- 🛠️ [Admin Portal](https://messmate-two7.onrender.com/admin)
- 📅 [Weekly Menu](https://messmate-two7.onrender.com/menu)
- 📝 [Feedback](https://messmate-two7.onrender.com/feedback)
- 📊 [Committee Dashboard](https://messmate-two7.onrender.com/committee)

All portals are part of the same deployed website.

---

## ✨ Features

### 1. 🎓 Student Portal
- Access the student dashboard.
- Explore the weekly hostel food schedule.
- View meals across breakfast, lunch, snacks, and dinner.
- Rate meals and share opinions.
- Submit structured food feedback.

### 2. 🛠️ Admin Portal
- Manage the daily hostel meal schedule.
- Select a day and manage its meals.
- Add or remove individual food items.
- Edit meal service timings.
- Mark individual food items as available or finished.
- Manually close or reopen meal services.
- View meal service statuses:
  - Upcoming
  - Serving Now
  - Closed
- Monitor meal and food-item information through the admin dashboard.

### 3. 📅 Weekly Menu
- View the weekly hostel food schedule.
- Explore meals across breakfast, lunch, snacks, and dinner.
- Rate meals and share opinions.

### 4. 📝 Student Feedback
- Submit feedback about individual meals.
- Rate food based on:
  - Taste
  - Food Quality
  - Quantity
  - Hygiene
  - Variety
- Add optional comments.
- Submit feedback anonymously.

### 5. 📊 Committee Dashboard
- View total ratings and feedback received.
- Monitor overall ratings.
- Identify top-rated and low-rated meals.
- Explore feedback trends and complaint themes.
- Review detailed student opinions.

### 6. 📈 Feedback Analytics
- Convert student opinions into structured feedback.
- Help mess committees identify areas that need improvement.
- Support food-related decisions using feedback insights.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| [React](https://react.dev/) | Frontend development |
| [Vite](https://vite.dev/) | Development and build tool |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Application logic |
| [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) | Styling and layouts |
| [React Router](https://reactrouter.com/) | Page navigation |
| [Lucide React](https://lucide.dev/) | Icons |
| LocalStorage | Browser-side data storage |
| [Render](https://render.com/) | Deployment |

---

## 🚀 Installation & Setup

### Prerequisites

Install:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

### Step 1: Clone the repository

```bash
git clone https://github.com/charithamalle-stack/MESSMATE.git
```

### Step 2: Navigate to the client folder

```bash
cd MESSMATE/client
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Start the development server

```bash
npm run dev
```

### Step 5: Open the website

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

---

## 📁 Project Structure

```text
MESSMATE/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## ⚙️ Production Build

To generate an optimized production build:

```bash
npm run build
```

The generated production files will be available in the `client/dist` directory.

---

## ⚠️ Current Limitations

- Application data is stored using browser LocalStorage.
- Data is browser-specific and is not automatically synchronized across different devices or browsers.
- Admin menu changes are stored locally and are not yet connected to a shared backend database.
- Admin menu updates are not automatically synchronized with the Student Portal.
- The application does not currently include admin authentication or role-based access control.

---

## 👩‍💻 Developed By

**Charitha Malle**

[GitHub Repository](https://github.com/charithamalle-stack/MESSMATE)


