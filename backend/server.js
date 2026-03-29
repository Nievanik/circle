const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Internal Testing Interceptor: Time Travel simulation
const timeTravelMiddleware = require('./middleware/timeTravel');
app.use(timeTravelMiddleware);

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const circleRoutes = require('./routes/circles');
const messageRoutes = require('./routes/messages');
const connectionRoutes = require('./routes/connections');
const goalRoutes = require('./routes/goalRoutes');
const dailyCheckInRoutes = require('./routes/dailyCheckInRoutes');
const weeklySummaryRoutes = require('./routes/weeklySummaryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/daily-checkins', dailyCheckInRoutes);
app.use('/api/weekly-summary', weeklySummaryRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io on the native HTTP server
const socketIo = require('./socket');
socketIo.init(server);

server.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
