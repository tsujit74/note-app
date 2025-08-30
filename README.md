Here’s a professional **README.md** for your full-stack note-taking application:

````markdown
# Full-Stack Note-Taking Application

A full-stack note-taking application built with **React (TypeScript)** on the front-end and **Node.js (TypeScript)** on the back-end. Users can sign up using **email + OTP** or **Google login**, create and delete notes, and manage their account securely with **JWT authentication**.

---

## Features

- **User Authentication**
  - Signup/Login via email + OTP
  - Login via Google account (if previously signed up with Google)
  - JWT-based authentication for protected routes
- **Notes Management**
  - Create, view, and delete personal notes
  - Notes are linked to the authenticated user
- **Responsive Design**
  - Mobile-friendly UI following the provided design
  - Clean and intuitive interface
- **Security**
  - Passwords hashed with bcrypt
  - OTP verification with expiration
  - JWT for secure API access

---

## Technology Stack

- **Frontend:** React.js + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express (TypeScript)
- **Database:** MongoDB 
- **Authentication:** JWT + Google OAuth
- **Version Control:** Git
- **Deployment:** Frontend Vercel and Backend Render

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/tsujit74/note-app
cd note-taking-app
````

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend`:

```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>
GOOGLE_CLIENT_ID=<your-google-client-id>
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=<your-google-client-id>
```

Run the frontend:

```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## Deployment

* Deploy backend to your preferred cloud platform RENDER
* Deploy frontend to Vercel or Netlify
* Ensure the frontend `.env` `REACT_APP_API_URL` points to your deployed backend URL
* Google OAuth should use your production domain in the Google Cloud Console

---

## Usage

1. Open the app in your browser
2. Signup using email + OTP or Google account
3. Verify OTP (if using email)
4. Access your dashboard
5. Create, view, and delete notes

---


---

## Notes

* Only registered users can create or delete notes

---

```
