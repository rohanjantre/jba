# Hirely — Applicant Tracking System

A full-stack ATS: HR can post jobs and manage applicants through a status
pipeline; candidates can search jobs, apply with a resume upload, and track
their application status.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Cloudinary
  (resume storage), Nodemailer (status-change emails)
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios

## Project structure

```
ats/
  server/     Express API
  client/     React app
```

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:

- `MONGO_URI` — a MongoDB connection string. Easiest option: create a free
  cluster at mongodb.com/cloud/atlas, add a database user, and copy the
  connection string.
- `JWT_SECRET` — any long random string (e.g. `openssl rand -hex 32`).
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` —
  from your Cloudinary dashboard (free tier is fine) at cloudinary.com.
- `EMAIL_USER` / `EMAIL_PASS` — if using Gmail, turn on 2FA and generate an
  "App Password" (not your normal password) at
  myaccount.google.com/apppasswords.

Then run:

```bash
npm run dev
```

The API starts on `http://localhost:5000`. Health check: `GET /api/health`.

## 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app starts on `http://localhost:5173` and talks to the API at the URL in
`VITE_API_URL`.

## How the pieces map to your requirements

| Requirement | Where it lives |
|---|---|
| HR Login / Candidate Login | `POST /api/auth/login`, shared by both roles |
| Create Job | `POST /api/jobs` (HR only) → `CreateJob.jsx` |
| Apply for Job | `POST /api/applications/:jobId` (candidate only) → `JobDetails.jsx` |
| Resume Upload (Cloudinary) | `middleware/upload.js` (multer, memory) → `utils/uploadToCloudinary.js` |
| Job Search | `GET /api/jobs?search=&location=&jobType=` → `JobList.jsx` |
| Dashboard | `HRDashboard.jsx` (jobs + applicants), `CandidateDashboard.jsx` (my applications) |
| Application Status | `PATCH /api/applications/:id/status`, enum in `models/Application.js` |
| Email Notifications | `utils/sendEmail.js`, fired on apply + on status change |
| JWT Authentication | `middleware/auth.js`, `utils/generateToken.js` |
| Role Based Access (HR/User) | `middleware/role.js` (`authorize("hr")` / `authorize("candidate")`) |

## Notes / next steps you may want

- Passwords are hashed with bcrypt; tokens expire after 7 days by default
  (`JWT_EXPIRES_IN`).
- A candidate can only apply once per job (enforced by a unique DB index).
- HR can only edit/delete/view applicants for jobs they personally posted.
- For production: add refresh tokens, rate limiting on `/auth`, and move off
  the free Cloudinary/Mongo Atlas tiers as usage grows.
