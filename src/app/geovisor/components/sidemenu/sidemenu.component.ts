import { Component, inject } from '@angular/core';
import { Router, Route, RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent {
  menuRoutes: Route[] = [];
  constructor() {
    const router = inject(Router);
    const allRoutes = router.config;
    const excluded = ['error', 'login', '404'];
    const childRoutes = allRoutes
      .map(route => {
        const children = route.children ?? [];
        const lazy = (route as any)._loadedRoutes ?? [];
        return [...children, ...lazy];
      })
      .flat()
      .filter(route =>
        route.path &&
        !excluded.includes(route.path) &&
        route.loadComponent
      );
    this.menuRoutes = childRoutes;
    console.log('📦 Rutas hijas visibles (excluyendo error):', this.menuRoutes);
  }
}