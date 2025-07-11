import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from '../core/auth.guard';

export default [
			{
				path: 'map',
        title:'Mapa',
        canActivate: [privateGuard()],
				loadComponent: () => import('./pages/map/map.component').then(m => m.MapComponent),
			},
			{
				path: 'repositorio',
        title:'Repositorio',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/repositorio/repositorio.component'),
			},
			{
				path: 'dashboard',
        title:'Dashboard',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/dashboard/dashboard.component').then ( m => m.DashboardComponent),
			},
			{
				path: 'metadata',
        title:'Metadata',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/metadata/metadata.component'),
			},
			{
				path: '',
				redirectTo: 'map',
				pathMatch: 'full',
			},
] as Routes

