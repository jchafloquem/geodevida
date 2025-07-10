// dashboard.component.ts
import { Component, AfterViewInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Chart from 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const layer = new FeatureLayer({
      url: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_%E2%80%93_CAFE_vista/FeatureServer/0'
    });

    const map = new Map({
      basemap: 'topo-vector',
      layers: [layer]
    });

    const view = new MapView({
      container: 'mapView',
      map: map,
      center: [-75, -9],
      zoom: 8
    });

    view.when(() => {
      layer.when(() => {
        this.generarGraficoDistritos(layer);
      });
    });
  }

  generarGraficoDistritos(layer: FeatureLayer) {
    layer.queryFeatures({
      where: '1=1',
      outFields: ['id_distrito'],
      returnGeometry: false
    }).then((res) => {
      const datos = res.features.map(f => f.attributes['id_distrito']);
      const conteo: Record<string, number> = {};

      datos.forEach(d => {
        conteo[d] = (conteo[d] || 0) + 1;
      });

      const labels = Object.keys(conteo);
      const values = Object.values(conteo);

      new Chart('graficoDistritos', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Encuestas por distrito',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Distribución de encuestas por distrito' }
          }
        }
      });
    });
  }
}
