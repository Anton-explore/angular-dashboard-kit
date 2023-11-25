import { Component } from '@angular/core';

import {
  StatisticsType,
  TasksStatusType,
  TasksType,
  TicketsStatType,
} from 'src/app/models/types';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  tasksStatus: TasksStatusType = {
    unresolved: 60,
    overdue: 16,
    open: 43,
    onHold: 64,
  };
  stats: StatisticsType[] = [
    {
      label: 'Received',
      data: 490,
    },
    {
      label: 'Resolved',
      data: 426,
    },
    {
      label: 'Average first response time',
      data: 33,
    },
    {
      label: 'Average response time',
      data: 188,
    },
    {
      label: 'Resolution within SLA',
      data: 94,
    },
  ];
  tickets: TicketsStatType[] = [
    {
      type: 'Waiting on Feature Request',
      quantity: 4724,
    },
    {
      type: 'Awaiting Customer Response',
      quantity: 1005,
    },
    {
      type: 'Awaiting Developer Fix',
      quantity: 914,
    },
    {
      type: 'Pending',
      quantity: 281,
    },
  ];
  tasks: TasksType[] = [
    {
      details: 'Finish ticket update',
      status: 'urgent',
      checked: false,
    },
    {
      details: 'Create new ticket example',
      status: 'new',
      checked: false,
    },
    {
      details: 'Update ticket report',
      status: 'default',
      checked: true,
    },
  ];
}
