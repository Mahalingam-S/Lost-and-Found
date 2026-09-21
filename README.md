
# Lost-and-Found

# 🔍 Campus Lost & Found Mobile App

An intuitive, mobile-first Web Application for university students and staff to quickly report, locate, and claim lost and found belongings across campus.

![Campus Lost & Found](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80)

---

## ✨ Features

- **📱 Native Mobile App Viewport**: Styled as an interactive mobile app container with custom headers, bottom tab navigation bar, and Floating Action Button (FAB).
- **🎨 Cool & Warm Light Aesthetic**: Vibrant, clean UI with modern glassmorphic cards, custom typography (**Outfit** Google font), and high-contrast accessibility.
- **🔐 Mobile OTP Authentication**: Quick 6-digit verification code system (`123456` demo code out-of-the-box).
- **📢 Report Lost & Found**: Custom dropzone image uploader, location pins, dates, categories, and item descriptions.
- **🙋 Item Claims & Contact**: Send direct claim notifications or call item posters directly.
- **📋 Post Management**: Toggle active/resolved status, edit details, or delete listings in real-time.
- **⚡ In-Memory Fallback Mode**: Backend automatically operates with seeded data if a local MongoDB instance is not connected.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Lucide Icons, Vanilla CSS Design System.
- **Backend**: Node.js, Express.js, JWT, Mongoose / In-Memory Storage Fallback.
- **Database**: MongoDB (Optional, seamless fallback included).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Mahalingam-S/Lost-and-Found.git
cd Lost-and-Found
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📁 Repository Structure

```
Lost-and-Found/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Auth & Item Controllers
│   ├── middleware/      # JWT Authentication Middleware
│   ├── models/          # Mongoose Schemas (User, Item)
│   ├── routes/          # Express API Routes
│   ├── server.js        # Server Entry Point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # MobileHeader, BottomNav, ItemCard, SearchBar, CategoryFilter
    │   ├── context/     # AuthContext
    │   ├── pages/       # Home, ReportLost, ReportFound, ItemDetails, MyPosts, Profile, Login, OTP
    │   ├── services/    # API Fetch Client
    │   ├── App.jsx      # Mobile Viewport Shell
    │   └── index.css    # Cool & Warm CSS Design System
    ├── index.html
    └── vite.config.js
```

---

## 📜 License

Distributed under the MIT License. Built for university students & staff.
>>>>>>> 69b4217 (InitialCommit)
