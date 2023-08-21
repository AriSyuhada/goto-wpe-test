export interface QueryResponse {
  contact?: (ContactItem)[] | null;
}
export interface ContactItem {
  created_at: string;
  first_name: string;
  id: number;
  last_name: string;
  phones?: (PhoneItem)[] | null;
}
export interface PhoneItem {
  number: string;
}
