import { gql, useMutation } from '@apollo/client';

const DELETE_CONTACT_PHONE = gql`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;

export function useMutationDeleteContactPhone() {
  return useMutation(DELETE_CONTACT_PHONE);
};