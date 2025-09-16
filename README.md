# MedCareer Connect

A MERN application that connects healthcare professionals with employers. Built with React (Vite), Node/Express, MongoDB, and Tailwind/Styled-Components. The server serves the built client and exposes REST APIs under /api/v1.

Live (if deployed): https://medcareer.onrender.com/

## Tech Stack

- Frontend
  - React 18, Vite 5, React Router 6
  - TailwindCSS, Styled-Components
  - Axios, React Toastify, Recharts, React Icons
- Backend
  - Node.js, Express
  - MongoDB, Mongoose
  - JWT auth, bcrypt, cookie-parser, morgan
  - Cloudinary (for media), Multer

## Project Structure

- Root (Express API, server, database, scripts, routes, models)
- client (Vite React app, proxied to the API during development)

## Environment Variables

Create a .env file in the project root with:

- PORT=5100 (optional)
- MONGO_URL=YOUR_MONGODB_CONNECTION_STRING
- NODE_ENV=development
- JWT_SECRET=your_jwt_secret
- JWT_EXPIRE=30d
- JWT_COOKIE_EXPIRE=30
- CLOUDINARY_NAME=your_cloudinary_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Notes:

- The client’s Axios instance targets /api/v1 (proxied to http://localhost:5100/api during development).
- Vite dev server proxy is configured in client/vite.config.js.

## Installation

- Install root and client dependencies in one step:

```bash
npm run setup-project
```

## Running in Development

- Start both server and client concurrently:

```bash
npm run dev
```

- Or run just the client:

```bash
npm run client
```

- Or run just the server:

```bash
npm run server
```

The client runs on http://localhost:5173 and proxies API requests to http://localhost:5100/api.

## Build and Run (Production)

- Install deps and build the client app:

```bash
npm run setup-production-app
```

- Build client only (from client folder):

```bash
npm run build
```

- The Express server statically serves client/dist and exposes APIs under /api/v1.

## Database Seeding (Optional)

Scripts exist for loading mock users and jobs:

- Seed users:

```bash
node injectUsers.js
```

- Seed jobs:

```bash
node injectJobs.js
```

Notes:

- injectJobs.js associates jobs to an existing user found by email "medcareer@gg.co". Make sure this user exists (register it first or adjust the script/email accordingly).
- Ensure MONGO_URL is set before running seed scripts.

## API Overview (Selected)

Base URL during development (via Vite proxy): http://localhost:5173/api/v1
Base URL on server: http://localhost:5100/api/v1

- Auth (/api/v1/auth)
  - POST /register
  - POST /login
  - GET /logout
  - GET /guest
- Jobs (/api/v1/jobs)
  - GET / (list jobs, supports filters via query params)
  - GET /:id (get job by id)
  - POST / (create job, authenticated)
  - PATCH /:id (update job, authenticated)
  - DELETE /:id (delete job, authenticated)
  - GET /all-jobs (returns jobs + count for current filters)
  - GET /show-stats (stats for authenticated user)
- Users (/api/v1/users)
  - Protected routes (e.g. /users/current-user via Dashboard loader)

Additionally:

- GET /api/v1/test (simple health/test endpoint)
- GET /api/v1/all-users (dev/global endpoint for listing users)

## Frontend Routes

- /
  - / Landing
  - /register Register
  - /login Login
  - /job-seekers Job Seekers (template page)
- /dashboard (protected)
  - /stats
  - /all-jobs
  - /add-job
  - /edit-job/:id
  - /delete-job/:id
  - /profile
  - /admin

## Conventions

- Axios client configured at client/src/utils/customFetch.js with baseURL "/api/v1".
- Vite proxy (client/vite.config.js) rewrites "/api" to "http://localhost:5100/api", so client code uses relative "/api/v1/...".
- Express serves client/dist and uploads folder under /uploads.

## Available Scripts

Root package.json:

- setup-project Install root + client deps
- setup-production-app Install deps and build client
- dev Run server + client concurrently
- server Run API via nodemon
- client Run Vite dev server

Client package.json:

- dev Start Vite dev server
- build Build production bundle
- preview Preview built client

## License

ISC

## Credits

- Jobify template by codingAddict
- Aymen HML
