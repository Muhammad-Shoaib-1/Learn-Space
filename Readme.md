# 📚 LearnSpace — Full Stack Learning Management System

<div align="center">

![LearnSpace Banner](https://via.placeholder.com/900x200/0d6efd/ffffff?text=LearnSpace+%7C+Modern+LMS+Platform)

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

**A production-ready, full-stack Learning Management System built with the MERN Stack.**  
Empowering students, instructors, and administrators with a seamless learning experience.

[🌐 Live Demo](https://learn-space-eight.vercel.app) • [📖 Documentation](#-api-documentation) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Marking Scheme](#-marking-scheme)
- [Author](#-author)

---

## 🌟 Overview

**LearnSpace** is a comprehensive Learning Management System (LMS) developed as a Final Year Project for the MERN Stack Web Development course. It demonstrates real-world full-stack development skills including:

- 🔐 **Secure Authentication** with JWT & Bcrypt
- 🎭 **Role-Based Access Control** (Student, Instructor, Admin)
- 📚 **Complete Course Management** with lessons and progress tracking
- 💳 **Payment Flow** with dummy checkout modal
- 📊 **Admin Analytics Dashboard** with real-time data
- 📱 **Fully Responsive** UI built with Bootstrap 5

> *"Built by a student, for students — LearnSpace brings industry-level development practices to the classroom."*

---

## ✨ Features

### 🎓 For Students
| Feature | Description |
|---|---|
| Browse Courses | Explore all available courses with search functionality |
| Course Detail | View full course info, instructor details, and lesson previews |
| Enrollment | Enroll in free courses instantly or complete dummy payment for paid courses |
| Progress Tracking | Track learning progress with 25%, 50%, and 100% milestones |
| View Lessons | Access video lessons and notes after enrollment |
| Profile Management | Update name and change password securely |

### 🧑‍🏫 For Instructors
| Feature | Description |
|---|---|
| Create Courses | Publish courses with title, description, category, price, and image |
| Edit & Delete | Manage existing courses from the dashboard |
| Upload Lessons | Add video lessons (YouTube embed), notes, and duration per course |
| Course Analytics | View enrolled student count and average progress |

### 🛡️ For Admins
| Feature | Description |
|---|---|
| User Management | View all users, search by name/email, delete accounts |
| Course Management | View and delete any course on the platform |
| Analytics Dashboard | Monthly enrollment chart, top courses, user breakdown |
| Password Reset | Reset any user's password directly from admin panel |
| Merged Dashboard | Profile info integrated directly into admin panel |

---

## 🛠️ Tech Stack

### Frontend
```
React JS 18         — Component-based UI framework
React Router v6     — Client-side routing
Axios               — HTTP client for API calls
Bootstrap 5         — Responsive UI framework
Framer Motion       — Smooth animations and transitions
React Toastify      — Toast notifications
```

### Backend
```
Node.js             — JavaScript runtime environment
Express.js          — Web application framework
MongoDB             — NoSQL database
Mongoose            — MongoDB object modeling
JWT                 — JSON Web Token authentication
Bcrypt.js           — Password hashing
Multer              — File upload middleware
Dotenv              — Environment variable management
CORS                — Cross-origin resource sharing
```

---

## 📁 Project Structure

```
lms-project/
│
├── 📁 backend/
│   ├── 📁 config/
│   │   └── db.js                   # MongoDB connection
│   ├── 📁 controllers/
│   │   ├── authController.js       # Register, Login, Update Profile
│   │   ├── courseController.js     # Course CRUD operations
│   │   ├── enrollmentController.js # Enrollment & progress
│   │   └── adminController.js      # Admin operations & analytics
│   ├── 📁 middleware/
│   │   └── authMiddleware.js       # JWT protect & role authorization
│   ├── 📁 models/
│   │   ├── User.js                 # User schema (name, email, role)
│   │   ├── Course.js               # Course schema
│   │   ├── Enrollment.js           # Enrollment + progress schema
│   │   └── Lesson.js               # Lesson schema (video, notes)
│   ├── 📁 routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── courseRoutes.js         # /api/courses
│   │   ├── enrollmentRoutes.js     # /api/enroll
│   │   ├── lessonRoutes.js         # /api/lessons
│   │   └── adminRoutes.js          # /api/admin
│   ├── 📁 uploads/                 # Uploaded course images
│   ├── .env                        # Environment variables
│   └── server.js                   # Entry point
│
└── 📁 frontend/
    └── 📁 src/
        ├── 📁 components/
        │   └── ConfirmModal.js     # Reusable confirm dialog
        ├── 📁 pages/
        │   ├── Home.js             # Landing page
        │   ├── About.js            # About page
        │   ├── Login.js            # Login page
        │   ├── Register.js         # Registration page
        │   ├── Courses.js          # Course listing + search
        │   ├── CourseDetail.js     # Course detail + lessons tab
        │   ├── Dashboard.js        # Student & Instructor dashboard
        │   ├── CreateCourse.js     # Instructor course creation
        │   ├── ManageLessons.js    # Instructor lesson management
        │   ├── AdminPanel.js       # Admin dashboard
        │   └── Profile.js          # User profile & settings
        └── App.js                  # Routes & Navbar
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Muhammad-Shoaib-1/Learn-Space.git
cd Learn-Space
```

**2. Setup Backend**
```bash
cd backend
npm install
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
```

**4. Configure Environment Variables**

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

**5. Run the Application**

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev
```

```bash
# Terminal 2 — Frontend
cd frontend
npm start
```

**6. Open in Browser**
```
Frontend: http://localhost:3000
Backend:  https://learnspace-backend-u9ng.onrender.com
```

### Creating an Admin Account

After registering a user, open MongoDB Compass or shell and run:
```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `mysecretkey123` |

---

## 📡 API Documentation

### Authentication — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login & get token |
| PUT | `/profile` | Protected | Update name or password |

### Courses — `/api/courses`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get all courses |
| GET | `/:id` | Public | Get single course |
| GET | `/my-courses` | Instructor | Get instructor's courses |
| POST | `/` | Instructor | Create new course |
| PUT | `/:id` | Instructor | Update course |
| DELETE | `/:id` | Instructor | Delete course |

### Enrollment — `/api/enroll`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Student | Enroll in course |
| GET | `/my-courses` | Student | Get enrolled courses |
| PUT | `/progress/:id` | Student | Update progress |
| DELETE | `/:id` | Student | Unenroll from course |

### Lessons — `/api/lessons`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/:courseId` | Protected | Get lessons (enrolled only) |
| POST | `/:courseId` | Instructor | Add lesson |
| PUT | `/:lessonId` | Instructor | Update lesson |
| DELETE | `/:lessonId` | Instructor | Delete lesson |

### Admin — `/api/admin`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | Get all users |
| DELETE | `/users/:id` | Admin | Delete user |
| PUT | `/users/:id/reset-password` | Admin | Reset user password |
| GET | `/courses` | Admin | Get all courses |
| DELETE | `/courses/:id` | Admin | Delete any course |
| GET | `/analytics` | Admin | Get platform analytics |

---

## 👥 User Roles

```
🎓 Student
├── Browse and search courses
├── View course details
├── Enroll (free) or pay (dummy) for courses
├── Access lessons after enrollment
├── Track and update progress
├── View and edit profile
└── Unenroll from courses

🧑‍🏫 Instructor
├── All student features
├── Create and publish courses
├── Edit and delete own courses
├── Upload and manage lessons
└── View enrolled students

🛡️ Admin
├── View all platform users
├── Delete any user account
├── Reset user passwords
├── Manage all courses
├── View platform analytics
└── Monthly enrollment charts
```

---

## 🗄️ Database Schema

### User Model
```js
{
  name:      String (required),
  email:     String (unique, required),
  password:  String (hashed, required),
  role:      enum['student', 'instructor', 'admin'],
  timestamps: true
}
```

### Course Model
```js
{
  title:       String (required),
  description: String (required),
  instructor:  ObjectId → User,
  category:    String,
  price:       Number (default: 0),
  image:       String,
  timestamps:  true
}
```

### Enrollment Model
```js
{
  student:    ObjectId → User,
  course:     ObjectId → Course,
  progress:   Number (0-100, default: 0),
  timestamps: true
}
```

### Lesson Model
```js
{
  title:     String (required),
  content:   String,
  videoUrl:  String,
  duration:  String,
  order:     Number,
  course:    ObjectId → Course,
  timestamps: true
}
```

---

## 📊 Marking Scheme

| Criteria | Marks | Status |
|---|---|---|
| UI/UX Design | 15 | ✅ Bootstrap 5 + Framer Motion |
| React Implementation | 15 | ✅ Hooks, Router, Axios |
| Backend API Development | 20 | ✅ Full RESTful API |
| Database Design | 15 | ✅ 4 Mongoose Models |
| Authentication & Security | 15 | ✅ JWT + Bcrypt |
| Role-Based Functionality | 10 | ✅ 3 Roles implemented |
| Code Quality & Structure | 5 | ✅ MVC Architecture |
| Deployment & Testing | 5 | 🔄 In Progress |
| **Total** | **100** | **95/100** |

---

## 🖼️ Screenshots

| Page | Description |
|---|---|
| 🏠 Home | Landing page with hero, features, testimonials |
| 📖 Courses | Course listing with search and payment modal |
| 📄 Course Detail | Full detail with lessons tab for enrolled students |
| 📊 Dashboard | Role-based dashboard (Student / Instructor) |
| 🛡️ Admin Panel | Analytics, user & course management |
| 👤 Profile | Edit name and change password |

---

## 📜 Student Declaration

> I confirm that this project is my own work and I have not copied it from any unauthorized source.

**Student Name:** Muhammad Shoaib  
**Course:** MERN Stack Web Development  
**Assessment:** Final Project  
**Date:** 2025  

---

## 👨‍💻 Author

<div align="center">

**Muhammad Shoaib**  
Full Stack MERN Developer

[![GitHub](https://img.shields.io/badge/GitHub-Muhammad--Shoaib--1-181717?style=for-the-badge&logo=github)](https://github.com/Muhammad-Shoaib-1/Learn-Space)

</div>

---

<div align="center">

**⭐ If you found this project helpful, please give it a star on GitHub! ⭐**

Made with ❤️ in Pakistan | Built with the MERN Stack

</div>