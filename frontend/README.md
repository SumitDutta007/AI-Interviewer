# FresherAI

FresherAI is a full-stack AI interview preparation platform for resume scoring, resume building, mock technical and HR interviews, interview feedback, and personalized career roadmaps.

## Features

- Google authentication with Firebase
- ATS-style resume scoring and improvement suggestions
- Guided resume builder with PDF preview
- Technical and HR mock interviews
- AI-generated interview questions and answer feedback
- Interview history and performance reports
- Personalized career roadmaps with learning resources
- Interview coin balance and Razorpay purchases
- Redis-backed session and feature caching

## Architecture

The project uses a React frontend and six Node.js backend services.

```text
Browser
  |
  | HTTPS
  v
Vercel React App
  |
  | API and credentials
  v
API Gateway
  |
  +--> Auth Service
  +--> Resume Service
  +--> Interview Service
  +--> Roadmap Service
  +--> Billing Service
```

External services:

- MongoDB for persistent application data
- Redis for sessions, resume cache, interview cache, and roadmap cache
- Firebase Authentication for Google sign-in
- Firebase Admin for ID-token verification
- Groq and LangChain for generated interview and roadmap content
- YouTube Data API for roadmap videos
- Razorpay for coin purchases

## Repository Structure

```text
frontend/
  public/
  src/
    apis/
    assets/
    components/
    pages/
    redux/
    utils/

backend/
  gateway/
  services/
    auth/
    billing/
    interview/
    resume/
    roadmap/
  docker-compose.yml
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas or a local MongoDB instance
- Redis or Redis Cloud
- Firebase project with Google Authentication enabled
- Groq API key
- YouTube Data API key
- Razorpay account for billing

## Local Setup

Clone the repository:

```powershell
git clone https://github.com/SumitDutta007/AI-Interviewer.git
cd AI-Interviewer
```

Start Redis:

```powershell
cd backend
docker compose up -d
```

Install dependencies in the frontend and each backend service:

```powershell
npm install --prefix frontend
npm install --prefix backend/gateway
npm install --prefix backend/services/auth
npm install --prefix backend/services/resume
npm install --prefix backend/services/interview
npm install --prefix backend/services/roadmap
npm install --prefix backend/services/billing
```

## Environment Variables

The repository ignores `.env` files. Create a local `.env` inside each service directory.

Do not commit real credentials.

### Frontend

Create `frontend/.env`:

```env
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_public_key_id
VITE_BACKEND_URL=http://localhost:8000
```

### API Gateway

Create `backend/gateway/.env`:

```env
PORT=8000
REDIS_URL=redis://localhost:6379
AUTH_SERVICE_URL=http://localhost:8001
RESUME_SERVICE_URL=http://localhost:8002
INTERVIEW_SERVICE_URL=http://localhost:8003
ROADMAP_SERVICE_URL=http://localhost:8004
BILLING_SERVICE_URL=http://localhost:8005
FRONTEND_URL=http://localhost:5173
```

### Auth Service

Create `backend/services/auth/.env`:

```env
PORT=8001
MONGODB_URL=mongodb_connection_string
REDIS_URL=redis_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
```

### Resume Service

Create `backend/services/resume/.env`:

```env
PORT=8002
MONGODB_URL=mongodb_connection_string
REDIS_URL=redis_connection_string
GROQ_API_KEY=your_groq_api_key
```

### Interview Service

Create `backend/services/interview/.env`:

```env
PORT=8003
MONGODB_URL=mongodb_connection_string
REDIS_URL=redis_connection_string
GROQ_API_KEY=your_groq_api_key
```

### Roadmap Service

Create `backend/services/roadmap/.env`:

```env
PORT=8004
MONGODB_URL=mongodb_connection_string
REDIS_URL=redis_connection_string
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### Billing Service

Create `backend/services/billing/.env`:

```env
PORT=8005
MONGODB_URL=mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Run Locally

Open one terminal for every service.

```powershell
npm start --prefix backend/services/auth
npm start --prefix backend/services/resume
npm start --prefix backend/services/interview
npm start --prefix backend/services/roadmap
npm start --prefix backend/services/billing
npm start --prefix backend/gateway
npm run dev --prefix frontend
```

The local URLs are:

| Component | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Gateway | http://localhost:8000 |
| Auth | http://localhost:8001 |
| Resume | http://localhost:8002 |
| Interview | http://localhost:8003 |
| Roadmap | http://localhost:8004 |
| Billing | http://localhost:8005 |

## Firebase Configuration

In Firebase Console:

1. Enable Google under Authentication → Sign-in method.
2. Add `localhost` and `127.0.0.1` for local development.
3. Add the production Vercel domain to Authentication → Settings → Authorized domains.
4. Create a service account for the auth service.
5. Store the private key as an environment variable, not in source code.

Private keys containing newline escapes must be converted to real newlines by the application configuration before use.

## Production Deployment

Deploy the frontend on Vercel and each backend service on Render or another container platform.

Use one public URL for the gateway and configure it in the frontend:

```env
VITE_BACKEND_URL=https://your-gateway-service.onrender.com
```

Configure each upstream URL in the gateway environment:

```env
AUTH_SERVICE_URL=https://your-auth-service.onrender.com
RESUME_SERVICE_URL=https://your-resume-service.onrender.com
INTERVIEW_SERVICE_URL=https://your-interview-service.onrender.com
ROADMAP_SERVICE_URL=https://your-roadmap-service.onrender.com
BILLING_SERVICE_URL=https://your-billing-service.onrender.com
FRONTEND_URL=https://your-app.vercel.app
```

Set `PORT` through the platform environment or use each service's default port. The gateway and services listen on `PORT` when provided.

The frontend includes a Vercel rewrite so direct React routes such as `/dashboard`, `/interview`, and `/roadmap` resolve correctly.

## API Routes

| Route | Method | Service | Authentication |
|---|---|---|---|
| `/api/auth/login` | POST | Auth | No |
| `/api/auth/logout` | GET | Auth | Session |
| `/api/me` | GET | Gateway | Session |
| `/api/resume/upload` | POST | Resume | Session |
| `/api/resume/get-resume` | GET | Resume | Session |
| `/api/interview/start` | POST | Interview | Session |
| `/api/interview/answer` | POST | Interview | Session |
| `/api/interview/all` | GET | Interview | Session |
| `/api/roadmap/generate` | POST | Roadmap | Session |
| `/api/roadmap/all` | GET | Roadmap | Session |
| `/api/billing/create` | POST | Billing | Session |

## Build and Test

Build the frontend:

```powershell
npm run build --prefix frontend
npm run lint --prefix frontend
```

Check backend JavaScript syntax:

```powershell
node --check backend/gateway/index.js
node --check backend/gateway/utils/proxyWithHeaders.js
node --check backend/services/auth/index.js
node --check backend/services/resume/index.js
node --check backend/services/interview/index.js
node --check backend/services/roadmap/index.js
node --check backend/services/billing/index.js
```

## Security

Before publishing or deploying, rotate every credential that was previously committed or shared in source control or chat:

- MongoDB credentials
- Redis credentials
- Groq API keys
- YouTube API key
- Razorpay key and secret
- Firebase private key

Remove real credentials from `.env` files and use platform environment variables for deployment. After rotating a key, redeploy every service that uses it.
