import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import '@arcgis/map-components/dist/loader';
import { defineCustomElements } from '@arcgis/map-components/loader';


defineCustomElements(window); // ✅ Registro de los Web Components

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
