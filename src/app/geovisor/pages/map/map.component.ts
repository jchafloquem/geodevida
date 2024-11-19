import {Component, OnInit, ViewChild, ElementRef, OnDestroy, inject} from '@angular/core';
import {GeovisorSharedService} from '../../services/geovisor.service';


//libreria de ArcGIS
@Component({
	selector: 'app-map',
	standalone: true,
	imports: [],
	templateUrl: './map.component.html',
	styleUrl: './map.component.scss',
})
export default class MapComponent implements OnInit, OnDestroy {

	@ViewChild('mapViewNode', {static: true}) private mapViewEl!: ElementRef;
	public _geovisorSharedService = inject(GeovisorSharedService);
	public toogle = false;

	ngOnInit(): void {
		this._geovisorSharedService.initializeMap(this.mapViewEl).then(() => {});
	}
	ngOnDestroy(): void {
		if (this._geovisorSharedService.view) {
			this._geovisorSharedService.view.destroy();
		}
	}
}
