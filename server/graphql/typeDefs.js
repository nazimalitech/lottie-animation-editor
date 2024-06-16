const { gql } = require('apollo-server-express');

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

module.exports = typeDefs;
