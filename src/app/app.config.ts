import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import { NgxSpinnerModule } from "ngx-spinner";

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({eventCoalescing: true}),
		provideRouter(routes),
		provideAnimations(),
		provideAnimationsAsync(),
		importProvidersFrom(NgxSpinnerModule.forRoot()),
		importProvidersFrom(BrowserAnimationsModule),
		provideFirebaseApp(() => initializeApp({
			projectId: "ngdevida",
			appId: "1:1039107490113:web:6b6fa1a652c7121f66e1c0",
			storageBucket: "ngdevida.firebasestorage.app",
			apiKey: "AIzaSyBQVrxd4_Lc33kFQszVxpZDtqChzeWLeHM",
			authDomain: "ngdevida.firebaseapp.com",
			messagingSenderId: "1039107490113" })),
		provideAuth(() => getAuth()), provideAnimationsAsync()
	],
};
