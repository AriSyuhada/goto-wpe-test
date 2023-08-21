export interface QueryResponse {
  phone?: (PhoneItem)[] | null;
}
export interface PhoneItem {
  contact: ContactItem;
  number: string;
}
export interface ContactItem {
  last_name: string;
  first_name: string;
  id: number;
}
