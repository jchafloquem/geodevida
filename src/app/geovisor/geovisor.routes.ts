import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from '../core/auth.guard';

export default [
			{
				path: 'map',
        title:'Geo : PIRDAIS',
        canActivate: [privateGuard()],
				loadComponent: () => import('./pages/map/map.component').then(m => m.MapComponent),
			},
      {
				path: 'dashboard',
        title:'Dashboard : PIRDAS',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/dashboard/dashboard.component').then ( m => m.DashboardComponent),
			},
      {
				path: 'reportes',
        title:'Reportes : PIRDAIS',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/report/report.component').then ( m => m.ReportComponent),
			},
			{
				path: 'repositorio',
        title:'Repositorio : PIRDAIS',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/repositorio/repositorio.component'),
			},
			{
				path: 'metadata',
        title:'Metadata : PIRDAIS',
        canActivate: [publicGuard()],
				loadComponent: () => import('./pages/metadata/metadata.component'),
			},
			{
				path: '',
				redirectTo: 'map',
				pathMatch: 'full',
			},
] as Routes

