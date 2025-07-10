import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from '../core/auth.guard';

export default [
			{
				path: 'map',
        canActivate: [privateGuard()],
				loadComponent: () => import('./pages/map/map.component'),
			},
			{
				path: 'repositorio',
        canActivate: [privateGuard()],
				loadComponent: () => import('./pages/repositorio/repositorio.component'),
			},
			{
				path: 'dashboard',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/dashboard/dashboard.component'),
			},
			{
				path: 'metadata',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/metadata/metadata.component'),
			},
			{
				path: '',
				redirectTo: 'map',
				pathMatch: 'full',
			},
] as Routes

