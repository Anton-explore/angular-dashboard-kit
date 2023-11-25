import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const loginGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  return authService.user$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return true;
      }
      return createUrlTreeFromSnapshot(route, ['/', 'dashboard', 'overview']);
    })
  );
};
