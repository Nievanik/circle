# Circle — Smart Peer Support for Career + Mental Health

Circle is a platform built for the Nepal-US Hackathon 2026. It intelligently matches students and young professionals based on their career goals, emotional states, and support preferences for highly relevant peer support.

## Full Stack Structure
- `frontend/` - React frontend powered by Vite and Tailwind CSS.
- `backend/` - Node.js + Express backend with MongoDB and JWT Auth.

## Features
- **Smart Matching Engine**: Finds peers with similar career goals and emotional states.
- **Support Circles**: Thematic group support sessions.
- **Goal Tracking & Check-ins**: Periodic accountability logging.
- **Peer Connections**: 1:1 Messaging.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017/circle` or an Atlas URI.

### Environment Setup
1. Copy `.env.example` to `.env` in the `backend/` folder and configure variables.

### Running Local Development
1. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend**:
   ```bash
   cd backend
   npm install
   npm run start
   ```
