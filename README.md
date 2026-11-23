# FresherAI

FresherAI is an AI-powered career preparation platform that combines resume tools, mock interviews, interview feedback, career roadmaps, and interview coin billing.

## Features

- Google Authentication with Firebase
- ATS-style resume scoring
- Guided resume builder and PDF preview
- Technical and HR mock interviews
- AI-generated questions and answer feedback
- Interview history and performance reports
- Personalized career roadmaps
- Redis-backed sessions and feature caching
- Razorpay coin purchases

## Architecture

```text
Vercel Frontend
      |
      v
API Gateway
      |
      +--> Auth Service
      +--> Resume Service
      +--> Interview Service
      +--> Roadmap Service
      +--> Billing Service
```

Persistent services include MongoDB, Redis, Firebase, Groq, YouTube Data API, and Razorpay.

## Repository Structure

```text
frontend/
  public/
  skills/
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
- MongoDB Atlas or MongoDB
- Redis or Redis Cloud
- Firebase project
- Groq API account
- YouTube Data API key
- Razorpay account

## Local Installation

Clone the repository:

```powershell
git clone https://github.com/SumitDutta007/AI-Interviewer.git
cd AI-Interviewer
```

Start Redis:

```powershell
docker compose -f backend/docker-compose.yml up -d
```

Install dependencies:

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

The repository ignores `.env` files. Never commit real API keys or private credentials.

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
MONGODB_URL=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
```

### Resume Service

Create `backend/services/resume/.env`:

```env
PORT=8002
MONGODB_URL=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
GROQ_API_KEY=your_groq_api_key
```

### Interview Service

Create `backend/services/interview/.env`:

```env
PORT=8003
MONGODB_URL=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
GROQ_API_KEY=your_groq_api_key
```

### Roadmap Service

Create `backend/services/roadmap/.env`:

```env
PORT=8004
MONGODB_URL=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

### Billing Service

Create `backend/services/billing/.env`:

```env
PORT=8005
MONGODB_URL=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Run Locally

Start each process in its own terminal:

```powershell
npm start --prefix backend/services/auth
npm start --prefix backend/services/resume
npm start --prefix backend/services/interview
npm start --prefix backend/services/roadmap
npm start --prefix backend/services/billing
npm start --prefix backend/gateway
npm run dev --prefix frontend
```

| Component | Local URL |
|---|---|
| Frontend | http://localhost:5173 |
| Gateway | http://localhost:8000 |
| Auth | http://localhost:8001 |
| Resume | http://localhost:8002 |
| Interview | http://localhost:8003 |
| Roadmap | http://localhost:8004 |
| Billing | http://localhost:8005 |

## Firebase Setup

1. Enable Google sign-in in Firebase Authentication.
2. Add `localhost` and `127.0.0.1` to authorized domains for local testing.
3. Add the production Vercel domain to Firebase authorized domains.
4. Create a Firebase Admin service account for the auth service.
5. Set `FIREBASE_PRIVATE_KEY` as an environment variable containing the service-account private key.

## Production Deployment

Deploy the frontend on Vercel and the gateway plus five services on Render or another Node.js platform.

Set the frontend backend URL:

```env
VITE_BACKEND_URL=https://your-gateway.onrender.com
```

Set public upstream URLs in the gateway:

```env
AUTH_SERVICE_URL=https://your-auth-service.onrender.com
RESUME_SERVICE_URL=https://your-resume-service.onrender.com
INTERVIEW_SERVICE_URL=https://your-interview-service.onrender.com
ROADMAP_SERVICE_URL=https://your-roadmap-service.onrender.com
BILLING_SERVICE_URL=https://your-billing-service.onrender.com
FRONTEND_URL=https://your-app.vercel.app
```

The frontend includes `frontend/vercel.json` to route direct React URLs through `index.html`.

## API Routes

| Route | Method | Authentication |
|---|---|---|
| `/api/auth/login` | POST | No |
| `/api/auth/logout` | GET | Session |
| `/api/me` | GET | Session |
| `/api/resume/upload` | POST | Session |
| `/api/resume/get-resume` | GET | Session |
| `/api/interview/start` | POST | Session |
| `/api/interview/answer` | POST | Session |
| `/api/interview/all` | GET | Session |
| `/api/roadmap/generate` | POST | Session |
| `/api/roadmap/all` | GET | Session |
| `/api/roadmap/:id` | GET | Session |
| `/api/billing/create` | POST | Session |
| `/api/billing/verify` | POST | Session |

## Build and Syntax Checks

```powershell
npm run build --prefix frontend
npm run lint --prefix frontend

node --check backend/gateway/index.js
node --check backend/gateway/utils/proxyWithHeaders.js
node --check backend/services/auth/index.js
node --check backend/services/resume/index.js
node --check backend/services/interview/index.js
node --check backend/services/roadmap/index.js
node --check backend/services/billing/index.js
```

## Security

Before publishing or deploying:

- Rotate MongoDB and Redis credentials.
- Rotate Groq, YouTube, Firebase, and Razorpay credentials.
- Store all secrets in service environment variables.
- Never commit `.env`, private keys, or service-account JSON files.
- Rotate credentials after they have appeared in source control or chat.
