import { Routes } from '@angular/router';

export default [
			{
				path: 'map',
				loadComponent: () => import('./pages/map/map.component'),
			},
			{
				path: 'repositorio',
				loadComponent: () => import('./pages/repositorio/repositorio.component'),
			},
			{
				path: 'dashboard',
				loadComponent: () => import('./pages/dashboard/dashboard.component'),
			},
			{
				path: 'metadata',
				loadComponent: () => import('./pages/metadata/metadata.component'),
			},
			{
				path: '',
				redirectTo: 'map',
				pathMatch: 'full',
			},
] as Routes

