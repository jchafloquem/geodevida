import {Component, inject} from '@angular/core';
import { RouterModule } from '@angular/router';
import { GeovisorSharedService } from '../../services/geovisor.service';


@Component({
    selector: 'app-navbar',
    imports: [RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
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
}
