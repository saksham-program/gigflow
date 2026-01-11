# GigFlow – Mini Freelance Marketplace Platform

GigFlow is a mini freelance marketplace inspired by platforms like Upwork and Fiverr, developed as part of a full stack internship assignment to demonstrate real-world backend and frontend workflows.

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS + Redux Toolkit
- Backend: Node.js + Express
- Database: MongoDB Atlas + Mongoose
- Auth: JWT stored in **HttpOnly cookies**
- Realtime: Socket.io notifications when a freelancer is hired

## Core Flows
- Any user can act as **client** (post gigs) and **freelancer** (bid on others)
- Public feed shows **OPEN** gigs
- Gig owners can view all bids on their gigs
- Hiring is **atomic**: exactly one bid can be hired, others rejected, gig becomes `assigned`

## API
- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- Gigs
  - `GET /api/gigs?q=search`
  - `POST /api/gigs`
  - `GET /api/gigs/:id`
- Bids
  - `POST /api/bids`
  - `GET /api/bids/:gigId` (only gig owner)
  - `PATCH /api/bids/:bidId/hire` (only gig owner)

## Hiring Atomicity (race-condition safe)
Hiring uses a MongoDB transaction + a strict conditional update on the gig:
- only updates gig from `open` → `assigned` if currently open
- if two “Hire” clicks happen concurrently, only the first transaction can flip status; the other gets `409 Gig already assigned`

## Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
# Fill MONGODB_URI and JWT_SECRET
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Notes for MongoDB Atlas Transactions
MongoDB transactions require a **replica set**. Atlas clusters already support this.

## Deployment
- Deploy backend and frontend separately.
- Ensure backend sets cookies with correct `sameSite`/`secure` values for production (already handled in code via `NODE_ENV=production`).

## Hiring Flow (Demo Walkthrough)

1. User registers and logs in.
2. User creates a gig as a client.
3. Another user logs in and submits a bid on the gig.
4. Gig owner views all bids on their gig.
5. Gig owner clicks "Hire" on one bid.
6. System behavior:
   - Gig status changes from `open` to `assigned`
   - Selected bid becomes `hired`
   - All other bids are automatically marked `rejected`
7. Hired freelancer receives a real-time Socket.io notification.


## Environment Variables
A `.env.example` file is included in both frontend and backend.
No secrets are committed to the repository.


## What This Project Demonstrates
- Secure JWT authentication using HttpOnly cookies
- Clean REST API design
- MongoDB relational modeling using Mongoose
- Atomic business logic using transactions
- Real-time communication using Socket.io
- Scalable frontend state management with Redux Toolkit

