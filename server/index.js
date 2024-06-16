const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authenticateJWT = require('./middleware/auth');
require('dotenv').config();

const {
  getAnimations,
  getAnimationById,
  addAnimation,
  updateAnimation,
  deleteAnimation,
} = require('./models/animationModel');
const {
  getCollaborations,
  addOrUpdateCollaboration,
  deleteCollaboration,
} = require('./models/collaborationModel');
const { registerUser, getUserByUsername } = require('./models/userModel');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

// User registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Error registering user' });
    }
  }
});

// User login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// GraphQL setup
const typeDefs = gql`
  type Animation {
    id: ID!
    name: String!
    data: JSON!
    created_at: String!
  }

  type UserCollaboration {
    id: ID!
    animation_id: Int!
    user_id: String!
    state: JSON
    updated_at: String!
  }

  type FeaturedAnimation {
    id: ID!
    title: String!
    preview_url: String!
  }

  type Query {
    animations: [Animation]
    userCollaborations(animation_id: Int!): [UserCollaboration]
    featuredAnimations: [FeaturedAnimation]
  }

  type Mutation {
    addAnimation(name: String!, data: JSON!): Animation
    updateAnimation(id: ID!, name: String!, data: JSON!): Animation
    deleteAnimation(id: ID!): String
    updateUserCollaboration(animation_id: Int!, user_id: String!, state: JSON!): UserCollaboration
    deleteUserCollaboration(animation_id: Int!, user_id: String!): String
  }

  scalar JSON
`;

const resolvers = {
  Query: {
    animations: async () => {
      return await getAnimations();
    },
    userCollaborations: async (_, { animation_id }) => {
      return await getCollaborations(animation_id);
    },
    featuredAnimations: async () => {
      try {
        const response = await axios.post(
          'https://api.lottiefiles.com/v2/graphql',
          {
            query: `
              query {
                featuredPublicAnimations {
                  id
                  title
                  preview_url
                }
              }
            `,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.LOTTIEFILES_API_KEY}`,
            },
          }
        );

        return response.data.data.featuredPublicAnimations.map(animation => ({
          id: animation.id,
          title: animation.title,
          preview_url: animation.preview_url,
        }));
      } catch (error) {
        console.error('Error fetching featured animations:', error);
        return [];
      }
    },
  },
  Mutation: {
    addAnimation: async (_, { name, data }) => {
      return await addAnimation(name, data);
    },
    updateAnimation: async (_, { id, name, data }) => {
      return await updateAnimation(id, name, data);
    },
    deleteAnimation: async (_, { id }) => {
      await deleteAnimation(id);
      return 'Animation deleted successfully';
    },
    updateUserCollaboration: async (_, { animation_id, user_id, state }) => {
      return await addOrUpdateCollaboration(animation_id, user_id, state);
    },
    deleteUserCollaboration: async (_, { animation_id, user_id }) => {
      await deleteCollaboration(animation_id, user_id);
      return 'Collaboration deleted successfully';
    },
  },
};

async function startServer() {
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

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
