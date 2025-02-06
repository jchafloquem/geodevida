import {CommonModule, NgClass} from '@angular/common';
import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {GeovisorSharedService} from '../../services/geovisor.service';

// import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import {CapasComponent} from './components/capas/capas.component';
import {LeyendaComponent} from './components/leyenda/leyenda.component';
import { AcercaComponent } from './components/acerca/acerca.component';


@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, MatIconModule, NgClass, MatButtonModule, CapasComponent, LeyendaComponent, AcercaComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
	public _geovisorSharedService = inject(GeovisorSharedService);
	public subMenu: 'leyendas' | 'capas' | 'acerca' | 'logout' = 'capas';

	public toogleMenu = false;

	clickToogleMenu(filtro?: 'leyendas' | 'capas' | 'acerca' ): void {
		if (filtro == undefined) {
			this.toogleMenu = !this.toogleMenu;
		} else {
			if (this.subMenu == filtro) {
				this.subMenu = filtro;
				this.toogleMenu = !this.toogleMenu;
			} else {
				this.subMenu = filtro;
				this.toogleMenu = true;
			}
		}
	}
}
