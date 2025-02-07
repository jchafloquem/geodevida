import {Component, OnInit, ViewChild, ElementRef, OnDestroy, inject} from '@angular/core';

import {GeovisorSharedService} from '../../services/geovisor.service';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FabContainerTopComponent } from '../../components/fab-container-top/fab-container-top.component';
import { InfoCoordenadasComponent } from '../../components/info-coordenadas/info-coordenadas.component';

//libreria de ArcGIS
@Component({
    selector: 'app-map',
    imports: [RouterModule,
							NavbarComponent,
							SidebarComponent,
							FabContainerTopComponent,
							InfoCoordenadasComponent,

						],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss'
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
