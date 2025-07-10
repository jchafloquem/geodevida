import {Component, OnInit, ViewChild, ElementRef, OnDestroy, inject} from '@angular/core';
import { CommonModule } from '@angular/common';


import {GeovisorSharedService} from '../../services/geovisor.service';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FabContainerTopComponent } from '../../components/fab-container-top/fab-container-top.component';
import { InfoCoordenadasComponent } from '../../components/info-coordenadas/info-coordenadas.component';

import { Usuario } from '../../../auth/interface/usuario';
import { AuthStateService } from '../../../auth/shared/access/auth-state.service';



//libreria de ArcGIS
@Component({
    selector: 'app-map',
    imports: [RouterModule,
							NavbarComponent,
							SidebarComponent,
							FabContainerTopComponent,
							InfoCoordenadasComponent,
              CommonModule

						],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss'
})


export class MapComponent implements OnInit, OnDestroy {

  private _authStateService = inject(AuthStateService);
  public _geovisorSharedService = inject(GeovisorSharedService);

  public usuario: Usuario | null = null;
  public tiempoSesion = ''; // ⏱ Texto a mostrar
  private sesionInicio!: number;
  private intervaloSesion!: ReturnType<typeof setInterval>;
  public toogle = false;

	@ViewChild('mapViewNode', {static: true}) private mapViewEl!: ElementRef;

	ngOnInit(): void {
		this._geovisorSharedService.initializeMap(this.mapViewEl).then(() => {});
    this._authStateService.authState$.subscribe(user => {
      this._authStateService.authState$.subscribe(user => {
        if (user) {
          this.usuario = user;
          this.sesionInicio = Date.now();

          this.intervaloSesion = setInterval(() => {
            const ahora = Date.now();
            const segundos = Math.floor((ahora - this.sesionInicio) / 1000);
            const minutos = Math.floor(segundos / 60);
            const horas = Math.floor(minutos / 60);

            const h = horas.toString().padStart(2, '0');
            const m = (minutos % 60).toString().padStart(2, '0');
            const s = (segundos % 60).toString().padStart(2, '0');

            this.tiempoSesion = `${h}:${m}:${s}`;
          }, 1000);
        }
      });

    });
	}

	ngOnDestroy(): void {
		if (this._geovisorSharedService.view) {
			this._geovisorSharedService.view.destroy();
		}
    clearInterval(this.intervaloSesion);
	}
}
