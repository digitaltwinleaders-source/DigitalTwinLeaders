import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait for auth state to resolve before making a decision
  return toObservable(auth.authLoading).pipe(
    filter(loading => !loading),
    take(1),
    map(() => {
      if (auth.isAdmin()) return true;
      router.navigate(['/admin/login']);
      return false;
    })
  );
};