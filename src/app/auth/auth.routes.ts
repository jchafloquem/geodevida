import { Routes } from '@angular/router';


export default [
			{
				path: 'login',
        title:'Login',
				loadComponent: () => import('./pages/login/login.component'),
			},
			{
				path: 'welcome',
        title:'Bienvenido',
				loadComponent: () => import('./pages/welcome/welcome.component'),
			},
			{
				path: 'register',
        title:'Registrar',
				loadComponent: () => import('./pages/register/register.component'),
			},
			{
				path: 'error',
				loadComponent: () => import('./pages/error404/error404.component'),
			},
			{
				path: '',
				redirectTo: 'welcome',
				pathMatch: 'full',
			},
] as Routes
