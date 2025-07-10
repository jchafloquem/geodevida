import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStateService } from '../auth/shared/access/auth-state.service';
import { map, take, catchError } from "rxjs/operators";
import { of } from "rxjs";

export const privateGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authState = inject(AuthStateService);
    return authState.authState$.pipe(
      take(1),
      map(state => {
        if (!state) {
          router.navigateByUrl('auth/login');
          return false;
        }
        return true;
      }),
      catchError(() => {
        router.navigateByUrl('auth/login');
        return of(false);
      })
    );
  };
};

export const publicGuard = (): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authState = inject(AuthStateService);
    return authState.authState$.pipe(
      take(1),
      map(state => {
        if (state) {
          router.navigateByUrl('geovisor/map');
          return false;
        }
        return true;
      }),
      catchError(() => {
        // En caso de error, permitimos el acceso
        return of(true);
      })
    );
  };
};
