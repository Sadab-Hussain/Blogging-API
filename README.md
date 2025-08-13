# Blog API - Starter Scaffold

This is a starter scaffold for the Blog API (Node.js + Express + MongoDB).

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
5. Server runs at `http://localhost:8000` by default.

## What is included

- Basic Express server and MongoDB connection
- Models: User, Blog, VerificationToken
- Auth controllers: register, verify-email, login
- Blog controllers: create, list
- Utilities: jwt, otp, email (console fallback)
- Routes wired in `src/server.js`

