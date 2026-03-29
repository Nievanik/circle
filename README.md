# Circle 🔵 
*A peer-to-peer behavioral architecture built to combat academic isolation, structural burnout, and career stress.*

## 🏆 Hackathon Project Submission
Welcome to our repository! Circle is a platform that intelligently matches students and young professionals based on their career goals, emotional states, and support preferences to formulate highly relevant, empathetic peer support networks.

---

## 🛠 Tech Stack
- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Recharts, Lucide Icons, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-Time Engine**: Socket.IO

---

## 🚀 Features
- **Smart Matching Engine**: Finds peers tracking similar career goals and matching emotional struggle types (burnout, imposter syndrome, etc.).
- **The "Daily Check-In" Telemetry Engine**: Tracks daily pulse checks (Stress/Motivation) and feeds them into a mathematical Cohort Analyzer.
- **Support Circles**: Thematic group support sessions with real-time bi-directional chatrooms.
- **1:1 Direct Messaging**: Private inbox routing for active, accepted connections.
- **Linear Goal Lifecycles**: Strict weekly scopes focusing on three high-priority actions per week, culminating in a mandatory "Sunday Wrap-Up" reflection modal.
- **The Journey Visualizer**: Dual `Recharts` datasets mapping chronological `Stress Level vs. Motivation` ensuring honest mental timelines.

---

## 💻 Local Setup Instructions (For Judges)

We have configured the application to be incredibly easy to run locally.

> **DEMO NOTE:** Out of the box, we provide a standalone seeder script (`node seed.js`) that auto-populates your local MongoDB environment with 8 functionally distinct users for testing!

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (ensure the service is active on standard port `27017`) OR a remote MongoDB Atlas URI.

### 1. Clone & Install Dependencies
First, clone this repository and install the dependencies for both the frontend and backend architectures:

```bash
# Clone the repository
git clone https://github.com/nievanik/circle.git
cd circle

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Navigate to the `backend/` Directory and create an `.env` file containing the following:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/circle
JWT_SECRET=super_secret_hackathon_key_12345
```

### 3. Running the Application
You need two separate terminal tabs running concurrently to operate the full stack.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
node seed.js   # Generates 8 local dummy users!
npm run dev
```
*(The backend runs on `http://localhost:5000`)*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*(The frontend usually runs on `http://localhost:5173`. Open this URL in your browser!)*

> **Note for Judges testing the "Weekly Lifecycle Constraints":** 
> To test the "Sunday Wrap-Up" features without waiting a full week in real life, utilize the glowing **Time-Travel Widget** located in the bottom-left of the application interface!

---

## 👥 Team Members
- Nievanik Thapa Shrestha - Full Stack Developer / Architect
- Keepa Maharjan - Frontend Engineer / UI/UX / Project Management

