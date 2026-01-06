const gql = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    birthDate: String
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Image {
    id: ID!
    userId: ID!
    imagePath: String!
    uploadedAt: String!
  }

  type Model {
    id: ID!
    name: String!
    version: String!
  }

  type Class {
    id: ID!
    label: String!
    description: String
  }

  type Prediction {
    id: ID!
    imageId: ID!
    modelId: ID!
    predictedClassId: ID!
    confidenceScore: Float!
    predictedAt: String!
  }

  type School {
    id: ID!
    name: String!
    description: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    images: [Image!]!
    image(id: ID!): Image
    models: [Model!]!
    model(id: ID!): Model
    classes: [Class!]!
    class(id: ID!): Class
    predictions: [Prediction!]!
    prediction(id: ID!): Prediction
    schools: [School!]!
    school(id: ID!): School
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!, birthDate: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createUser(username: String!, email: String!, password: String!): User!
    createImage(userId: ID!, imagePath: String!): Image!
    createModel(name: String!, version: String!): Model!
    createClass(label: String!, description: String): Class!
    createPrediction(imageId: ID!, modelId: ID!, predictedClassId: ID!, confidenceScore: Float!): Prediction!
    createSchool(name: String!, description: String): School!
  }
`;

module.exports = typeDefs;
