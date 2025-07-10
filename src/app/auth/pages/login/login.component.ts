import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { hasEmailError, isRequired } from '../../utils/validators';
import { toast } from 'ngx-sonner';
import { GoogleButtomComponent } from '../../ui/google-buttom/google-buttom.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../access/auth.service';

@Component({
    imports: [CommonModule, RouterModule, ReactiveFormsModule, GoogleButtomComponent],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
	private _formBuilder = inject(FormBuilder);
	private _authService = inject(AuthService);
	private _router = inject(Router);

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	isRequired(field: 'email' | 'password') {
		return isRequired(field, this.form);
	}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	hasEmailError() {
		return hasEmailError(this.form);
	}

	public form = this._formBuilder.nonNullable.group({
		email: this._formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
		password: this._formBuilder.nonNullable.control('', [Validators.required])
	});
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async submit(): Promise<void> {
    if (this.form.invalid) return;
    try {
      const { email, password } = this.form.value;
      if (!email || !password) return;

      await this._authService.signIn({ email, password });
      toast.success('Usuario ingresado');

      const redirectUrl = localStorage.getItem('redirectUrl') || '/geovisor/map';
      localStorage.removeItem('redirectUrl');
      this._router.navigateByUrl(redirectUrl);

    } catch (error) {
      toast.error('Ocurrió un error');
    }
  }

  async submitWithGoogle(): Promise<void> {
    try {
      await this._authService.signInWithGoogle();
      toast.success('Ingreso con cuenta de Google');

      const redirectUrl = localStorage.getItem('redirectUrl') || '/geovisor/map';
      localStorage.removeItem('redirectUrl');
      this._router.navigateByUrl(redirectUrl);

    } catch (error) {
      toast.error('Ocurrió un error');
    }
  }

}
