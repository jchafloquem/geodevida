import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import { CommonModule } from '@angular/common';

import StatisticDefinition from '@arcgis/core/rest/support/StatisticDefinition.js';

Chart.register(ChartDataLabels);

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, SidemenuComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  mostrarMenu = false;
  public totalRegistrosCultivos = 0;
  public conteoPorCultivo: Record<string, number> = {};
  public totalCafe = 0;
  public totalCacao = 0;
  public totalAreaCultivo = 0; // en m²
  public areaPorCultivo: { cultivo: string; total_area: number }[] = [];

  ngAfterViewInit(): void {
    const dashboardCultivos = new FeatureLayer({
      url: 'https://siscod.devida.gob.pe/server/rest/services/DPM_LIMITES_PIRDAIS/MapServer/10',
    });

    dashboardCultivos
      .load()
      .then(() => {
        this.generarGraficoCultivosPorTipo(dashboardCultivos);
        this.contarCafeCacao(dashboardCultivos).then((res) => {
          this.totalCafe = res.cafe;
          this.totalCacao = res.cacao;
          console.log('📊 Conteo final:', res);
        });
        this.sumarAreaCultivoTotal(dashboardCultivos).then((total) => {
          this.totalAreaCultivo = total;
          console.log('🌱 Área total de cultivo (m²):', total);
        });
        this.sumarAreaPorCultivo(dashboardCultivos).then((data) => {
          this.areaPorCultivo = data;
          console.log('🌱 Área por cultivo (m²):', data);
          this.generarGraficoAreaPorCultivo(data);
        });
        this.contarRegistrosUnicosPorDNI(dashboardCultivos).then((totalDNI) => {
          console.log('🧾 Total de registros únicos por DNI:', totalDNI);
        });
      })
      .catch((err) => {
        console.error('Error cargando la capa:', err);
      });
  }

  // 👉 Funcion para calculo de Area total
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
  // 👉 Funcion para calculo de Area por Cultivo (Cafe y Cacao)
  public totalAreaCafe = 0;  // área de café en m²
  public totalAreaCacao = 0; // área de cacao en m²
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

      // Mapear resultados
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


  generarGraficoAreaPorCultivo(data: { cultivo: string; total_area: number }[]) {
    const labels = data.map((d) => d.cultivo);
    const values = data.map((d) => d.total_area);

    new Chart('graficoAreaCultivo', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Área cultivada (m²)',
            data: values,
            backgroundColor: '#4CAF50',
            borderColor: '#2E7D32',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Área total por tipo de cultivo',
            font: { size: 18 },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#333',
            font: { weight: 'bold' },
            formatter: (value: number) => {
              return (value / 10000).toFixed(1) + ' ha'; // 👉 convierte a hectáreas
            },
          },
        },
      },
      plugins: [ChartDataLabels],
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
          if (cultivo) {
            conteo[cultivo] = (conteo[cultivo] || 0) + 1;
          }
        });

        fetched += result.features.length;
      }

      this.conteoPorCultivo = conteo;

      const labels = Object.keys(conteo);
      const values = Object.values(conteo);
      this.totalRegistrosCultivos = values.reduce((acc, val) => acc + val, 0);

      new Chart('graficoCultivoTipo', {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              label: 'Registros por tipo de cultivo',
              data: values,
              backgroundColor: labels.map((cultivo) => {
                const c = cultivo
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '');
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
              labels: {
                color: '#333',
                font: { size: 13, weight: 'bold' },
              },
            },
            title: {
              display: true,
              text: 'Cantidad de registros por tipo de cultivo',
              font: { size: 18 },
            },
            datalabels: {
              color: '#fff',
              font: { weight: 'bold' },
              formatter: (value: number, context) => {
                const total = (
                  context.chart.data.datasets[0].data as number[]
                ).reduce((acc, val) => acc + val, 0);
                return ((value / total) * 100).toFixed(1) + '%';
              },
            },
          },
        },
        plugins: [ChartDataLabels],
      });
    };

    getAllCultivoData().catch((err) => {
      console.error('❌ Error al consultar todos los cultivos:', err);
    });
  }

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
          const cultivo = (f.attributes['cultivo'] || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

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

  // 👉 NUEVA FUNCIÓN: contar registros únicos por DNI
async contarRegistrosUnicosPorDNI(layer: FeatureLayer): Promise<number> {
  const pageSize = 2000;
  const dnisUnicos = new Set<string>();
  const total = await layer.queryFeatureCount({ where: '1=1' });
  let fetched = 0;
  while (fetched < total) {
    const result = await layer.queryFeatures({
      where: '1=1',
      outFields: ['dni'], // campo a revisar
      returnGeometry: false,
      start: fetched,
      num: pageSize,
    });
    result.features.forEach((f) => {
      const dni = f.attributes['dni'];
      if (dni) dnisUnicos.add(dni); // agrega solo si no existe
    });
    fetched += result.features.length;
  }
  return dnisUnicos.size;
}



}
