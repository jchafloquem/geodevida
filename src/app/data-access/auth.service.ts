import { inject, Injectable } from '@angular/core';
import {
	Auth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	UserCredential,
} from '@angular/fire/auth';

export interface User {
	email: string,
	password: string
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private _auth = inject(Auth)

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		async signUp(user: User) {
			try {
				const userCredential = await createUserWithEmailAndPassword(
					this._auth,
					user.email,
					user.password
				);
				return userCredential;
			} catch (error) {
				console.error('Error en el registro:', error);
				throw error;
			}
		}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
		async signIn(user: User) {
			try {
				const userCredential = await signInWithEmailAndPassword(
					this._auth,
					user.email,
					user.password
				);
				return userCredential;
			} catch (error) {
				console.error('Error al ingreso:', error);
				throw error;
			}
		}


		async signInWithGoogle() : Promise<UserCredential | null> {
			try {
				const provider = new GoogleAuthProvider();
				//provider.setCustomParameters({prompt:'select-account'});
				const userCredential = await signInWithPopup(this._auth, provider);
				return userCredential;
			} catch (error) {
				console.error('Error en la autenticación con Google:', error);
				return null;
			}
		}
}
