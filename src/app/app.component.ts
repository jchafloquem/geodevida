import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GeoDEVIDADPM';
}
