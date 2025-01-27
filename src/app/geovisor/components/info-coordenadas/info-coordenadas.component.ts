import {Component, inject} from '@angular/core';
import {GeovisorSharedService} from '../../services/geovisor.service';

@Component({
    selector: 'app-info-coordenadas',
    imports: [],
    templateUrl: './info-coordenadas.component.html',
    styleUrl: './info-coordenadas.component.scss'
})
export class InfoCoordenadasComponent {
	public _geovisorSharedService = inject(GeovisorSharedService);

	constructor() {}
}
