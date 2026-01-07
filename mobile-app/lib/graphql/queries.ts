import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      birthDate
      createdAt
    }
  }
`;

export const SCHOOLS_QUERY = gql`
  query GetSchools {
    schools {
      id
      name
      description
      address
      city
      country
    }
  }
`;
