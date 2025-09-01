import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CommonModule} from '@angular/common';
import { NavbarmenuComponent } from '../../components/navbarmenu/navbarmenu.component';
import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import { RouterModule } from '@angular/router';

Chart.register(ChartDataLabels);

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, SidemenuComponent, NavbarmenuComponent],
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  isMenuOpen = true;   // Estado inicial del menú
  isDesktop = false;   // Detecta si es pantalla grande
}
