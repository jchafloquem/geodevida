import { inject, Injectable } from '@angular/core';
import { Auth, authState, signOut, User } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';
import { Usuario } from '../../interface/usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private _auth = inject(Auth);



  // Emitimos un Usuario propio (nombre, email, foto, uid)
  public get authState$(): Observable<Usuario | null> {
    return authState(this._auth).pipe(
      map((user: User | null) => {
        if (!user) return null;
        return {
          nombre: user.displayName ?? '',
          email: user.email ?? '',
          foto: user.photoURL ?? '',
          uid: user.uid
        } as Usuario;
      })
    );
  }

  logout() {
    return signOut(this._auth);
  }
}
