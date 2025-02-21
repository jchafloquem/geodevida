import {Component, inject} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GeovisorSharedService } from '../../services/geovisor.service';
import { AuthStateService } from '../../../auth/shared/data-access/auth-state.service';


@Component({
    selector: 'app-navbar',
    imports: [RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
	private _authState = inject(AuthStateService);
	private _router = inject(Router);
	public botones = [
    { link: '/geovisor',
			icono: 'assets/images/welcome/geoico1.png',
			alt: 'Ícono de acceso al visor GIS',
			label: 'Ingresar al Geovisor',
			texto: 'VISOR'
		},
    { link: '/geovisor/repositorio',
			icono: 'assets/images/welcome/geoico2.png',
			alt: 'Ícono de acceso al visor GIS',
			label: 'Ingresar al Documentacion',
			texto: 'REPOSITORIO'
		},
    { link: '/geovisor/dashboard',
			icono: 'assets/images/welcome/geoico3.png',
			alt: 'Ícono de acceso al visor GIS',
			label: 'Ingresar al Geovisor',
			texto: 'DASHBOARD'
		},
    { link: '/geovisor/metadata',
			icono: 'assets/images/welcome/geoico4.png',
			alt: 'Ícono de acceso al visor GIS',
			label: 'Ingresar al Geovisor',
			texto: 'METADATA'
		}
  ];
	public _geovisorSharedService = inject(GeovisorSharedService);

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async logout() {
		await this._authState.logout();
		this._router.navigateByUrl('auth/welcome')
	}
}
