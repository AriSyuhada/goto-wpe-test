export interface QueryResponse {
  contact_by_pk: ContactByPk;
}
export interface ContactByPk {
  last_name: string;
  id: number;
  first_name: string;
  created_at: string;
  phones?: (PhoneItem)[] | null;
}
export interface PhoneItem {
  number: string;
}
