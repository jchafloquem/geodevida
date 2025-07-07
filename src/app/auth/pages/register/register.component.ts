import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { hasEmailError, isRequired } from '../../utils/validators';

import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';
import { GoogleButtomComponent } from '../../ui/google-buttom/google-buttom.component';
import { AuthService } from '../../access/auth.service';

@Component({
	selector: 'app-register',
	standalone: true,  // Obligatorio al usar imports
	imports: [ReactiveFormsModule, RouterLink, GoogleButtomComponent],
	templateUrl: './register.component.html',
})
export default class RegisterComponent {

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
	async submit() {
		if (this.form.invalid) return;
		try {
			const { email, password } = this.form.value;
			if (!email || !password) return;
			//console.log({ email, password });
			await this._authService.signUp({ email, password });
			toast.success('Usuario creado correctamente');
			this._router.navigateByUrl('/geovisor/map')
		} catch (error) {
			toast.error('Ocurrio un error');
		}
	}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async submitWithGoogle() {
		try {
			await this._authService.signInWithGoogle();
			toast.success('Ingreso con Google');
			this._router.navigateByUrl('/geovisor/map')
		} catch (error) {
			toast.error('Ocurrio un error');
		}
	}
}
