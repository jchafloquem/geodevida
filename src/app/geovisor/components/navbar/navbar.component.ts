import {Component, inject} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GeovisorSharedService } from '../../services/geovisor.service';
import { AuthStateService } from '../../../auth/shared/access/auth-state.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
	private _authState = inject(AuthStateService);
	private _router = inject(Router);

	public _geovisorSharedService = inject(GeovisorSharedService);

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async logout() {
		await this._authState.logout();
		this._router.navigateByUrl('auth/welcome')
	}
}
