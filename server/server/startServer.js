const express = require('express');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const socketIo = require('socket.io');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');
const cors = require('cors');
const bodyParser = require('body-parser');

const startServer = async () => {
  // Initialize Express app
  const app = express();
  const WEB_APP_URL = process.env.WEB_APP_URL || 'http://localhost:3000';

  // Middleware
  app.use(cors({ origin: WEB_APP_URL }));
  app.use(bodyParser.json());

  // GraphQL setup
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  // Socket.IO setup
  const httpServer = http.createServer(app);
  const io = socketIo(httpServer, {
    cors: {
      origin: WEB_APP_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Handle connection events
  io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen for 'join' events to join a room
    socket.on('join', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Listen for 'leave' events to leave a room
    socket.on('leave', (roomId) => {
      socket.leave(roomId);
      console.log(`User left room: ${roomId}`);
    });

    // Listen for 'update' events to handle real-time updates
    socket.on('update', (data) => {
      const { roomId, updateData } = data;
      socket.to(roomId).emit('update', updateData);
      console.log(`Update in room ${roomId}:`, updateData);
    });

    // Listen for animation property changes
    socket.on('updateAnimationProperties', (data) => {
      const { roomId, properties } = data;
      socket.to(roomId).emit('updateAnimationProperties', properties);
      console.log(`Animation properties updated in room ${roomId}:`, properties);
    });

    // Listen for layer management changes
    socket.on('updateLayerManagement', (data) => {
      const { roomId, layers } = data;
      socket.to(roomId).emit('updateLayerManagement', layers);
      console.log(`Layer management updated in room ${roomId}:`, layers);
    });

    // Listen for chat messages
    socket.on('chatMessage', (msg) => {
      io.emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  // Routes
  const authRoutes = require('../routes/authRoutes');
  app.use('/api/auth', authRoutes);

  // Start the server
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

module.exports = startServer;
