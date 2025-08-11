import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import Query from '@arcgis/core/rest/support/Query';
import { CommonModule } from '@angular/common';


Chart.register(ChartDataLabels);

@Component({
  standalone: true,
  imports:[CommonModule ,RouterModule, SidemenuComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  mostrarMenu = false;
  public totalRegistrosCultivos = 0;
  public conteoPorCultivo: Record<string, number> = {}; // 👉 nuevo

  ngAfterViewInit(): void {
    const dashboardCultivos = new FeatureLayer({
      url: 'https://siscod.devida.gob.pe/server/rest/services/DPM_LIMITES_PIRDAIS/MapServer/10'
    });
    dashboardCultivos.load().then(() => {
      this.generarGraficoCultivosPorTipo(dashboardCultivos);
    }).catch(err => {
      console.error('Error cargando la capa:', err);
    });
  }

  generarGraficoCultivosPorTipo(layer: FeatureLayer) {
  const pageSize = 2000;
  const conteo: Record<string, number> = {};

  const getAllCultivoData = async () => {
    const total = await layer.queryFeatureCount({ where: '1=1' });
    let fetched = 0;

    while (fetched < total) {
      const result = await layer.queryFeatures({
        where: '1=1',
        outFields: ['cultivo'],
        returnGeometry: false,
        start: fetched,
        num: pageSize
      });

      result.features.forEach(f => {
        const cultivo = f.attributes['cultivo'];
        if (cultivo) {
          conteo[cultivo] = (conteo[cultivo] || 0) + 1;
        }
      });

      fetched += result.features.length;
    }
    // Guardamos el conteo para mostrarlo en pantalla
    this.conteoPorCultivo = conteo;

    const labels = Object.keys(conteo);
    const values = Object.values(conteo);
    this.totalRegistrosCultivos = values.reduce((acc, val) => acc + val, 0);

    new Chart('graficoCultivoTipo', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Registros por tipo de cultivo',
          data: values,
          backgroundColor: labels.map(cultivo => {
            const c = cultivo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (c.includes('cafe')) return '#a18262';    // verde para café
            if (c.includes('cacao')) return '#645650 ';   // marrón para cacao
            return '#D3D3D3';                             // gris claro para otros
          }),
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        animations: {
          rotate: {
            duration: 1200,
            easing: 'easeOutBounce'
          },
          scale: {
            duration: 800,
            easing: 'easeOutQuart'
          }
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#333',
              font: {
                size: 13,
                weight: 'bold'
              }
            }
          },
          title: {
            display: true,
            text: 'Cantidad de registros por tipo de cultivo',
            font: {
              size: 18
            }
          },
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold'
            },
            formatter: (value: number, context) => {
              const total = (context.chart.data.datasets[0].data as number[])
                .reduce((acc, val) => acc + val, 0);
              return ((value / total) * 100).toFixed(1) + '%';
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  };
  getAllCultivoData().catch(err => {
    console.error('❌ Error al consultar todos los cultivos:', err);
  });
  }
}

