import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidemenuComponent } from '../../components/sidebarmenu/sidemenu.component';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import StatisticDefinition from '@arcgis/core/rest/support/StatisticDefinition.js';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NavbarmenuComponent } from '../../components/navbarmenu/navbarmenu.component';

Chart.register(ChartDataLabels);

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, SidemenuComponent, NavbarmenuComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  private readonly SERVICIO_PIRDAIS = 'https://siscod.devida.gob.pe/server/rest/services/DPM_LIMITES_PIRDAIS/MapServer/10';
  private readonly QUERY_SERVICIO = `${this.SERVICIO_PIRDAIS}/query`;

  isMenuOpen = true;   // Estado inicial del menú
  isDesktop = false;   // Detecta si es pantalla grande

  public totalRegistrosCultivos = 0;
  public conteoPorCultivo: Record<string, number> = {};
  public totalCafe = 0;
  public totalCacao = 0;
  public totalAreaCultivo = 0; // en m²
  public areaPorCultivo: { cultivo: string; total_area: number }[] = [];
  public totalAreaCafe = 0;
  public totalAreaCacao = 0;


  ngAfterViewInit(): void {
    const dashboardCultivos = new FeatureLayer({ url: this.SERVICIO_PIRDAIS});

    dashboardCultivos
      .load()
      .then(() => {
        this.sumarAreaCultivoTotal(dashboardCultivos).then((total) => {
          this.totalAreaCultivo = total;
          this.crearGraficoProgresoporHectareas(total);
          this.crearGraficoProgresoporHectareasOZ();
          this.crearGraficoProgresoporHectareasOZCAFE();
          this.crearGraficoProgresoporHectareasOZCACAO();
          this.crearGraficoCantidadRegistrosOZCAFE();
          this.crearGraficoCantidadRegistrosOZCACAO();
          this.crearGraficoCantidadDniOZCAFE();
          this.crearGraficoCantidadDniOZCACAO();
        });
        this.generarGraficoCultivosPorTipo(dashboardCultivos);
        this.contarCafeCacao(dashboardCultivos).then((res) => {
          this.totalCafe = res.cafe;
          this.totalCacao = res.cacao;
        });
        this.sumarAreaPorCultivo(dashboardCultivos).then((data) => {
          this.areaPorCultivo = data;
        });
        this.contarRegistrosUnicosPorDNI(dashboardCultivos).then((totalDNI) => {
        });
      })
      .catch((err) => {
        console.error('Error cargando la capa:', err);
      });
  }

  //*Tarjetas sobre la Meta & Avance
  async sumarAreaCultivoTotal(layer: FeatureLayer): Promise<number> {
    const statDef = new StatisticDefinition({
      onStatisticField: 'area_cultivo',
      outStatisticFieldName: 'sum_area',
      statisticType: 'sum',
    });
    const query = layer.createQuery();
    query.where = '1=1';
    query.outStatistics = [statDef];
    query.returnGeometry = false;
    try {
      const result = await layer.queryFeatures(query);
      if (result.features.length > 0) {
        const value = result.features[0].attributes?.['sum_area'];
        return value != null ? value : 0;
      }
      return 0;
    } catch (err) {
      console.error('❌ Error al calcular suma de área:', err);
      return 0;
    }
  }
  async sumarAreaPorCultivo(layer: FeatureLayer): Promise<any[]> {
    const statDef = new StatisticDefinition({
      onStatisticField: 'area_cultivo',
      outStatisticFieldName: 'total_area',
      statisticType: 'sum',
    });

    const query = layer.createQuery();
    query.where = '1=1';
    query.outStatistics = [statDef];
    query.groupByFieldsForStatistics = ['cultivo'];
    query.returnGeometry = false;

    try {
      const result = await layer.queryFeatures(query);

      const data = result.features.map((f) => ({
        cultivo: f.attributes['cultivo'],
        total_area: f.attributes['total_area'],
      }));

      // Guardar áreas de café y cacao
      data.forEach((c) => {
        const nombre = c.cultivo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (nombre.includes('cafe')) this.totalAreaCafe = c.total_area;
        if (nombre.includes('cacao')) this.totalAreaCacao = c.total_area;
      });

      return data;
    } catch (err) {
      console.error('❌ Error al calcular área por cultivo:', err);
      this.totalAreaCafe = 0;
      this.totalAreaCacao = 0;
      return [];
    }
  }
  //*Grafico sobre la Meta & Avance
  crearGraficoProgresoporHectareas(total: number) {
    const meta = 43364;
    const restante = Math.max(meta - total, 0); // porción restante
    const ctx = document.getElementById('graficoMeta') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'doughnut', // tipo pastel
      data: {
        labels: ['AVANCE', 'RESTANTE'],
        datasets: [
          {
            data: [total, restante],
            backgroundColor: [
              'rgba(13, 155, 215, 0.7)', // azul
              'rgba(13, 166, 66, 0.3)'   // verde claro/transparente para la parte restante
            ],
            borderColor: [
              '#075A73', // borde azul
              '#085A25'  // borde verde
            ],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
          title: {
            display: true,
            text: 'PROGRESO POR HECTAREAS',  // <<< Aquí el título
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#333'
          },
          legend: {
            display: true,
            labels: {
              font: {
                weight: 'bold'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${context.label}: ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
              }
            }
          },
          datalabels: {
            color: 'white',
            font: {
              weight: 'bold',
              size: 16
            },
            formatter: (value) => {
              const porcentaje = (value as number / meta) * 100;
              return `${porcentaje.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
  //*Fin Grafico sobre la Meta & Avance
  //*Grafico sobre la Meta por Oficina Zonal
  async crearGraficoProgresoporHectareasOZ() {
    const baseUrl = this.QUERY_SERVICIO;
    interface Cultivo {
      org: string;
      area_cultivo: number;
    }

    let allFeatures: any[] = [];
    let offset = 0;
    const pageSize = 2000;
    let hasMore = true;

    // 🔹 Paginación para traer TODOS los registros
    while (hasMore) {
      const url =
        `${baseUrl}?where=1%3D1&outFields=org,area_cultivo` +
        `&returnGeometry=false&f=json&resultRecordCount=${pageSize}&resultOffset=${offset}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.length) {
        allFeatures = allFeatures.concat(data.features);
        offset += pageSize;
        hasMore = data.features.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const rawData: Cultivo[] = allFeatures.map((feat: any) => ({
      org: feat.attributes.org,
      area_cultivo: feat.attributes.area_cultivo,
    }));

    // Agrupamos por Oficina Zonal
    const agrupado: Record<string, number> = {};
    rawData.forEach((item: Cultivo) => {
      agrupado[item.org] = (agrupado[item.org] || 0) + item.area_cultivo;
    });

    // 🔹 Ordenar de mayor a menor
    const entries = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);
    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    // 🔹 Colores por ORG (mapa)
    const colorMap: Record<string, string> = {
      'OZ SAN FRANCISCO': '#FEEFD8',
      'OZ PUCALPA': '#B7D9FE',
      'OZ LA MERCED': '#FFC0B6',
      'OZ TINGO MARIA': '#D6F9FD',
      'OZ TARAPOTO': '#C2BBFE',
      'OZ SAN JUAN DE ORO': '#FED2F3',
      'OZ QUILLABAMBA': '#FEFEB9',
      'OZ IQUITOS': '#CAFEDA',
    };

    // Asignar colores según el ORG, si no existe usar gris
    const backgroundColors = labels.map(org => colorMap[org] || '#cccccc');
    const borderColors = backgroundColors.map(c => c);

    const ctx = document.getElementById('graficoMetaOZ') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Área cultivada (ha)',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barThickness: 25,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // barras horizontales
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                `${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`,
            },
          },
          y: {
            ticks: {
              font: { size: 12, weight: 'bold' },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'TOTAL DE AREA CULTIVADA POR OFICINA ZONAL',
            font: { size: 18, weight: 'bold' },
            color: '#333',
            padding: { top: 10, bottom: 20 }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = ctx.raw as number;
                return `${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`;
              },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: (v: number) =>
              `${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
  //*Fin Grafico sobre la Meta por Oficina Zonal

  //*Grafico sobre la Meta por Oficina Zonal - CAFE
  async crearGraficoProgresoporHectareasOZCAFE() {
    const baseUrl =this.QUERY_SERVICIO;

    interface Cultivo {
      org: string;
      area_cultivo: number;
      cultivo: string;
    }

    let allFeatures: any[] = [];
    let offset = 0;
    const pageSize = 2000;
    let hasMore = true;

    // 🔹 Paginación para traer TODOS los registros SOLO de CAFÉ
    while (hasMore) {
      const url =
        `${baseUrl}?where=cultivo='CAFE'&outFields=org,area_cultivo,cultivo` +
        `&returnGeometry=false&f=json&resultRecordCount=${pageSize}&resultOffset=${offset}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.length) {
        allFeatures = allFeatures.concat(data.features);
        offset += pageSize;
        hasMore = data.features.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const rawData: Cultivo[] = allFeatures.map((feat: any) => ({
      org: feat.attributes.org,
      area_cultivo: feat.attributes.area_cultivo,
      cultivo: feat.attributes.cultivo,
    }));

    // Agrupamos SOLO CAFÉ por Oficina Zonal
    const agrupado: Record<string, number> = {};
    rawData.forEach((item: Cultivo) => {
      if (item.cultivo === 'CAFE') {
        agrupado[item.org] = (agrupado[item.org] || 0) + item.area_cultivo;
      }
    });

    // 🔹 Ordenar de mayor a menor
    const entries = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);
    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    // 🔹 Colores por ORG
    const colorMap: Record<string, string> = {
      'OZ SAN FRANCISCO': '#FEEFD8',
      'OZ PUCALPA': '#B7D9FE',
      'OZ LA MERCED': '#FFC0B6',
      'OZ TINGO MARIA': '#D6F9FD',
      'OZ TARAPOTO': '#C2BBFE',
      'OZ SAN JUAN DE ORO': '#FED2F3',
      'OZ QUILLABAMBA': '#FEFEB9',
      'OZ IQUITOS': '#CAFEDA',
    };

    const backgroundColors = labels.map(org => colorMap[org] || '#cccccc');
    const borderColors = backgroundColors.map(c => c);

    const ctx = document.getElementById('graficoMetaOZCAFE') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Área cultivada de CAFÉ (ha)',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barThickness: 25,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                `${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`,
            },
          },
          y: {
            ticks: {
              font: { size: 12, weight: 'bold' },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'AREA TOTAL CULTIVADA DE CAFE POR OFICINA ZONAL',
            font: { size: 18, weight: 'bold' },
            color: '#333',
            padding: { top: 10, bottom: 20 }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = ctx.raw as number;
                return `${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`;
              },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: (v: number) =>
              `${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
  //*FIN Grafico sobre la Meta por Oficina Zonal - CAFE
  //*Grafico sobre la Meta por Oficina Zonal - CACAO
  async crearGraficoProgresoporHectareasOZCACAO() {
    const baseUrl = this.QUERY_SERVICIO;
    interface Cultivo {
      org: string;
      area_cultivo: number;
      cultivo: string;
    }

    let allFeatures: any[] = [];
    let offset = 0;
    const pageSize = 2000;
    let hasMore = true;

    // 🔹 Paginación para traer TODOS los registros SOLO de CACAO
    while (hasMore) {
      const url =
        `${baseUrl}?where=cultivo='CACAO'&outFields=org,area_cultivo,cultivo` +
        `&returnGeometry=false&f=json&resultRecordCount=${pageSize}&resultOffset=${offset}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.length) {
        allFeatures = allFeatures.concat(data.features);
        offset += pageSize;
        hasMore = data.features.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const rawData: Cultivo[] = allFeatures.map((feat: any) => ({
      org: feat.attributes.org,
      area_cultivo: feat.attributes.area_cultivo,
      cultivo: feat.attributes.cultivo,
    }));

    // 🔹 Agrupamos SOLO CACAO por Oficina Zonal
    const agrupado: Record<string, number> = {};
    rawData.forEach((item: Cultivo) => {
      if (item.cultivo === 'CACAO') {
        agrupado[item.org] = (agrupado[item.org] || 0) + item.area_cultivo;
      }
    });

    // 🔹 Ordenar de mayor a menor
    const entries = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);
    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    // 🔹 Colores por ORG
    const colorMap: Record<string, string> = {
      'OZ SAN FRANCISCO': '#FEEFD8',
      'OZ PUCALPA': '#B7D9FE',
      'OZ LA MERCED': '#FFC0B6',
      'OZ TINGO MARIA': '#D6F9FD',
      'OZ TARAPOTO': '#C2BBFE',
      'OZ SAN JUAN DE ORO': '#FED2F3',
      'OZ QUILLABAMBA': '#FEFEB9',
      'OZ IQUITOS': '#CAFEDA',
    };

    const backgroundColors = labels.map(org => colorMap[org] || '#cccccc');
    const borderColors = backgroundColors.map(c => c);

    const ctx = document.getElementById('graficoMetaOZCACAO') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Área cultivada de CACAO (ha)',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barThickness: 25,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                `${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`,
            },
          },
          y: {
            ticks: {
              font: { size: 12, weight: 'bold' },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'AREA TOTAL CULTIVADA DE CACAO POR OFICINA ZONAL',
            font: { size: 18, weight: 'bold' },
            color: '#333',
            padding: { top: 10, bottom: 20 }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = ctx.raw as number;
                return `${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`;
              },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: (v: number) =>
              `${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
  //*FIN Grafico sobre la Meta por Oficina Zonal - CACAO
  //*Grafico sobre total participantes
  public totalRegistrosUnicosDNI: Record<string, number> = {};
  async contarRegistrosUnicosPorDNI(layer: FeatureLayer): Promise<Record<string, number>> {
    try {
      const pageSize = 2000;
      const dnisPorCultivo: Record<string, Set<string>> = {
        cafe: new Set<string>(),
        cacao: new Set<string>()
      };
      const dnisTotales = new Set<string>();
      const total = await layer.queryFeatureCount({ where: '1=1' });
      let fetched = 0;

      while (fetched < total) {
        const result = await layer.queryFeatures({
          where: '1=1',
          outFields: ['dni', 'cultivo'],
          returnGeometry: false,
          start: fetched,
          num: pageSize,
        });

        result.features.forEach((f) => {
          const dni = f.attributes['dni'];
          if (!dni) return;

          const cultivoRaw = (f.attributes['cultivo'] || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();

          if (cultivoRaw.includes('cafe')) dnisPorCultivo['cafe'].add(dni);
          if (cultivoRaw.includes('cacao')) dnisPorCultivo['cacao'].add(dni);

          dnisTotales.add(dni);
        });

        fetched += result.features.length;
      }

      // calcular intersección (café y cacao)
      const cafe_y_cacao = [...dnisPorCultivo['cafe']].filter((dni) =>
        dnisPorCultivo['cacao'].has(dni)
      );

      const conteoFinal: Record<string, number> = {
        cafe: dnisPorCultivo['cafe'].size - cafe_y_cacao.length,
        cacao: dnisPorCultivo['cacao'].size - cafe_y_cacao.length,
        'cafe_y_cacao': cafe_y_cacao.length,
        total: dnisTotales.size
      };

      this.totalRegistrosUnicosDNI = conteoFinal;
      return conteoFinal;
    } catch (err) {
      console.error('❌ Error al contar registros únicos por DNI por cultivo:', err);
      this.totalRegistrosUnicosDNI = { cafe: 0, cacao: 0, cafe_y_cacao: 0, total: 0 };
      return { cafe: 0, cacao: 0, cafe_y_cacao: 0, total: 0 };
    }
  }
  //*Grafico sobre total poligonos
  contarCafeCacao(layer: FeatureLayer) {
    const pageSize = 2000;
    let conteoCafe = 0;
    let conteoCacao = 0;

    const getAllData = async () => {
      const total = await layer.queryFeatureCount({ where: '1=1' });
      let fetched = 0;

      while (fetched < total) {
        const result = await layer.queryFeatures({
          where: '1=1',
          outFields: ['cultivo'],
          returnGeometry: false,
          start: fetched,
          num: pageSize,
        });

        result.features.forEach((f) => {
          const cultivo = (f.attributes['cultivo'] || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (cultivo.includes('cafe')) conteoCafe++;
          if (cultivo.includes('cacao')) conteoCacao++;
        });

        fetched += result.features.length;
      }

      return { cafe: conteoCafe, cacao: conteoCacao };
    };

    return getAllData().catch((err) => {
      console.error('❌ Error al consultar CAFE y CACAO:', err);
      return { cafe: 0, cacao: 0 };
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
          num: pageSize,
        });

        result.features.forEach((f) => {
          const cultivo = f.attributes['cultivo'];
          if (cultivo) conteo[cultivo] = (conteo[cultivo] || 0) + 1;
        });

        fetched += result.features.length;
      }

      this.conteoPorCultivo = conteo;
      const labels = Object.keys(conteo);
      const values = Object.values(conteo);
      this.totalRegistrosCultivos = values.reduce((acc, val) => acc + val, 0);

      const ctx = document.getElementById('graficoCultivoTipo') as HTMLCanvasElement;
      if (!ctx) return;

      new Chart(ctx.getContext('2d')!, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              label: 'Registros por tipo de cultivo',
              data: values,
              backgroundColor: labels.map((cultivo) => {
                const c = cultivo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                if (c.includes('cafe')) return '#a18262';
                if (c.includes('cacao')) return '#645650';
                return '#D3D3D3';
              }),
              borderColor: '#fff',
              borderWidth: 2,
              hoverOffset: 15,
            },
          ],
        },
        options: {
          responsive: true,
          animations: {
            rotate: { duration: 1200, easing: 'easeOutBounce' },
            scale: { duration: 800, easing: 'easeOutQuart' },
          },
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#333', font: { size: 13, weight: 'bold' } },
            },
            title: { display: true, text: 'Cantidad de registros por tipo de cultivo', font: { size: 18 } },
            datalabels: {
              color: '#fff',
              font: { weight: 'bold' },
              formatter: (value: number, context) => {
                const total = (context.chart.data.datasets[0].data as number[]).reduce((acc, val) => acc + val, 0);
                return ((value / total) * 100).toFixed(1) + '%';
              },
            },
          },
        },
        plugins: [ChartDataLabels],
      });
    };

    getAllCultivoData().catch((err) => console.error('❌ Error al consultar todos los cultivos:', err));
  }
  //*Participantes por oficina Zonal
  async crearGraficoCantidadDniOZCAFE() {
    const baseUrl =this.QUERY_SERVICIO;
    interface Cultivo {
      org: string;
      cultivo: string;
      dni: string;
    }

    let allFeatures: any[] = [];
    let offset = 0;
    const pageSize = 2000;
    let hasMore = true;

    // 🔹 Paginación para traer TODOS los registros SOLO de CAFÉ
    while (hasMore) {
      const url =
        `${baseUrl}?where=cultivo='CAFE'&outFields=org,cultivo,dni` +
        `&returnGeometry=false&f=json&resultRecordCount=${pageSize}&resultOffset=${offset}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.length) {
        allFeatures = allFeatures.concat(data.features);
        offset += pageSize;
        hasMore = data.features.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const rawData: Cultivo[] = allFeatures.map((feat: any) => ({
      org: feat.attributes.org,
      cultivo: feat.attributes.cultivo,
      dni: feat.attributes.dni,
    }));

    // 🔹 Contamos **DNI únicos** de CAFÉ por Oficina Zonal
    const agrupado: Record<string, Set<string>> = {};
    rawData.forEach((item: Cultivo) => {
      if (item.cultivo === 'CAFE' && item.dni) {
        if (!agrupado[item.org]) agrupado[item.org] = new Set<string>();
        agrupado[item.org].add(item.dni);
      }
    });

    // 🔹 Convertimos los sets a números y ordenamos
    const entries = Object.entries(agrupado)
      .map(([org, dnis]) => [org, dnis.size] as [string, number])
      .sort((a, b) => b[1] - a[1]);

    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    // 🔹 Colores por ORG
    const colorMap: Record<string, string> = {
      'OZ SAN FRANCISCO': '#FEEFD8',
      'OZ PUCALPA': '#B7D9FE',
      'OZ LA MERCED': '#FFC0B6',
      'OZ TINGO MARIA': '#D6F9FD',
      'OZ TARAPOTO': '#C2BBFE',
      'OZ SAN JUAN DE ORO': '#FED2F3',
      'OZ QUILLABAMBA': '#FEFEB9',
      'OZ IQUITOS': '#CAFEDA',
    };

    const backgroundColors = labels.map(org => colorMap[org] || '#cccccc');
    const borderColors = backgroundColors.map(c => c);

    const ctx = document.getElementById('graficoCantidadDNIOZCAFE') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Participantes únicos con CAFÉ',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barThickness: 25,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                `${Number(value).toLocaleString('es-PE')} participantes`,
            },
          },
          y: {
            ticks: {
              font: { size: 12, weight: 'bold' },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'PARTICIPANTES ÚNICOS DE CAFÉ POR OFICINA ZONAL',
            font: { size: 18, weight: 'bold' },
            color: '#333',
            padding: { top: 10, bottom: 20 }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${Number(ctx.raw).toLocaleString('es-PE')} participantes`,
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: (v: number) =>
              `${Number(v).toLocaleString('es-PE')} participantes`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
  async crearGraficoCantidadDniOZCACAO() {
    const baseUrl =this.QUERY_SERVICIO;
    interface Cultivo {
      org: string;
      cultivo: string;
      dni: string;
    }

    let allFeatures: any[] = [];
    let offset = 0;
    const pageSize = 2000;
    let hasMore = true;

    // 🔹 Paginación para traer TODOS los registros SOLO de CACAO
    while (hasMore) {
      const url =
        `${baseUrl}?where=cultivo='CACAO'&outFields=org,cultivo,dni` +
        `&returnGeometry=false&f=json&resultRecordCount=${pageSize}&resultOffset=${offset}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.length) {
        allFeatures = allFeatures.concat(data.features);
        offset += pageSize;
        hasMore = data.features.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const rawData: Cultivo[] = allFeatures.map((feat: any) => ({
      org: feat.attributes.org,
      cultivo: feat.attributes.cultivo,
      dni: feat.attributes.dni,
    }));

    // 🔹 Contamos **DNI únicos** de CACAO por Oficina Zonal
    const agrupado: Record<string, Set<string>> = {};
    rawData.forEach((item: Cultivo) => {
      if (item.cultivo === 'CACAO' && item.dni) {
        if (!agrupado[item.org]) agrupado[item.org] = new Set<string>();
        agrupado[item.org].add(item.dni);
      }
    });

    // 🔹 Convertimos los sets a números y ordenamos
    const entries = Object.entries(agrupado)
      .map(([org, dnis]) => [org, dnis.size] as [string, number])
      .sort((a, b) => b[1] - a[1]);

    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    // 🔹 Colores por ORG
    const colorMap: Record<string, string> = {
      'OZ SAN FRANCISCO': '#FEEFD8',
      'OZ PUCALPA': '#B7D9FE',
      'OZ LA MERCED': '#FFC0B6',
      'OZ TINGO MARIA': '#D6F9FD',
      'OZ TARAPOTO': '#C2BBFE',
      'OZ SAN JUAN DE ORO': '#FED2F3',
      'OZ QUILLABAMBA': '#FEFEB9',
      'OZ IQUITOS': '#CAFEDA',
    };

    const backgroundColors = labels.map(org => colorMap[org] || '#cccccc');
    const borderColors = backgroundColors.map(c => c);

    const ctx = document.getElementById('graficoCantidadDNIOZCACAO') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Participantes unicos con CACAO',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barThickness: 25,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                `${Number(value).toLocaleString('es-PE')} participantes`,
            },
          },
          y: {
            ticks: {
              font: { size: 12, weight: 'bold' },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'PARTICIPANTES UNICOS DE CACAO POR OFICINA ZONAL',
            font: { size: 18, weight: 'bold' },
            color: '#333',
            padding: { top: 10, bottom: 20 }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${Number(ctx.raw).toLocaleString('es-PE')} participantes`,
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: (v: number) =>
              `${Number(v).toLocaleString('es-PE')} participantes`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
  //*Grafico por cultivo de cafe por Oficina Zonal
  async crearGraficoCantidadRegistrosOZCAFE() {
    const baseUrl = this.QUERY_SERVICIO;
    interface Cultivo {
      org: string;
      cultivo: string;
    }

    let allFeatures: any[] = [];
    let offset = 0;
    const pageSize = 2000;
    let hasMore = true;

    // 🔹 Paginación para traer TODOS los registros SOLO de CAFÉ
    while (hasMore) {
      const url =
        `${baseUrl}?where=cultivo='CAFE'&outFields=org,cultivo` +
        `&returnGeometry=false&f=json&resultRecordCount=${pageSize}&resultOffset=${offset}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.length) {
        allFeatures = allFeatures.concat(data.features);
        offset += pageSize;
        hasMore = data.features.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const rawData: Cultivo[] = allFeatures.map((feat: any) => ({
      org: feat.attributes.org,
      cultivo: feat.attributes.cultivo,
    }));

    // 🔹 Contamos registros de CAFÉ por Oficina Zonal
    const agrupado: Record<string, number> = {};
    rawData.forEach((item: Cultivo) => {
      if (item.cultivo === 'CAFE') {
        agrupado[item.org] = (agrupado[item.org] || 0) + 1;
      }
    });

    // 🔹 Ordenar de mayor a menor
    const entries = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);
    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    // 🔹 Colores por ORG
    const colorMap: Record<string, string> = {
      'OZ SAN FRANCISCO': '#FEEFD8',
      'OZ PUCALPA': '#B7D9FE',
      'OZ LA MERCED': '#FFC0B6',
      'OZ TINGO MARIA': '#D6F9FD',
      'OZ TARAPOTO': '#C2BBFE',
      'OZ SAN JUAN DE ORO': '#FED2F3',
      'OZ QUILLABAMBA': '#FEFEB9',
      'OZ IQUITOS': '#CAFEDA',
    };

    const backgroundColors = labels.map(org => colorMap[org] || '#cccccc');
    const borderColors = backgroundColors.map(c => c);

    const ctx = document.getElementById('graficoCantidadOZCAFE') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Cantidad de polígonos de CAFÉ',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barThickness: 25,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                `${Number(value).toLocaleString('es-PE')} polígonos`,
            },
          },
          y: {
            ticks: {
              font: { size: 12, weight: 'bold' },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'CANTIDAD DE POLIGONOS DE CAFE POR OFICINA ZONAL',
            font: { size: 18, weight: 'bold' },
            color: '#333',
            padding: { top: 10, bottom: 20 }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${Number(ctx.raw).toLocaleString('es-PE')} polígonos`,
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: (v: number) =>
              `${Number(v).toLocaleString('es-PE')} polígonos`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
  //*Grafico por cultivo de cacao por Oficina Zonal
  async crearGraficoCantidadRegistrosOZCACAO() {
    const baseUrl = this.QUERY_SERVICIO;
    interface Cultivo {
      org: string;
      cultivo: string;
    }

    let allFeatures: any[] = [];
    let offset = 0;
    const pageSize = 2000;
    let hasMore = true;

    // 🔹 Paginación para traer TODOS los registros SOLO de CACAO
    while (hasMore) {
      const url =
        `${baseUrl}?where=cultivo='CACAO'&outFields=org,cultivo` +
        `&returnGeometry=false&f=json&resultRecordCount=${pageSize}&resultOffset=${offset}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.length) {
        allFeatures = allFeatures.concat(data.features);
        offset += pageSize;
        hasMore = data.features.length === pageSize;
      } else {
        hasMore = false;
      }
    }

    const rawData: Cultivo[] = allFeatures.map((feat: any) => ({
      org: feat.attributes.org,
      cultivo: feat.attributes.cultivo,
    }));

    // 🔹 Contamos registros de CACAO por Oficina Zonal
    const agrupado: Record<string, number> = {};
    rawData.forEach((item: Cultivo) => {
      if (item.cultivo === 'CACAO') {
        agrupado[item.org] = (agrupado[item.org] || 0) + 1;
      }
    });

    // 🔹 Ordenar de mayor a menor
    const entries = Object.entries(agrupado).sort((a, b) => b[1] - a[1]);
    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    // 🔹 Colores por ORG
    const colorMap: Record<string, string> = {
      'OZ SAN FRANCISCO': '#FEEFD8',
      'OZ PUCALPA': '#B7D9FE',
      'OZ LA MERCED': '#FFC0B6',
      'OZ TINGO MARIA': '#D6F9FD',
      'OZ TARAPOTO': '#C2BBFE',
      'OZ SAN JUAN DE ORO': '#FED2F3',
      'OZ QUILLABAMBA': '#FEFEB9',
      'OZ IQUITOS': '#CAFEDA',
    };

    const backgroundColors = labels.map(org => colorMap[org] || '#cccccc');
    const borderColors = backgroundColors.map(c => c);

    const ctx = document.getElementById('graficoCantidadOZCACAO') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Cantidad de polígonos de CACAO',
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            barThickness: 25,
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                `${Number(value).toLocaleString('es-PE')} polígonos`,
            },
          },
          y: {
            ticks: {
              font: { size: 12, weight: 'bold' },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'CANTIDAD DE POLIGONOS DE CACAO POR OFICINA ZONAL',
            font: { size: 18, weight: 'bold' },
            color: '#333',
            padding: { top: 10, bottom: 20 }
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${Number(ctx.raw).toLocaleString('es-PE')} polígonos`,
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: (v: number) =>
              `${Number(v).toLocaleString('es-PE')} polígonos`,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}
