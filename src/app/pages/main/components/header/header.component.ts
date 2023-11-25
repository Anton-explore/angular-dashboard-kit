import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, of, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/models/types';
import { logout } from 'src/app/shared/store/users/users.actions';
import { selectUser } from 'src/app/shared/store/selectors';

import {
  faArrowRightFromBracket,
  faBell,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchIcon = faMagnifyingGlass;
  logoutIcon = faArrowRightFromBracket;
  bellIcon = faBell;
  pageTitle = 'Overview';
  notification = true;
  user$ = this.store.select(selectUser);
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.showPageTitle();
  }

  private showPageTitle() {
    this.router.events
      .pipe(
        filter(event => {
          // const event = e?.routerEvent || e;
          return event instanceof NavigationEnd;
        }),
        switchMap(() => {
          const urlParam = window.location.pathname.split('/').pop();
          const title = urlParam?.replace(/^\w/, char => char.toUpperCase());
          return title === 'Not-found' ? of('Page is not found') : of(title);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((param): void => {
        if (param) {
          this.pageTitle = param;
        }
      });
  }

  logout() {
    this.store.dispatch(logout());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
