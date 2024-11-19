import {Component, inject} from '@angular/core';
import Basemap from '@arcgis/core/Basemap';
import {GeovisorSharedService} from '../../services/geovisor.service';

@Component({
	selector: 'app-fab-container-top',
	standalone: true,
	imports: [],
	templateUrl: './fab-container-top.component.html',
	styleUrl: './fab-container-top.component.scss',
})
export class FabContainerTopComponent {
	public _geovisorSharedService = inject(GeovisorSharedService);
	public mapaBaseView = true;
	mapabase(base: string): void {
		this._geovisorSharedService.mapa.basemap = Basemap.fromId(base);
	}
}
