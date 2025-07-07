import { inject, Injectable } from '@angular/core';
import { Auth, authState, signOut  } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

	private _auth = inject(Auth);

	public get authState$(): Observable<any> {
		return authState(this._auth);
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	logout() {
		return signOut(this._auth);
	}
}
