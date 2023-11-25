export interface ContactsType {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  address: string;
  created: string;
  updated?: string;
}
export interface ContactsFormType {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  avatar: string | null;
}

export interface ContactsState {
  contacts: ContactsType[];
  loading: boolean;
  error: string | null;
}

export interface ContactFormDataType {
  contact: ContactsType;
  avatar: File | null;
}
