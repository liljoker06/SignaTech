import { gql } from '@apollo/client';

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
