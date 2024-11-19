import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FabContainerTopComponent } from './components/fab-container-top/fab-container-top.component';
import { InfoCoordenadasComponent } from './components/info-coordenadas/info-coordenadas.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@Component({
	selector: 'app-geovisor',
	standalone: true,
	imports: [
		RouterModule,
		NavbarComponent,
		SidebarComponent,
		FabContainerTopComponent,
		InfoCoordenadasComponent,
	],
	templateUrl: './geovisor.component.html',
	styles:	``,
})
export default class GeovisorComponent {}
