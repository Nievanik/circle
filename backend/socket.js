let io;
const userSockets = new Map(); // Maps userId to active socketId

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, {
      cors: {
        origin: '*', // In dev, allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    console.log('WebSocket server initialized.');

    io.on('connection', (socket) => {
      // Connect
      socket.on('register', (userId) => {
        if (!userId) return;
        userSockets.set(userId.toString(), socket.id);
        console.log(`User ${userId} registered to real-time socket ${socket.id}`);
      });

      // Disconnect cleanup
      socket.on('disconnect', () => {
        for (const [userId, socketId] of userSockets.entries()) {
          if (socketId === socket.id) {
            userSockets.delete(userId);
            break;
          }
        }
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io has not been initialized!');
    }
    return io;
  },
  getUserSocket: (userId) => {
    if (!userId) return null;
    return userSockets.get(userId.toString());
  }
};
