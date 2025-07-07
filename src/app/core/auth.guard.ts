import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStateService } from '../auth/shared/access/auth-state.service';
import { map, take, catchError, of } from "rxjs";

export const privateGuard = (): CanActivateFn => {
	return () => {
		const router = inject(Router);
		const authState = inject(AuthStateService);
		return authState.authState$.pipe(
			map(state => {
				if(!state){
					router.navigateByUrl('auth/login');
					return false;
				}
				return true;
			})
		)
	}
}

export const publicGuard = (): CanActivateFn => {
	return () => {
		const router = inject(Router);
		const authState = inject(AuthStateService);
		return authState.authState$.pipe(
			map(state => {
				if(state){
					router.navigateByUrl('geovisor/map');
					return false;
				}
       
				return true;
			})
		)
	}
}
