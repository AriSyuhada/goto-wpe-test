export interface Contact {
  data: Data;
}
export interface Data {
  update_contact_by_pk: UpdateContactByPk;
}
export interface UpdateContactByPk {
  id: number;
  first_name: string;
  last_name: string;
  phones?: (PhonesEntity)[] | null;
}
export interface PhonesEntity {
  number: string;
}