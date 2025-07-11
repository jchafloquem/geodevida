import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';


Chart.register(ChartDataLabels);

@Component({
  standalone: true,
  imports:[RouterModule, SidemenuComponent],
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

      this.generarGraficoDepartamento(featureLayer);
      this.generarGraficoProvincia(featureLayer);
      this.generarGraficoDistritos(featureLayer);


    }).catch(err => {
      console.error('Error cargando la capa:', err);
    });
  }

  generarGraficoDepartamento(layer: FeatureLayer) {
    layer.queryFeatures({
      where: '1=1',
      outFields: ['id_departamento'],
      returnGeometry: false
    }).then((res) => {
      this.totalRegistros = res.features.length; // 👈 Guardamos total

      const datos = res.features.map(f => f.attributes['id_departamento']);
      const conteo: Record<string, number> = {};

      datos.forEach(d => {
        conteo[d] = (conteo[d] || 0) + 1;
      });

      const labels = Object.keys(conteo);
      const values = Object.values(conteo);

      new Chart('graficoDepartamento', {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Encuestas por Departamento',
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
              text: 'Encuestas por departamento'
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
  generarGraficoProvincia(layer: FeatureLayer) {
    layer.queryFeatures({
      where: '1=1',
      outFields: ['id_provincia'],
      returnGeometry: false
    }).then((res) => {
      this.totalRegistros = res.features.length; // 👈 Guardamos total

      const datos = res.features.map(f => f.attributes['id_provincia']);
      const conteo: Record<string, number> = {};

      datos.forEach(d => {
        conteo[d] = (conteo[d] || 0) + 1;
      });

      const labels = Object.keys(conteo);
      const values = Object.values(conteo);

      new Chart('graficoProvincia', {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: 'Encuestas por Provincia',
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
              text: 'Encuestas por provincia'
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
              text: 'Encuestas por distrito'
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
}

