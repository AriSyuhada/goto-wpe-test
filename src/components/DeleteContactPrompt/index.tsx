import styled from '@emotion/styled';
import React from 'react';
import { useMutationDeleteContactPhone } from '../../helper/gql/useMutationDeleteContactPhone';
import { useQueryGetContactDetail } from '../../helper/gql/useQueryGetContactDetail';
import {
  Trash,
  X,
} from '@styled-icons/fa-solid';

interface PropsInterface {
  refetch: () => void,
  toggle: (isShow: boolean) => void,
  contactId: number
}

export default function DeleteContactPrompt(props : PropsInterface) {
  const { data, error, loading } = useQueryGetContactDetail(props.contactId);
  const [ deleteContactPhone ] = useMutationDeleteContactPhone();
  
  if (loading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div>
        An error occurred
      </div>
    )
  }

  const handleDeleteConfirmation = async () => {
    try {
      const { data } = await deleteContactPhone({
        variables: {
          id: props.contactId
        },
        onCompleted: () => {props.refetch()},
      });
      if (loading) console.log('loading sek gan');
      console.log("Contact deleted: ", data.addContactsWithPhones);
    } catch (error) {
      console.log("Error deleting contact: ", error);
    }

    props.toggle(false);
  };

  const handleCancelDelete = () => {
    props.toggle(false);
  };

  return (
    <StyledPromptWrapper>
      <StyledModalTitle>Are you sure deleting this contact?</StyledModalTitle>
      <StyledInfo>Name: {data?.contact_by_pk.first_name} {data?.contact_by_pk.last_name}</StyledInfo>
      <StyledPhoneWrapper>
        <StyledTitlePhoneWrapper>Phones:</StyledTitlePhoneWrapper>
        {
          data?.contact_by_pk.phones?.map((contact) => (
            <StyledPhoneList key={contact.number}>{contact.number}</StyledPhoneList>
          ))
        }
      </StyledPhoneWrapper>
      <StyledButtonWrapper>
        <StyledIconButtonWithName onClick={() => handleDeleteConfirmation()}>
          <Trash size="18" title="confirm-delete-button" />
          Delete
        </StyledIconButtonWithName>
        <StyledIconButtonWithName color='default' onClick={() => handleCancelDelete()}>
          <X size="18" title="cancel-delete-button" />
          Cancel
        </StyledIconButtonWithName>
      </StyledButtonWrapper>
    </StyledPromptWrapper>
  );
}

const StyledPromptWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  margin-bottom: 1.2rem;
`;

const StyledModalTitle = styled.h2`
  color: #ffffff;
`;

const StyledInfo = styled.p`
  color: #ffffff;
  margin: 0.2rem 0;
  text-align: left;
`;
const StyledPhoneWrapper = styled.ul`
  background-color: #ffffff;
  padding: 0.6rem 1rem;
  border-radius: 0.4rem;
  margin-top: 0.2rem;
  margin-bottom: 0.6rem;
  overflow-x: scroll;
`;
const StyledTitlePhoneWrapper = styled.li`
  font-weight: 600;
  list-style-type: none;
`;
const StyledPhoneList = styled.li`
  margin: 0.2rem 1.4rem;
`;
const StyledButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;
const StyledIconButtonWithName = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items:center;
  background-color: ${(props) => (props.color === 'default' ? '#5dadeb' : '#c23b21' )} ;
  border: none;
  border-radius: 0.4rem;
  padding: 0.4rem 0.5rem;
  gap: 0.4rem;
  font-size: 1rem;
  font-weight: 600;
`;