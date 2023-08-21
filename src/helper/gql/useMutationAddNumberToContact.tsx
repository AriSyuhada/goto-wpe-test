import { gql, useMutation } from '@apollo/client';

const ADD_NUMBER_TO_CONTACT = gql`
  mutation AddNumberToContact ($contact_id: Int!, $phone_number:String!) {
    insert_phone(objects: {contact_id: $contact_id, number: $phone_number}) {
      returning {
        contact {
          id
          last_name
          first_name
          phones {
            number
          }
        }
      }
    }
  }
`;

export function useMutationAddNumberToContact() {
  return useMutation(ADD_NUMBER_TO_CONTACT);
};