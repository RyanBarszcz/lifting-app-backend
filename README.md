# 🏋️ Workout Tracker Backend API

A production-style backend for a workout tracking application inspired by apps like Hevy. This API handles workout sessions, exercise tracking, performance metrics, and secure user authentication.

---

## 🚀 Overview

This backend powers a full-stack fitness tracking app, allowing users to:

* Start and complete workout sessions
* Track sets (weight, reps)
* View previous workout performance
* Automatically calculate performance metrics (volume, PRs, estimated 1RM)

The system is designed with **clean API structure, relational data modeling, and testable architecture**.

---

## 🧠 Core Features

### 🏋️ Workout Sessions

* Start a new workout session
* Prevent multiple active sessions
* Complete sessions with exercises and sets

### 📊 Performance Tracking

* Track:

  * Weight
  * Reps
  * Volume
* Automatically updates:

  * Max weight
  * Max reps
  * Estimated 1RM
  * Total volume

### 🔁 Previous Workouts

* Fetch previous sets for exercises
* Optimized queries for fast lookup
* Sorted by most recent completed session

### 🔐 Authentication

* Uses Clerk for JWT-based authentication
* Middleware protects all routes
* Test environment includes auth mocking

---

## 🏗️ Tech Stack

* **Node.js**
* **Express**
* **PostgreSQL**
* **Prisma ORM**
* **Clerk (Authentication)**
* **Jest + Supertest (Testing)**

---

## 📁 Project Structure

```bash
src/
├── routes/
│   ├── sessions.routes.js
│   ├── templates.routes.js
├── middleware/
│   ├── requireAuth.js
│   ├── syncUser.js
├── lib/
│   └── prisma.js
```

---

## 🔌 API Endpoints

### ▶️ Start Workout Session

```http
POST /sessions/start
```

Creates a new workout session.

---

### ✅ Complete Workout Session

```http
POST /sessions/:id/complete
```

Completes a session and stores all exercises and sets.

---

### 🔁 Get Previous Workouts

```http
GET /workout/previous?exerciseIds=...
```

Returns previous sets for given exercises.

---

## 🧪 Testing

This project includes backend integration tests using **Jest** and **Supertest**.

### ✅ Coverage

* Session creation
* Session completion (DB writes + state updates)
* Previous workout queries
* Edge case handling

### 🔐 Test Environment

* Clerk authentication is mocked
* Test user is automatically created
* Real database interactions via Prisma

### ▶️ Run Tests

```bash
npm test
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgres_url
CLERK_SECRET_KEY=your_clerk_secret
```

---

## 🧠 Design Highlights

* RESTful API design
* Relational schema with normalized tables
* Transaction-safe session completion
* Efficient querying for historical performance
* Middleware-based authentication and user syncing

---

## 🚀 Future Improvements

* Redis caching for previous workouts
* Background jobs for metric calculations
* Rate limiting and request validation (Zod)
* Separate test database environment
* API documentation (OpenAPI/Swagger)

---

## 👤 Author

Ryan Barszcz

* GitHub: https://github.com/RyanBarszcz
* Portfolio: https://ryanbarszcz.com

---

## 📌 Notes

This backend was built to simulate a **production-level system**, focusing on backend architecture, data integrity, and performance tracking rather than just CRUD functionality.
