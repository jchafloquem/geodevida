import { Component, AfterViewInit } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  public totalRegistros = 0; // 👈 Asegúrate de que esté aquí y sea pública

  ngAfterViewInit(): void {
    const featureLayer = new FeatureLayer({
      url: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_%E2%80%93_CAFE_vista/FeatureServer/0'
    });

    featureLayer.load().then(() => {
      this.generarGraficoDistritos(featureLayer);
      this.generarGraficoTecnicos(featureLayer);
    }).catch(err => {
      console.error('Error cargando la capa:', err);
    });
  }

  generarGraficoDistritos(layer: FeatureLayer) {
    layer.queryFeatures({
      where: '1=1',
      outFields: ['id_distrito'],
      returnGeometry: false
    }).then((res) => {
      this.totalRegistros = res.features.length; // 👈 Guardamos total

      const datos = res.features.map(f => f.attributes['id_distrito']);
      const conteo: Record<string, number> = {};

      datos.forEach(d => {
        conteo[d] = (conteo[d] || 0) + 1;
      });

      const labels = Object.keys(conteo);
      const values = Object.values(conteo);

      new Chart('graficoDistritos', {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Encuestas por distrito',
            data: values,
            backgroundColor: labels.map((_, i) =>
              `hsl(${(i * 360) / labels.length}, 60%, 60%)`
            )
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right' },
            title: {
              display: true,
              text: 'Distribución de encuestas por distrito'
            },
            datalabels: {
              color: '#fff',
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
    });
  }
  generarGraficoTecnicos(layer: FeatureLayer) {
    layer.queryFeatures({
      where: '1=1',
      outFields: ['tecnico'],
      returnGeometry: false
    }).then((res) => {
      const datos = res.features.map(f => f.attributes['tecnico']);
      const conteo: Record<string, number> = {};

      datos.forEach(nombre => {
        conteo[nombre] = (conteo[nombre] || 0) + 1;
      });

      const labels = Object.keys(conteo);
      const values = Object.values(conteo);

      new Chart('graficoTecnicos', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Encuestas por técnico',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Distribución por técnico'
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: (value: number) => value.toString()
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    });
  }

}

