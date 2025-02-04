import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSpinnerModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export default class WelcomeComponent implements OnInit {

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

	constructor(private spinner: NgxSpinnerService) {}
	ngOnInit(): void {
    // Muestra el spinner al iniciar el componente
    this.spinner.show();

    // Oculta el spinner después de 3 segundos
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }
}
