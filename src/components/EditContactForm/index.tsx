import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useMutationEditContact } from '../../helper/gql/useMutationEditContact';
import { useMutationEditPhoneNumber } from '../../helper/gql/useMutationEditPhoneNumber';
import { useQueryGetContactDetail } from '../../helper/gql/useQueryGetContactDetail';
import {
  Plus,
  FloppyDisk,
} from '@styled-icons/fa-solid';
import { useMutationAddNumberToContact } from '../../helper/gql/useMutationAddNumberToContact';
import { useLazyQueryGetContactList } from '../../helper/gql/useLazyQueryGetContactList';
import { useLazyQueryGetPhoneList } from '../../helper/gql/useLazyQueryGetPhoneList';

interface Phone {
  number: string
}

interface PropsInterface {
  refetch: () => void,
  toggle: (isShow: boolean) => void,
  contactId: number
}

export default function EditContactForm(props: PropsInterface) {
  const { data, error, loading } = useQueryGetContactDetail(props.contactId);
  const [ editContact ] = useMutationEditContact();
  const [ editPhone ] = useMutationEditPhoneNumber();
  const [ AddNumberToContact ] = useMutationAddNumberToContact();
  const [ getContactList, {data: dataContact} ] = useLazyQueryGetContactList();
  const [ getPhoneList ] = useLazyQueryGetPhoneList();
  const [countPhone, setCountPhone] = useState<number>(1);
  const [phoneInput, setPhoneInput] = useState<React.ReactNode>([]);
  const [contactPhones, setContactPhones] = useState<Phone[]>([]);
  const [oldContactPhones, setOldContactPhones] = useState<Phone[]>([]);
  const [validation, setValidation] = useState({
    name: true,
    phones: true,
    regex: true,
  });
  const [contactFormInfo, setContactFormInfo] = useState({
    'fname': '',
    'lname': '',
  });

  useEffect(() => {
    if (data && data.contact_by_pk) {
      const contactData = data?.contact_by_pk;
      setContactPhones(contactData?.phones || []);
      setOldContactPhones(contactData?.phones || []);
      setContactFormInfo({
        'fname': contactData.first_name,
        'lname': contactData.last_name
      });
      setCountPhone(contactData.phones?.length || 1)
    }
  }, [data, loading]);

  useEffect(() => {
    const tempArr = []
    if (data && data.contact_by_pk) {
      for (let i = 0; i < countPhone; i ++) {
        tempArr.push(
          <StyledPhoneInputWrapper key={'phone-'+i}>
            <StyledPhoneFormWrapper action="" method="POST" onSubmit={(event) => handleOnSubmitPhones(event)}>
              <StyledInputPhoneText id={'input-phone-'+i} type="text" name="phones" value={contactPhones[i]?.number || ''} onChange={(event) => handleOnChangePhone(event)} placeholder="Phone Number" />
              <StyledSaveInputButton type="submit" >
                <FloppyDisk size="14" title={'input-phone-'+i+'-save'} />
              </StyledSaveInputButton>
              <input type="hidden" name="index" value={i} />
              { i !== 0 ? <StyledRemoveInputButton onClick={(event) => handleDecraseCountPhone(event)}>-</StyledRemoveInputButton> : <></> }
            </StyledPhoneFormWrapper>
          </StyledPhoneInputWrapper>
        );
      }
    }
    setPhoneInput(tempArr);
  }, [data, countPhone, contactPhones]);

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

  const handleOnSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const validStatus = {
      name: true,
      regex: true
    };

    const unvalidatedData = {
      fname: contactFormInfo.fname,
      lname: contactFormInfo.lname,
    };
    const regex = /^[a-zA-Z0-9\s]*$/;
    const isFnameValid = regex.test(unvalidatedData.fname);
    const isLnameValid = regex.test(unvalidatedData.lname);
    if (!isFnameValid || !isLnameValid) {
      validStatus.regex = false;
    };

    getContactList({
      variables: {
        where: {
          first_name: {
            _like: `${unvalidatedData.fname}`,
          },
          last_name: {
            _like: `${unvalidatedData.lname}`,
          }
        },
      }
    });
    if (dataContact?.contact?.length) {
      validStatus.name = false;
    }

    if (validStatus.name && validStatus.regex) {
      try {
        const { data } = await editContact({
          variables: {
            id: props.contactId,
            _set: {
              first_name: contactFormInfo.fname,
              last_name: contactFormInfo.lname,
            }
          },
          onCompleted: () => {props.refetch()},
        });
        console.log("Contact updated: ", data.addContactsWithPhones);
      } catch (error) {
        console.log("Error updating contact: ", error);
      }
    } else {
      return setValidation({
        ...validation,
        ...validStatus
      });
    }
  };

  const handleOnSubmitPhones = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetInput = e.currentTarget as typeof e.currentTarget & {
      index: {value: number}
    };
    const index = targetInput.index.value;
    const validStatus = {
      phones: true,
    };

    const promises = contactPhones.flatMap(async (phone) => {
      const { data } = await getPhoneList({
        variables: {
          where: {
            number: {
              _like: `${phone.number}`,
            }
          },
        },
      });
      return data?.phone;
    });

    const existedPhones = (await Promise.all(promises)).flatMap((value) => value);
    if (existedPhones) {
      validStatus.phones = false;
    }

    if (validStatus.phones) {
      if (index >= oldContactPhones.length) {
        try {
          const { data } = await AddNumberToContact({
            variables: {
              contact_id: props.contactId,
              phone_number: contactPhones[index].number,
            },
            onCompleted: () => {props.refetch()},
          });
          console.log("Number added to contact: ", data.insert_phone);
        } catch (error) {
          console.log("Error adding number to contact: ", error);
        }
      } else {
        try {
          const { data } = await editPhone({
            variables: {
              pk_columns: {
                  number: oldContactPhones[index].number,
                  contact_id: props.contactId,
              },
              new_phone_number: contactPhones[index].number,
            },
            onCompleted: () => {props.refetch()},
          });
          console.log("Phone updated: ", data.addContactsWithPhones);
        } catch (error) {
          console.log("Error updating phone: ", error);
        }
      }
    } else {
      return setValidation({
        ...validation,
        ...validStatus,
      });
    }
  }

  const handleOnChangePhone = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const phoneInputs = document.getElementsByName("phones");
    const newContactPhones = [];
    for (let i = 0; i < phoneInputs.length; i++) {
      const tempElements = phoneInputs[i] as HTMLInputElement;
      newContactPhones.push({
        number: tempElements.value, 
      });
    }
    setContactPhones(newContactPhones)
  };

  const handleOnChangeForm = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setContactFormInfo({
      ...contactFormInfo,
      [name]: value,
    });
  }

  const handleIncreaseCountPhone = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCountPhone((prevCountPhone) =>  prevCountPhone + 1);
  }

  const handleDecraseCountPhone = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCountPhone((prevCountPhone) =>  prevCountPhone - 1);
  }

  if (data?.contact_by_pk === null) {
    return (
      <>
        <p>The Contact you want to edit is cant be found on the server</p>
      </>
    )
  }

  return (
    <StyledEditFormWrapper>
      <StyledForm action="" method="POST" onSubmit={(event) => handleOnSubmitContact(event)}>
        <StyledModalTitle>Edit Contact</StyledModalTitle>
        { !validation.name ? <StyledWarning>*Both first name and last name combined must be unique</StyledWarning> : <></> }
        { !validation.phones ? <StyledWarning>*Your phone number is the same as the old version, or it's the duplicate of others phone number</StyledWarning> : <></> }
        { !validation.regex ? <StyledWarning>*Input value can't contain special character</StyledWarning> : <></> }
        <StyledLabelInput className="required" htmlFor="fname">First Name<StyledRequiredNote>*</StyledRequiredNote></StyledLabelInput>
        <StyledInputText id='input-fname' type="text" name="fname" value={contactFormInfo.fname} onChange={(event) => handleOnChangeForm(event)} placeholder="First Name" />
        {/* { !validation.fname ? <p>Contact name must be unique, you can change the first name</p> : <></> } */}
        <StyledLabelInput className="required" htmlFor="lname">Last Name<StyledRequiredNote>*</StyledRequiredNote></StyledLabelInput>
        <StyledInputText id='input-lname' type="text" name="lname" value={contactFormInfo.lname} onChange={(event) => handleOnChangeForm(event)} placeholder="Last Name" />
        {/* { !validation.lname ? <p>Contact name must be unique, you can change the last name</p> : <></> } */}
        <StyledIconButtonWithName color='default' type="submit" value="Save Contact Info">
          <FloppyDisk size="18" title="save-contact-button" />
          <p style={{margin: 0}}>Contact info</p>
        </StyledIconButtonWithName>
      </StyledForm>
      <StyledLabelInput className="required" htmlFor="fname">Phones<StyledRequiredNote>*</StyledRequiredNote></StyledLabelInput>
      {phoneInput}
      {/* { !validation.phones ? <p>One of the numbers are duplicate from other contacts, please provide unique phone number</p> : <></> } */}
      <StyledIconButtonWithName onClick={(event) => handleIncreaseCountPhone(event)}>
        <Plus size="18" title="add-more-phone-button" />
        More phone
      </StyledIconButtonWithName>
    </StyledEditFormWrapper>
  );
}

const StyledEditFormWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
`;

const StyledModalTitle = styled.h2`
  color: #ffffff;
`;

const StyledWarning = styled.p`
  margin: 0.4rem 0;
  color: #c23b21;
  font-weight: 600;
`;

const StyledLabelInput = styled.label`
  color: #ffffff;
  font-weight: 600;
`;

const StyledRequiredNote = styled.span`
  color: #c23b21;
`;

const StyledInputText = styled.input`
  background-color: #ebebeb;
  border-radius: 0.4rem;
  border: none;
  flex-grow: 1;
  padding: 0.4rem 0.6rem;
  margin-bottom: 1.2rem;
`;

const StyledPhoneInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const StyledPhoneFormWrapper = styled.form`
  display: flex;
  flex-direction: row;
`;

const StyledInputPhoneText = styled.input`
  background-color: #ebebeb;
  border-radius: 0.4rem;
  border: none;
  width: 70%;
  padding: 0.4rem 0.6rem;
`;

const StyledRemoveInputButton = styled.button`
  background-color: #c23b21;
  border-radius: 0.4rem;
  border: none;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  margin-left: 0.4rem;
  align-items: center;
  justify-content: center
`;

const StyledSaveInputButton = styled.button`
  background-color: #5dadeb;
  border-radius: 0.4rem;
  border: none;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  margin-left: 0.4rem;
  align-items: center;
  justify-content: center
`;

const StyledIconButtonWithName = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items:center;
  background-color: ${(props) => (props.color === 'default' ? '#5dadeb' : '#28cc2d' )} ;
  border: none;
  border-radius: 0.4rem;
  padding: 0.4rem 0.5rem;
  gap: 0.4rem;
  font-size: 1rem;
  font-weight: 600;
`;