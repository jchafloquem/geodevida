import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'auth',
		loadComponent: () => import('./auth/auth.component'),
		children: [
			{
				path: 'login',
				loadComponent: () => import('./auth/pages/login/login.component'),
			},
			{
				path: 'register',
				loadComponent: () => import('./auth/pages/register/register.component'),
			},
			{
				path: 'error',
				loadComponent: () => import('./auth/pages/error404/error404.component'),
			},
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full',
			},

		],
	},

	{
		path: 'geovisor',
		loadComponent: () => import('./geovisor/geovisor.component'),
		children: [
			{
				path: 'map',
				loadComponent: () => import('./geovisor/pages/map/map.component'),
			},
			{
				path: '',
				redirectTo: 'map',
				pathMatch: 'full',
			},
		],
	},
	{
		path: '',
		redirectTo: 'auth',
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: '/auth/error',
		pathMatch: 'full',
	},
];
