import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $birthDate: String) {
    signup(username: $username, email: $email, password: $password, birthDate: $birthDate) {
      token
      user {
        id
        username
        email
        birthDate
        createdAt
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        birthDate
        createdAt
      }
    }
  }
`;
