import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import Query from '@arcgis/core/rest/support/Query';


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
    const dashboardSurveyPrueba = new FeatureLayer({
      url: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_%E2%80%93_CAFE_vista/FeatureServer/0'
    });

    const dashboardCultivos = new FeatureLayer({
      url: 'https://siscod.devida.gob.pe/server/rest/services/DPM_LIMITES_PIRDAIS/MapServer/10'
    });


    dashboardSurveyPrueba.load().then(() => {
      this.generarGraficoDepartamento(dashboardSurveyPrueba);
      this.generarGraficoProvincia(dashboardSurveyPrueba);
      this.generarGraficoDistritos(dashboardSurveyPrueba);

    }).catch(err => {
      console.error('Error cargando la capa:', err);
    });

    dashboardCultivos.load().then(() => {
      this.generarGraficoCultivosPorTipo(dashboardCultivos);


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

  public totalRegistrosCultivos = 0;
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

