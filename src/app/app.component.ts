import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, NgxSpinnerModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit  {
	constructor(private spinner: NgxSpinnerService) {}
	ngOnInit(): void {
    // Muestra el spinner al iniciar el componente
    this.spinner.show();

    // Oculta el spinner después de 3 segundos
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }
}
