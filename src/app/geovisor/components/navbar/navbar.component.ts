import {Component, inject} from '@angular/core';
import { GeovisorSharedService } from '../../services/geovisor.service';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
	public _geovisorSharedService = inject(GeovisorSharedService);
}
