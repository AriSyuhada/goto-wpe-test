import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useMutationAddContactWithPhones } from '../../helper/gql/useMutationAddContactWithPhones';
import {
  Plus,
  FloppyDisk,
} from '@styled-icons/fa-solid';
import { useLazyQueryGetContactList } from '../../helper/gql/useLazyQueryGetContactList';
import { useLazyQueryGetPhoneList } from '../../helper/gql/useLazyQueryGetPhoneList';

interface Phone {
  number: string
}

interface PropsInterface {
  // setContact: (Dispatch<SetStateAction<ContactItem[]>>),
  refetch: () => void,
  toggle: (isShow: boolean) => void,
}

export default function AddContactForm(props: PropsInterface) {
  const [ addContactsWithPhones, { loading }] = useMutationAddContactWithPhones();
  const [ getContactList ] = useLazyQueryGetContactList();
  const [ getPhoneList ] = useLazyQueryGetPhoneList();
  const [countPhone, setCountPhone] = useState<number>(1);
  const [phoneInput, setPhoneInput] = useState<React.ReactNode>([]);
  const [contactPhones, setContactPhones] = useState<Phone[]>([]);
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
    const tempArr = []
    for (let i = 0; i < countPhone; i ++) {
      tempArr.push(
        <StyledPhoneInputWrapper key={'phone-'+i}>
          <StyledInputPhoneText id={'input-phone-'+i} type="text" name="phones" onChange={(event) => handleOnChangePhone(event)} placeholder="Phone Number" />
          { i !== 0 ? <StyledRemoveInputButton onClick={(event) => handleDecraseCountPhone(event)}>-</StyledRemoveInputButton> : <></> }
        </StyledPhoneInputWrapper>
      );
    }
    setPhoneInput(tempArr);
  }, [countPhone]);

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validStatus = {
      name: true,
      phones: true,
      regex: true
    };

    const unvalidatedData = {
      fname: contactFormInfo.fname,
      lname: contactFormInfo.lname,
      phones: contactPhones
    };
    const regex = /^[a-zA-Z0-9\s]*$/;
    const isFnameValid = regex.test(unvalidatedData.fname);
    const isLnameValid = regex.test(unvalidatedData.lname);
    if (!isFnameValid || !isLnameValid) {
      validStatus.regex = false;
    };

    const {data: responseContact} = await getContactList({
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

    if (responseContact?.contact?.length !== 0) {
      validStatus.name = false;
    }

    const promisesPhones = contactPhones.flatMap(async (phone) => {
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

    const existedPhones = (await Promise.all(promisesPhones)).flatMap((value) => value);
    if (existedPhones.length !== 0) {
      validStatus.phones = false;
    }

    if (validStatus.name && validStatus.phones && validStatus.regex) {
      try {
        const { data } = await addContactsWithPhones({
          variables: {
            first_name: contactFormInfo.fname,
            last_name: contactFormInfo.lname,
            phones: contactPhones
          },
          onCompleted: () => {props.refetch()},
        });
        if (loading) console.log('loading sek gan');
        console.log("New contact added: ", data.insert_contact);
      } catch (error) {
        console.log("Error adding contact: ", error);
      }
      props.toggle(false);
    } else {
      return setValidation(validStatus);
    }
  };

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

  return (
    <>
      <StyledForm action="" method="POST" onSubmit={(event) => handleOnSubmit(event)}>
        <StyledModalTitle>Add New Contact</StyledModalTitle>
        { !validation.name ? <StyledWarning>*Both first name and last name combined must be unique</StyledWarning> : <></> }
        { !validation.phones ? <StyledWarning>*One of the numbers are duplicate from other contacts, please provide unique phone number</StyledWarning> : <></> }
        { !validation.regex ? <StyledWarning>*Input value can't contain special character</StyledWarning> : <></> }
        <StyledLabelInput className="required" htmlFor="fname">First Name<StyledRequiredNote>*</StyledRequiredNote></StyledLabelInput>
        <StyledInputText id='input-fname' type="text" name="fname" onChange={(event) => handleOnChangeForm(event)} placeholder="First Name" />
        
        <StyledLabelInput className="required" htmlFor="lname">Last Name<StyledRequiredNote>*</StyledRequiredNote></StyledLabelInput>
        <StyledInputText id='input-lname' type="text" name="lname" onChange={(event) => handleOnChangeForm(event)} placeholder="Last Name" />
        
        <StyledLabelInput className="required" htmlFor="phones">Phones<StyledRequiredNote>*</StyledRequiredNote></StyledLabelInput>
        {phoneInput}
        
        <StyledButtonWrapper>
          <StyledIconButtonWithName color='green' onClick={(event) => handleIncreaseCountPhone(event)}>
            <Plus size="18" title="add-more-phone-button" />
            <p style={{margin: 0}}>More phone</p>
          </StyledIconButtonWithName>
          <StyledIconButtonWithName color='default' type="submit" value="Submit">
            <FloppyDisk size="18" title="save-contact-button" />
            <p style={{margin: 0}}>Save</p>
          </StyledIconButtonWithName>
        </StyledButtonWrapper>
      </StyledForm>
    </>
  );
}

const StyledForm = styled.form`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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

const StyledInputPhoneText = styled.input`
  background-color: #ebebeb;
  border-radius: 0.4rem;
  border: none;
  width: 100vw;
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
  background-color: ${(props) => (props.color === 'default' ? '#5dadeb' : '#28cc2d' )} ;
  border: none;
  border-radius: 0.4rem;
  padding: 0.4rem 0.5rem;
  gap: 0.4rem;
  font-size: 1rem;
  font-weight: 600;
`;