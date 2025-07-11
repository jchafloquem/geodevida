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
      this.generarGraficoCultivosPorDepartamento(dashboardCultivos); // ✅ activado
      this.generarGraficoPorFecha(dashboardCultivos); // o cualquier otra capa

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

  public totalRegistrosPorDepartamento = 0;
  generarGraficoCultivosPorDepartamento(layer: FeatureLayer) {
    const pageSize = 2000;
    const conteo: Record<string, number> = {};

    const getAllDepartamentos = async () => {
      const total = await layer.queryFeatureCount({ where: '1=1' });
      let fetched = 0;

      while (fetched < total) {
        const result = await layer.queryFeatures({
          where: '1=1',
          outFields: ['depart'],
          returnGeometry: false,
          start: fetched,
          num: pageSize
        });

        result.features.forEach(f => {
          const depRaw = f.attributes?.depart;
          const dep = depRaw?.toString().trim();

          if (dep && dep.length > 0 && dep.toLowerCase() !== 'null') {
            conteo[dep] = (conteo[dep] || 0) + 1;
          }
        });

        fetched += result.features.length;
      }

      // Ordenar y mostrar solo los 20 más frecuentes
      const sorted = Object.entries(conteo)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20); // 👈 muestra top 20

      const labels = sorted.map(([dep]) => dep);
      const values = sorted.map(([_, count]) => count);
      this.totalRegistrosPorDepartamento = values.reduce((acc, val) => acc + val, 0);

      new Chart('graficoCultivoDepartamento', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Cantidad de registros por departamento',
            data: values,
            backgroundColor: labels.map((_, i) => `hsl(${i * 30 % 360}, 70%, 60%)`),
            borderRadius: 6,
            barPercentage: 0.7
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y', // 📊 barras horizontales
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Departamentos por registros de cultivos',
              font: { size: 18 }
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              formatter: value => value.toString(),
              color: '#000',
              font: { weight: 'bold' }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                precision: 0 // sin decimales
              }
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    };

    getAllDepartamentos().catch(err => {
      console.error('❌ Error al consultar departamentos:', err);
    });
  }

  generarGraficoPorFecha(layer: FeatureLayer) {
    const pageSize = 2000;
    const conteo: Record<string, number> = {};

    const getAllFechas = async () => {
      const total = await layer.queryFeatureCount({ where: '1=1' });
      let fetched = 0;

      while (fetched < total) {
        const result = await layer.queryFeatures({
          where: '1=1',
          outFields: ['fecha'],
          returnGeometry: false,
          start: fetched,
          num: pageSize
        });

        result.features.forEach(f => {
          const rawFecha = f.attributes?.fecha;
          if (typeof rawFecha === 'string' && rawFecha.includes('-')) {
            const [year, month] = rawFecha.split('-');
            const clave = `${year}-${month}`;
            conteo[clave] = (conteo[clave] || 0) + 1;
          }
        });

        fetched += result.features.length;
      }

      const sorted = Object.entries(conteo)
        .sort(([a], [b]) => a.localeCompare(b)); // orden cronológico

      const labels = sorted.map(([clave]) => clave);
      const values = sorted.map(([_, count]) => count);

      new Chart('graficoPorFecha', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Registros por mes y año',
            data: values,
            backgroundColor: '#69b3a2',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Distribución por año y mes',
              font: { size: 18 }
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: value => value.toString(),
              color: '#000',
              font: { weight: 'bold' }
            }
          },
          scales: {
            x: {
              ticks: {
                autoSkip: true,
                maxRotation: 45,
                minRotation: 45
              }
            },
            y: {
              beginAtZero: true
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    };

    getAllFechas().catch(err => {
      console.error('❌ Error al consultar fechas:', err);
    });
  }

}

