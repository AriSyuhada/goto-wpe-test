import { gql, useQuery } from '@apollo/client';
import { QueryResponse } from '../../interface/Contact/IGetContactDetailInterface';

const GET_CONTACT_LIST = gql`
  query GetContactDetail($id: Int!){
      contact_by_pk(id: $id) {
      last_name
      id
      first_name
      created_at
      phones {
        number
      }
    }
  }
`;

export function useQueryGetContactDetail(contactId: number) {
  return useQuery<QueryResponse>(GET_CONTACT_LIST, {
    variables: {
      id: contactId
    }
  });
};