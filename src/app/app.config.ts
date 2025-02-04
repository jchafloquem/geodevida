import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({eventCoalescing: true}),
		provideRouter(routes),
		provideAnimations(),
		provideAnimationsAsync(),
		importProvidersFrom(NgxSpinnerModule.forRoot()),
		importProvidersFrom(BrowserAnimationsModule)
	],
};
