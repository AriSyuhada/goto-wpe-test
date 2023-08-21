import { gql, useLazyQuery } from '@apollo/client';
import { QueryResponse } from '../../interface/Contact/IGetContactListInterface'

export const GET_CONTACT_LIST = gql`
  query GetContactList (
    $distinct_on: [contact_select_column!], 
    $limit: Int, 
    $offset: Int, 
    $order_by: [contact_order_by!], 
    $where: contact_bool_exp
  ) {
    contact(
      distinct_on: $distinct_on, 
      limit: $limit, 
      offset: $offset, 
      order_by: $order_by, 
      where: $where
    ){
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

export function useLazyQueryGetContactList() {
  return useLazyQuery<QueryResponse>(GET_CONTACT_LIST);
};