import { gql, useQuery } from '@apollo/client';
import { QueryResponse } from '../../interface/Phone/IGetPhoneListInterface';

export const GET_PHONE_LIST = gql`
  query GetPhoneList(
    $where: phone_bool_exp, 
    $distinct_on: [phone_select_column!], 
    $limit: Int = 10, 
    $offset: Int = 0, 
    $order_by: [phone_order_by!]
  ) {
    phone(where: $where, distinct_on: $distinct_on, limit: $limit, offset: $offset, order_by: $order_by) {
      contact {
        last_name
        first_name
        id
      }
      number
    }
  }
`;

export function useQueryGetPhoneList(fname: string = '', lname: string = '', phone: string = '') {
  return useQuery<QueryResponse>(GET_PHONE_LIST, {
    variables: {
      contact: {
        first_name: {
          _like: `%${fname}%`
        },
        last_name: {
          _like: `%${lname}%`
        }
      },
      number: {
        _like: `%${phone}%`
      }
    }
  });
};