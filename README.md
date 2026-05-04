# AI Mock Interview Platform

This project has:

- `client/`: React + Vite frontend
- `server/`: Node.js + Express API

## Local setup

1. Create `server/.env` from `server/.env.example`.
2. Create `client/.env` from `client/.env.example` if you want to override the local API URL.
3. Start the backend:

```bash
cd server
npm run dev
```

4. Start the frontend:

```bash
cd client
npm run dev
```

## Production environment variables

### Backend

Set these on your backend host:

- `PORT`
- `NODE_ENV=production`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `GEMINI_API_KEY`
- `MURF_API_KEY`
- `ASSEMBLYAI_API_KEY`
- `CLIENT_URL`

`CLIENT_URL` can be a single frontend origin or a comma-separated list, for example:

```env
CLIENT_URL=https://your-frontend.vercel.app,https://www.yourdomain.com
```

### Frontend

Set this on your frontend host:

- `VITE_API_URL`

Example:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## Recommended deployment

### Option 1: Vercel + Render

- Deploy `client/` to Vercel.
- Deploy `server/` to Render as a Web Service.

Backend settings:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Frontend settings:

- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

After the backend is live:

1. Copy the backend URL.
2. Set `VITE_API_URL` in the frontend deployment.
3. Set `CLIENT_URL` in the backend deployment to your frontend domain.
4. Redeploy both if needed.

### Option 2: Railway for backend + Vercel/Netlify for frontend

Use the same environment variables. Point:

- `VITE_API_URL` to your Railway backend `/api`
- `CLIENT_URL` to your frontend domain

## Health check

The backend exposes:

```text
/api/health
```

Use it to confirm the API is up after deployment.
