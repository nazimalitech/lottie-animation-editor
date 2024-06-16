const axios = require('axios');
const {
  getAnimations,
  addAnimation,
  updateAnimation,
  deleteAnimation,
} = require('../models/animationModel');
const {
  getCollaborations,
  addOrUpdateCollaboration,
  deleteCollaboration,
} = require('../models/collaborationModel');

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

module.exports = resolvers;
