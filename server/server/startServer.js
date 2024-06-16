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

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());

  // GraphQL setup
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  // Socket.IO setup
  const httpServer = http.createServer(app);
  const io = socketIo(httpServer);

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

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  // Routes
  const authRoutes = require('../routes/authRoutes');
  app.use('/auth', authRoutes);

  // Start the server
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

module.exports = startServer;
