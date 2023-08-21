import { useLazyQuery } from "@apollo/client";
import { useQueryGetContactList } from "../gql/useQueryGetContactList";
import { GET_PHONE_LIST, useQueryGetPhoneList } from "../gql/useQueryGetPhoneList";

interface Phone {
  number: string,
}

interface PropsInterface {
  fname: string,
  lname: string,
  phones: Phone[],
}

export default function useValidateFormContact(unvalidatedData: PropsInterface) {
  const validationStatus = {
    nameUnique: true,
    phonesUnique: true,
  };

  const { data: contactData } = useQueryGetContactList(unvalidatedData.fname, unvalidatedData.lname);
  const [fetchPhone, { data: phoneData }] = useLazyQuery(GET_PHONE_LIST);

  if (contactData?.contact?.length !== 0) {
    validationStatus.nameUnique = false;
  }

  unvalidatedData.phones.forEach((phone) => {
    fetchPhone({
      variables: {
        number: {
          _like: `%${phone.number}%`
        }
      }
    });
    if (phoneData?.phone?.length !== 0) {
      validationStatus.phonesUnique = false;
    }
  });

  return validationStatus;
}