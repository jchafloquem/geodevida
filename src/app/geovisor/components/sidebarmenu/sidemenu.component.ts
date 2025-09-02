import { Component, inject, Input } from '@angular/core';
import { Router, Route, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidemenu.component.html',
})
export class SidemenuComponent {
  @Input() visible: boolean = true; // 👈 control de visibilidad
  menuVisible = false; // 👈 por defecto visible

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
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
