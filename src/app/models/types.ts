import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ContactsState, ContactsType } from './contacts.model';
import { TicketsState, TicketsType } from './tickets.model';
import { UserState } from './users.model';

export interface TableColumnsType<DataSourceType> {
  columnDef: string;
  header: string;
  cell: (el: DataSourceType) => string;
}

export type DataArrayPath = 'contacts' | 'users' | 'tickets';

export type DataSourceType = ContactsType | TicketsType;

export interface MenuType {
  badge: IconDefinition;
  name: string;
  link: string;
}

export interface TasksStatusType {
  unresolved: number;
  overdue: number;
  open: number;
  onHold: number;
}
export interface StatisticsType {
  label: string;
  data: number;
}
export interface TasksType {
  details: string;
  status: string;
  checked: boolean;
}
export interface TicketsStatType {
  type: string;
  quantity: number;
}

export interface ModalContentType {
  title: string;
  text: string;
  id: number;
}

export interface ApiEndpointLinks {
  loginLink: string;
  registrationLink: string;
  sendResetEmailLink: string;
  resetPasswordLink: string;
  usersEndpoint: string;
}

export interface DialogDataType {
  id: number;
  type: DialogType;
}

type DialogType = 'contacts' | 'tickets';

export interface AppState {
  user: UserState;
  contacts: ContactsState;
  tickets: TicketsState;
}
