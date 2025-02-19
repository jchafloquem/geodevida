import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
    imports: [RouterModule, NgxSpinnerModule],
    templateUrl: './auth.component.html',
    styles: ``
})
export default class AuthComponent implements OnInit {

	// eslint-disable-next-line no-unused-vars
	constructor(private spinner: NgxSpinnerService) {}
	ngOnInit(): void {
    // Muestra el spinner al iniciar el componente
    this.spinner.show();

    // Oculta el spinner después de 3 segundos
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

}
