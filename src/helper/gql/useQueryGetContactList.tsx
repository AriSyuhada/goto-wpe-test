import { gql, useQuery } from '@apollo/client';
import { QueryResponse } from "../../interface/Contact/IGetContactListInterface";

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

export function useQueryGetContactList(fname: string = '', lname: string = '') {
  return useQuery<QueryResponse>(GET_CONTACT_LIST, {
    variables: {
      where: {
        first_name: {
          _like: `%${fname}%`,
        },
        last_name: {
          _like: `%${lname}%`,
        }
      },
    }
  });
};