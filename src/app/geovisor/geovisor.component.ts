import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-geovisor',
    imports: [
        RouterModule,
				NgxSpinnerModule
    ],
    templateUrl: './geovisor.component.html',
    styles: ``
})
export default class GeovisorComponent implements OnInit {
	// eslint-disable-next-line no-unused-vars
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


