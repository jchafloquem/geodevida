import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import '@arcgis/map-components/dist/loader';
import { defineCustomElements } from '@arcgis/map-components/loader';


defineCustomElements(window); // ✅ Registro de los Web Components

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(),   // ✅ Agregar HttpClient aquí
  ],
}).catch((err) => console.error(err));
