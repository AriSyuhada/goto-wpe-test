export interface QueryResponse {
  delete_contact_by_pk: DeletedContact;
}
export interface DeletedContact {
  first_name: string;
  last_name: string;
  id: number;
}
