This repository contains a secure, real-time chat application built to showcase practical full-stack engineering skills with a strong focus on authentication, encryption, and real-time communication.

Deployed on Render

🗄️ Database
PostgreSQL (Production)

SQLite (Local development)

✨ Application Features
🔑 Authentication & Session Management
Custom-built authentication flow

JWT-based Access & Refresh Tokens

Access Token

Short validity (15 minutes)

Required for all protected APIs & WebSockets

Refresh Token

Valid for 7 days

Stored securely as HTTP-only cookie

Rotation mechanism implemented

Logout revokes active sessions

💬 Messaging Capabilities
👤 Private Chats
Users can start one-to-one conversations

Existing private chats are reused

Messages delivered instantly via WebSockets

👥 Group Chats
Create and manage group conversations

Join available public groups

Persistent group message history

Real-time updates for all members

🔒 Security & Data Protection
All messages are encrypted using AES-256 before saving to the database

No plaintext messages are ever stored

Messages are decrypted only when sent to authorized clients

Passwords are hashed using bcrypt

Token validation enforced across APIs and WebSockets

🧱 System Architecture
🔷 High-Level Design
pgsql
Copy code
React Client (Vite)
        │
        │ HTTPS (JWT)
        ▼
Django REST API Layer
(Authentication & Chat APIs)
        │
        │ WebSocket (JWT-secured)
        ▼
Django Channels
(Real-Time Messaging)


Deployed Frontend on vercel----

https://q-frontend-nu.vercel.app/
