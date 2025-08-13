# Blog API 

A minimal blogging REST API using Node.js, Express, and MongoDB.

## Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   ```
   npm install
   ```
3. Start MongoDB (local or Atlas).
4. Start dev server:
   ```
   npm run dev
   ```
5. Server runs at `http://localhost:5000` by default.

## What is included

- Basic Express server and MongoDB connection
- Models: User, Blog, VerificationToken
- Auth controllers: register, verify-email, login
- Blog controllers: create, list
- Utilities: jwt, otp, email (console fallback)
- Routes wired in `src/server.js`

