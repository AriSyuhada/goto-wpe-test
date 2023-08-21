import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useQueryGetContactList } from '../../helper/gql/useQueryGetContactList';
import { 
  ContactItem 
} from '../../interface/Contact/IGetContactListInterface';
import {
  AddContactForm,
  DeleteContactPrompt,
  EditContactForm,
  ModalLayout,
  Pagination
} from '../';
import {
  Edit,
  Plus,
  SquarePhoneFlip,
  Star,
  Trash,
} from '@styled-icons/fa-solid';

export default function ContactList() {
  const { data, error, loading, refetch } = useQueryGetContactList();
  const [ contactList, setContactList ] = useState<ContactItem[]>([]);
  const [ contactTarget, setContactTarget ] = useState<number>(0);
  const [ currentContact, setCurrentContact ] = useState<ContactItem[]>([]);
  const [ currentPage, setCurrentPage ] = useState<number>(1);
  const [ favContact, setFavContact ] = useState<number[]>([]);
  const [ keyword, setKeyword ] = useState<string>('');
  const [ modalAddContactIsShow, toggleModalAddContact ] = useState<boolean>(false);
  const [ modalDeleteContactIsShow, toggleModalDeleteContact ] = useState<boolean>(false);
  const [ modalEditContactIsShow, toggleModalEditContact ] = useState<boolean>(false);
  const [ contactPerPage, setContactPerPage ] = useState<number>(5);
  const [ sortedContact, setSortedContact ] = useState<ContactItem[]>([]);

  const handleOnSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setContactPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleDeleteOnClick = (id: number) => {
    toggleModalDeleteContact(!modalDeleteContactIsShow);
    setContactTarget(id);
  };

  const handleEditOnClick = (id: number) => {
    toggleModalEditContact(!modalEditContactIsShow);
    setContactTarget(id);
  };

  const handleToggleFavorite = (id: number) => {
    if (favContact.includes(id)) {
      setFavContact((prevFavContact) => prevFavContact.filter(
        (contactId) => contactId !== id 
      ))
    } else {
      setFavContact((prevFavContact) => (
        [
          ...prevFavContact,
          id,
        ]
      ));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage !== Math.ceil(sortedContact.length / contactPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePaginate = (numbering: number) => {
    setCurrentPage(numbering);
  };

  useEffect(() => {
    const lastIndexPagination = currentPage * contactPerPage;
    const firstIndexPagination = lastIndexPagination - contactPerPage;
    setCurrentContact(sortedContact.slice(firstIndexPagination, lastIndexPagination));
  }, [currentPage, contactPerPage, sortedContact]);

  useEffect(() => {
    const favLocalContact = window.localStorage.getItem('FAV_CONTACT_LIST');
    if (favLocalContact !== undefined && favLocalContact !== null) {
      setFavContact(JSON.parse(favLocalContact));
    };
  }, []);

  useEffect(() => {
    const localContact = window.localStorage.getItem('CONTACT_LIST');
    if (localContact !== undefined && localContact !== null) {
      setContactList(JSON.parse(localContact));
    };
  }, []);

  useEffect(() => {
    if (data && data.contact) {
      const newContactData = data?.contact;
      const favContactThatExist = favContact.filter((fav) => 
        newContactData.some((contact) =>
          fav === contact.id
        )
      );
      window.localStorage.setItem('FAV_CONTACT_LIST', JSON.stringify(favContactThatExist));
    }
  }, [data, favContact]);

  useEffect(() => {
    if (data && data.contact) {
      const newContactData = JSON.stringify(data?.contact);
      if (newContactData !== JSON.stringify(contactList)) {
        setContactList(data?.contact);
        window.localStorage.setItem('CONTACT_LIST', newContactData);
      }
    }
  }, [data, contactList]);

  useEffect(() => {
    setSortedContact(() => {
      return [
        ...contactList.filter(
          (contact) => {
            return (favContact.includes(contact.id) && (
              contact.first_name.toLowerCase().includes(keyword.toLocaleLowerCase()) ||
              contact.last_name.toLowerCase().includes(keyword.toLocaleLowerCase())
            ))
          }
        ),
        ...contactList.filter(
          (contact) => {
            return (!favContact.includes(contact.id) && (
              contact.first_name.toLowerCase().includes(keyword.toLocaleLowerCase()) ||
              contact.last_name.toLowerCase().includes(keyword.toLocaleLowerCase())
            ))
          }
        ),
      ];
    });
  }, [favContact, contactList, keyword]);

  if (loading) {
    return (
      <StyledLog>
        Loading...
      </StyledLog>
    )
  }

  if (error) {
    return (
      <StyledLog>
        An error occurred
      </StyledLog>
    )
  }

  return (
    <StyledPageWrapper>
      <StyledHeader>
        <StyledLogo size="30" title="app-phone-book-logo" />
        <StyledTitle>Phone Book App</StyledTitle>
      </StyledHeader>
      <StyledContentWrapper>
        <StyledToolBar>
          <StyledSelectOption defaultValue={contactPerPage} name="contact-per-page" onChange={(event) => handleSelectChange(event)}>
            <option value={5} selected={contactPerPage === 5 ? true : false}>5</option>
            <option value={10} selected={contactPerPage === 10 ? true : false}>10</option>
            <option value={15} selected={contactPerPage === 15 ? true : false}>15</option>
          </StyledSelectOption>
          <StyledSearchBar type="text" onChange={(event) => handleOnSearch(event)} value={keyword} placeholder="Contact name..."/>
          <StyledIconButton color="primary" onClick={() => toggleModalAddContact(!modalAddContactIsShow)}>
            <Plus size="20" title="add-button" />
          </StyledIconButton>
        </StyledToolBar>
        <StyledContactList>
          {
            currentContact.filter((contact) => {
              return ( contact.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
                contact.last_name.toLowerCase().includes(keyword.toLocaleLowerCase()) )
            }).map((contact) => (
              <StyledContactWrapper key={contact.id}>
                <StyledProfileInfo>
                  <StyledUserImage src={require('../../../resources/images/man-' + (Math.ceil(Math.random()*2) + '.png'))} alt="user-image" />
                  <StyledUserName>{contact.first_name} {contact.last_name}</StyledUserName>
                </StyledProfileInfo>
                <StyledStar color={favContact.includes(contact.id) ? 'fav' : 'no-fav'} size="30" title={contact.first_name + "-fav"} onClick={() => handleToggleFavorite(contact.id)}>{ favContact.includes(contact.id) ? 'Remove from Favorite' : 'Add to Favorite' }</StyledStar>
                <StyledContactButtonWrapper>
                  <StyledIconButtonWithName onClick={() => handleEditOnClick(contact.id)}>
                    <Edit size="18" title={contact.first_name + '-edit'} />
                    <p style={{margin: 0}}>Edit</p>
                  </StyledIconButtonWithName>
                  <StyledIconButtonWithName color="danger" onClick={() => handleDeleteOnClick(contact.id)}>
                    <Trash size="18" title={contact.first_name + '-delete'} />
                    <p style={{margin: 0}}>Delete</p>
                  </StyledIconButtonWithName>
                </StyledContactButtonWrapper>
                <StyledPhoneWrapper>
                  <StyledTitlePhoneWrapper>
                    Phones:
                  </StyledTitlePhoneWrapper>
                  {
                    contact.phones?.map((phone) => (
                      <StyledPhoneList key={phone.number}>{phone.number}</StyledPhoneList>
                    ))
                  }
                </StyledPhoneWrapper>
                <StyledBreak />
              </StyledContactWrapper>
            ))
          }
        </StyledContactList>
        <StyledPaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalPost={sortedContact.length}
            contactPerPage={contactPerPage}
            handlePaginate={handlePaginate}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
          />
        </StyledPaginationWrapper>
      </StyledContentWrapper>
      { modalAddContactIsShow ? 
          <ModalLayout toggle={toggleModalAddContact}>
            <AddContactForm refetch={refetch} toggle={toggleModalAddContact} />
          </ModalLayout> 
        : 
          <></> 
      }
      {
        modalDeleteContactIsShow ?
          <ModalLayout toggle={toggleModalDeleteContact}>
            <DeleteContactPrompt refetch={refetch} toggle={toggleModalDeleteContact} contactId={contactTarget} />
          </ModalLayout>
        :
          <></>
      }
      {
        modalEditContactIsShow ?
          <ModalLayout toggle={toggleModalEditContact}>
            <EditContactForm refetch={refetch} toggle={toggleModalEditContact} contactId={contactTarget} />
          </ModalLayout>
        :
          <></>
      }
    </StyledPageWrapper>
  );
}

const StyledLog = styled.p`
  color: #ffffff;
  font-weight: 600;
  font-size: 1.2rem;
`;

const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;
const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  column-gap: 1rem;
  padding: 0.6rem;
`;
const StyledLogo = styled(SquarePhoneFlip)`
  color: #ffffff;
`;
const StyledTitle = styled.h1`
  color: #ffffff;
  font-weight: 900;
  font-size: 1.2rem;
`;

const StyledContentWrapper = styled.div`
  background-color: #202429;
  border-radius: 1.5rem 1.5rem 0 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: hidden;
`;
const StyledToolBar = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1.4rem 2rem;
  gap: 0.6rem;
  justify-content: center;
  height: 2rem;
  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: auto;
    gap: 1rem;
  }
`;
const StyledSelectOption = styled.select`
  border-radius: 0.4rem;
  padding: 0 0.2rem;
`;
const StyledSearchBar = styled.input`
  background-color: #ebebeb;
  border-radius: 0.4rem;
  border: none;
  flex-grow: 1;
  padding: 0 0.6rem;
  @media (min-width: 768px) {
    width: 50vh;
  }
`;
const StyledIconButton = styled.button`
  color: #2a2f35;
  background-color: ${(props) => (props.color === 'primary' ? '#5dadeb' : props.color === 'danger' ? '#c23b21' : '#ffd301')};
  padding: 0.2rem;
  border-radius: 0.4rem;
  border: none;
`;
const StyledIconButtonWithName = styled.div`
  display: flex;
  flex-direction: row;
  color: #000000;
  background-color: ${(props) => (props.color === 'primary' ? '#5dadeb' : props.color === 'danger' ? '#c23b21' : '#ffd301')};
  padding: 0.6rem;
  border-radius: 0.4rem;
  border: none;
  gap: 0.6rem;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  min-width: 6rem;
`;


const StyledContactList = styled.div`
  background-color: #2a2f35;
  padding: 1.4rem 2rem;
  border-radius: 1.5rem 1.5rem 0 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
  }
`;
const StyledContactWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    border-radius: 0.8rem;
    width: 45%;
    box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
    border: 0.5px solid rgba(0,0,0,0.75);
    padding: 0.4rem;
  }
  @media (min-width: 1150px) {
    width: 30%;
    padding: 0.8rem;
    justify-content: center;
  }
`;
const StyledStar = styled(Star)`
  position: absolute;
  top: 1rem;
  right: 0.5rem;
  color: ${(props) => (props.color === 'fav' ? '#FFD700' : '#ababab')};
  @media (min-width: 768px) {
    top: 1.2rem;
    right: 1rem;
  }
`;
const StyledProfileInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.4rem 0;
  @media (min-width: 768px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;
const StyledUserImage = styled.img`
  width: 4rem;
  height: 4rem;
`;
const StyledUserName = styled.p`
  color: #ffffff;
  font-size: 1rem;
  margin: 0 0.8rem;
  text-align: center;
  font-weight: 700;
  max-width: 11rem;
`;
const StyledContactButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0.6rem 0;
`;
const StyledPhoneWrapper = styled.ul`
  background-color: #ffffff;
  padding: 0.6rem 1rem;
  border-radius: 0.4rem;
  margin: 0.2rem 0;
  overflow-x: scroll;
  @media (min-width: 768px) {
    margin-left: 1rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
`;
const StyledTitlePhoneWrapper = styled.li`
  font-weight: 600;
  list-style-type: none;
`;
const StyledPhoneList = styled.li`
  margin: 0.2rem 1.4rem;
`;
const StyledBreak = styled.hr`
  border: 1px solid #ffffff;
  margin-top: 1.2rem;
  @media (min-width: 768px) {
    display: none;
  }
`;

const StyledPaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  @media (min-width: 768px) {
    width: 70vh;
    margin-left: auto;
    margin-right: auto;
  }
`;

