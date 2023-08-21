export interface QueryResponse {
  insert_contact: AddedContact;
}
export interface AddedContact {
  returning?: (ReturningItem)[] | null;
}
export interface ReturningItem {
  first_name: string;
  last_name: string;
  id: number;
  phones?: (PhoneItem)[] | null;
}
export interface PhoneItem {
  number: string;
}
