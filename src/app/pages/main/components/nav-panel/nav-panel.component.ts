import { Component } from '@angular/core';

import {
  faChartPie,
  faTicket,
  faLightbulb,
  faUsers,
  faUserTie,
  faBook,
  faGear,
  faAward,
} from '@fortawesome/free-solid-svg-icons';

import { MenuType } from 'src/app/models/types';

@Component({
  selector: 'app-nav-panel',
  templateUrl: './nav-panel.component.html',
  styleUrls: ['./nav-panel.component.scss'],
})
export class NavPanelComponent {
  menu: MenuType[] = [
    {
      badge: faChartPie,
      name: 'Overview',
      link: 'overview',
    },
    {
      badge: faTicket,
      name: 'Tickets',
      link: 'tickets',
    },
    {
      badge: faLightbulb,
      name: 'Ideas',
      link: 'ideas',
    },
    {
      badge: faUsers,
      name: 'Contacts',
      link: 'contacts',
    },
    {
      badge: faUserTie,
      name: 'Agents',
      link: 'agents',
    },
    {
      badge: faBook,
      name: 'Articles',
      link: 'articles',
    },
  ];
  settings: MenuType[] = [
    {
      badge: faGear,
      name: 'Settings',
      link: 'settings',
    },
    {
      badge: faAward,
      name: 'Subscription',
      link: 'subscription',
    },
  ];
}
