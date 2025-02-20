import { Component, output } from '@angular/core';

@Component({
  selector: 'app-google-buttom',
  imports: [],
  templateUrl: './google-buttom.component.html',

})
export class GoogleButtomComponent {
		public onClick = output<void>();
}
