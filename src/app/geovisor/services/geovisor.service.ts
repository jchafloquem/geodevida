import { ElementRef, Injectable } from '@angular/core';

//Libreria actual de ArcGIS 4.33
import '@arcgis/map-components/components/arcgis-search';
import { LayerConfig } from '../interface/layerConfig';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion.js';
import CSVLayer from '@arcgis/core/layers/CSVLayer';
import Expand from '@arcgis/core/widgets/Expand.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import Legend from '@arcgis/core/widgets/Legend.js';
import Map from '@arcgis/core/Map.js';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import MapView from '@arcgis/core/views/MapView.js';
import PopupTemplate from '@arcgis/core/PopupTemplate.js';
import proj4 from 'proj4';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Zoom from '@arcgis/core/widgets/Zoom.js';

import * as geometryEngineAsync from '@arcgis/core/geometry/geometryEngineAsync';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

//* POPUP & CLUSTERS
const popupPoligonoCultivo = new PopupTemplate({
  title: 'Tipo de Cultivo: {cultivo}',
  outFields: ['*'],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Datos del poligono de Cultivo: {nombre}</div>`,
    },
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'cod_dni',
          label: '<b><font>Codigo Unico del poligono:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'dni',
          label: '<b><font>DNI del productor:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'nombres',
          label: '<b><font>Nombre completo del productor:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'celular',
          label: '<b><font>Telefono del productor:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'region',
          label: '<b><font>Region del Cultivo:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'provincia',
          label: '<b><font>Provincia del Cultivo:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'distrito',
          label: '<b><font>Distrito del Cultivo:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'n_parcela',
          label: '<b><font>Numero del Cultivo:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'variedad',
          label: '<b><font>Variedad del Cultivo:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'org',
          label: '<b><font>Oficina Zonal:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'organizacion',
          label: '<b><font>Organizacion:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'fecha_regitro',
          label: '<b><font>Fecha de registro:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            dateFormat: 'short-date', // opciones: short-date, long-date
          },
        },
        {
          fieldName: 'area_cultivo',
          label: '<b><font>Area del Cultivo: (has)</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 3,
            digitSeparator: true,
          },
        },
      ],
    },
  ],
});
const popupLimitesOficinaZonal = new PopupTemplate({
  title: '',
  outFields: ['*'],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Ambito de la Oficina Zonal: {nombre}</div>`,
    },
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'oz_devida',
          label: '<b><font>Oficina Zonal:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'representante',
          label: '<b><font>Representante:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'direccion',
          label: '<b><font>Direccion:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'telefono ',
          label: '<b><font>Telefono:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'correo',
          label: '<b><font>Correo:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
        {
          fieldName: 'area_st',
          label: '<b><font>Area (M ha):</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 3,
            digitSeparator: true,
          },
        },
        {
          fieldName: 'perimetro_st',
          label: '<b><font>Perímetro (Km):</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 3,
            digitSeparator: true,
          },
        },
      ],
    },
  ],
});
const caribANP = new PopupTemplate({
  title: '',
  outFields: ['*'],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Area Natural Protegida: {nombre}</div>`,
    },
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'name_es',
          label: '<b><font>Nombre:</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
        },
      ],
    },
  ],
});
const caribZA = new PopupTemplate({
  title: '',
  outFields: ['*'],
  content: [
    {
      type: 'text',
      text: `
        <div style="text-align: center; font-weight: bold; font-size: 18px; color: #2E7D32; margin-bottom: 8px;">
          Zona de Amortiguamiento
          <br>
          <span style="font-size: 16px; color: #1565C0;">{c_nomb}</span>
        </div>
        <hr style="border-top: 1px solid #ccc; margin: 8px 0;">
      `,
    },
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'anp_nomb',
          label: 'Área Natural Protegida:',
          visible: true,
          stringFieldOption: 'text-box',
        },
      ],
    },
  ],
});
const restCaribSurveyPercepcionCacao = new PopupTemplate({
  // ✔️ Quitar el título evita el encabezado automático de Esri
  title: '',
  // ✔️ Este popup sobreescribe totalmente el predeterminado
  outFields: ['*'],
  expressionInfos: [
    {
      name: 'nombreTecnico',
      title: 'Técnico interpretado',
      expression: `
        var cod = $feature.tecnico;
        if (cod == "08") {
          return "Castolo Jose Ramos Cristobal";
        } else if (cod == "01") {
          return "Susana Lucia Velarde Rosales";
        } else if (cod == "03") {
          return "Felix Quispe Bendezu";
        } else if (cod == "06") {
          return "Dina Ayala Rodriguez";
        } else {
          return "Código desconocido: " + cod;
        }
      `,
    },
    {
      name: 'fechaHoraFormateada',
      title: 'Fecha y hora formateada',
      expression: `
        var f = $feature.fecha;
        if (IsEmpty(f)) {
          return "Sin fecha";
        }
        var dia = Text(f, 'DD');
        var mes = Text(f, 'MM');
        var anio = Text(f, 'YYYY');
        var hora = Text(f, 'HH');
        var minuto = Text(f, 'mm');
        return dia + "/" + mes + "/" + anio + " " + hora + ":" + minuto;
      `,
    },
    {
      name: 'fechaHoraFormateadaEnvio',
      title: 'Fecha y hora formateada',
      expression: `
        var f = $feature.EditDate;
        if (IsEmpty(f)) {
          return "Sin fecha";
        }
        var dia = Text(f, 'DD');
        var mes = Text(f, 'MM');
        var anio = Text(f, 'YYYY');
        var hora = Text(f, 'HH');
        var minuto = Text(f, 'mm');
        return dia + "/" + mes + "/" + anio + " " + hora + ":" + minuto;
      `,
    },
  ],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Nro PTA: {nro_pta}</div>`,
    },
    {
      type: 'text',
      text: `<div style="margin-top: 8px;"><b><font>Técnico:</font></b> {expression/nombreTecnico}</div>`,
    },
    {
      type: 'text',
      text: `<div><b><font>Fecha de monitoreo:</font></b> {expression/fechaHoraFormateada}</div>`,
    },
    {
      type: 'text',
      text: `<div><b><font>Fecha de Envío:</font></b> {expression/fechaHoraFormateadaEnvio}</div>`,
    },
    {
      type: 'attachments', // ✔️ Galería automática de imágenes
    },
  ],
});
const restCaribSurveyPercepcionCafe = new PopupTemplate({
  // ✔️ Quitar el título evita el encabezado automático de Esri
  title: '',
  // ✔️ Este popup sobreescribe totalmente el predeterminado
  outFields: ['*'],
  expressionInfos: [
    {
      name: 'nombreTecnico',
      title: 'Técnico interpretado',
      expression: `
        var cod = $feature.tecnico;
        if (cod == "08") {
          return "Castolo Jose Ramos Cristobal";
        } else if (cod == "01") {
          return "Susana Lucia Velarde Rosales";
        } else if (cod == "03") {
          return "Felix Quispe Bendezu";
        } else if (cod == "06") {
          return "Dina Ayala Rodriguez";
        } else {
          return "Código desconocido: " + cod;
        }
      `,
    },
    {
      name: 'fechaHoraFormateada',
      title: 'Fecha y hora formateada',
      expression: `
        var f = $feature.fecha;
        if (IsEmpty(f)) {
          return "Sin fecha";
        }
        var dia = Text(f, 'DD');
        var mes = Text(f, 'MM');
        var anio = Text(f, 'YYYY');
        var hora = Text(f, 'HH');
        var minuto = Text(f, 'mm');
        return dia + "/" + mes + "/" + anio + " " + hora + ":" + minuto;
      `,
    },
    {
      name: 'fechaHoraFormateadaEnvio',
      title: 'Fecha y hora formateada',
      expression: `
        var f = $feature.EditDate;
        if (IsEmpty(f)) {
          return "Sin fecha";
        }
        var dia = Text(f, 'DD');
        var mes = Text(f, 'MM');
        var anio = Text(f, 'YYYY');
        var hora = Text(f, 'HH');
        var minuto = Text(f, 'mm');
        return dia + "/" + mes + "/" + anio + " " + hora + ":" + minuto;
      `,
    },
  ],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Nro PTA: {nro_pta}</div>`,
    },
    {
      type: 'text',
      text: `<div style="margin-top: 8px;"><b><font>Técnico:</font></b> {expression/nombreTecnico}</div>`,
    },
    {
      type: 'text',
      text: `<div><b><font>Fecha de monitoreo:</font></b> {expression/fechaHoraFormateada}</div>`,
    },
    {
      type: 'text',
      text: `<div><b><font>Fecha de Envío:</font></b> {expression/fechaHoraFormateadaEnvio}</div>`,
    },
    {
      type: 'attachments', // ✔️ Galería automática de imágenes
    },
  ],
});
const cafeRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    color: [255, 0, 0, 0.8], // rojo
    outline: { color: [0, 0, 0], width: 1 },
    size: 10,
    style: 'circle',
  }),
});
const recopilacionRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    color: [139, 69, 19, 0.9], // café sólido
    outline: {
      color: [255, 255, 255, 1], // borde blanco como GPS
      width: 1,
    },
    size: 12,
    style: 'circle',
  }),
});
const restCaribRecopilacion = new PopupTemplate({
  title: 'Ficha de Recopilación',
  outFields: ['*'],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">
               PARTICIPANTE: {nombre_participante}
             </div>`,
    },
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'dni_participante',
          label: 'DNI del participante',
          visible: true,
        },
        {
          fieldName: 'objectid',
          label: 'ID interno',
          visible: false,
        },
        {
          fieldName: 'globalid',
          label: 'ID global',
          visible: false,
        },
      ],
    },
    {
      type: 'attachments',
    },
  ],
});

@Injectable({
  providedIn: 'root',
})
export class GeovisorSharedService {
  public mapa = new Map({ basemap: 'satellite' });
  public view: MapView | null = null;
  private highlightLayer = new GraphicsLayer({ id: 'highlight-overlaps' });

  // Método auxiliar para mostrar los mensajes toast.
  private showToast(
    mensaje: string,
    tipo: 'success' | 'error' = 'success',
    autoHide: boolean = true
  ): void {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.opacity = '0';
      toast.style.zIndex = '10000';
      document.body.appendChild(toast);
    }
    toast!.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;min-width:320px;">
        <span>${mensaje}</span>
        <button id="toast-close" style="background:none;border:none;color:white;font-weight:bold;cursor:pointer;">✖</button>
      </div>
    `;
    toast!.className = `
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      px-4 py-2 rounded shadow text-white
      ${tipo === 'success' ? 'bg-green-600' : 'bg-red-600'}
      text-center
      transition-opacity duration-500
    `;
    toast!.style.opacity = '1';

    if (autoHide) {
      setTimeout(() => (toast!.style.opacity = '0'), 10000);
    }
    document.getElementById('toast-close')?.addEventListener('click', () => {
      toast!.style.opacity = '0';
    });
  }

  //*SERVICIO SISCOD-DEVIDA
  public restApiDevida =
    'https://siscod.devida.gob.pe/server/rest/services/DPM_LIMITES_PIRDAIS/MapServer';
  public restCaribSurvey = {
    serviceBase:
      'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/ArcGIS/rest/services',
    capas: {
      infraestructura:
        'FICHA_DE_MONITOREO_TIPOLOGÍA_INFRAESTRUCTURA_vista/FeatureServer/0',
      cacao:
        'CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_–_PTA_DEVIDA_vista/FeatureServer/0',
      cafe: 'CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_%E2%80%93_CAFE_vista/FeatureServer/0',
      registroForestal: 'REGISTRO_FORESTAL_vista/FeatureServer/0',
      medidasAmbientales: 'MEDIDAS_AMBIENTALES_vista/FeatureServer/0',
      recopilacion:
        'survey123_b76b6ab3a7fa403384473a05b7ecce49_results/FeatureServer/0',
    },
  };
  public layers: LayerConfig[] = [
    //* (DEVIDA)
    {
      type: 'feature',
      title: 'POLIGONOS DE CULTIVO',
      url: this.restApiDevida,
      visible: true,
      opacity: 1,
      minScale: 0,
      maxScale: 0,
      group: '(PIRDAIS)',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 0, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
          popupTemplate: popupPoligonoCultivo,
        },
      ],
    },
    //* (SERFOR)
    {
      type: 'map-image',
      title: 'ANP - AREAS NATURALES PROTEGIDAS',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/OCAPAS_SERNANP/MapServer`,
      visible: false,
      opacity: 0.5,
      maxScale: 0,
      group: '(SERFOR)',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 5, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'map-image',
      title: 'MONITOREO DEFORESTACION',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/Monitoreo_Deforestacion_Tala/MapServer`,
      visible: false,
      opacity: 0.5,
      minScale: 0,
      maxScale: 0,
      group: '(SERFOR)',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 1, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'map-image',
      title: 'COMUNIDADES NATIVAS',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/OCAPAS_SERNANP/MapServer`,
      visible: false,
      opacity: 0.5,
      minScale: 0,
      maxScale: 0,
      group: '(SERFOR)',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 27, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'map-image',
      title: 'ZA-ZONAS DE AMORTIGUAMIENTO',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/OCAPAS_SERNANP/MapServer`,
      visible: false,
      opacity: 0.5,
      minScale: 0,
      maxScale: 0,
      group: '(SERFOR)',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 4, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'map-image',
      title: 'ACR-AREAS DE CONSERVACION REGIONAL',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/OCAPAS_SERNANP/MapServer`,
      visible: false,
      opacity: 0.5,
      minScale: 0,
      maxScale: 0,
      group: '(SERFOR)',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 6, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'feature',
      title: 'BPP-BOSQUE DE PRODUCCION PERMANENTE',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/Ordenamiento_Forestal/MapServer`,
      visible: true,
      opacity: 0.5,
      minScale: 0,
      maxScale: 0,
      group: '(SERFOR)',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 1, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'map-image',
      title: 'OFICINAS ZONALES',
      url: this.restApiDevida,
      visible: false,
      opacity: 1,
      minScale: 0,
      maxScale: 0,
      group: 'CARTOGRAFIA DEVIDA',

      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 5, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    //*(LIMITES POLITICOS)
    {
      type: 'map-image',
      title: 'DISTRITO',
      url: this.restApiDevida,
      visible: true,
      opacity: 0.9,
      minScale: 0,
      maxScale: 0,
      group: 'LIMITES POLITICOS',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 1, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'map-image',
      title: 'PROVINCIA',
      url: this.restApiDevida,
      visible: true,
      opacity: 0.9,
      minScale: 0,
      maxScale: 0,
      group: 'LIMITES POLITICOS',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 2, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'map-image',
      title: 'DEPARTAMENTO',
      url: this.restApiDevida,
      visible: true,
      opacity: 0.9,
      minScale: 0,
      maxScale: 0,
      group: 'LIMITES POLITICOS',
      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 3, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
      type: 'map-image',
      title: 'PERU',
      url: this.restApiDevida,
      visible: true,
      opacity: 0.9,
      minScale: 0,
      maxScale: 0,
      group: 'LIMITES POLITICOS',

      // 🔹 Aquí defines las subcapas visibles
      sublayers: [
        {
          id: 4, // 👈 cambia por el id real de la subcapa que quieras mostrar
          //title: 'Límites Oficina Zonal',
          visible: true,
          labelsVisible: true,
          minScale: 0,
          maxScale: 0,
        },
      ],
    },
    {
          type: 'feature',
          title: 'VISITAS DE MONITOREO',
          url: `${this.restCaribSurvey.serviceBase}/${this.restCaribSurvey.capas.recopilacion}`,
          labelingInfo: [],
          popupTemplate: restCaribRecopilacion,  // 🔹 Quitar temporalmente
          renderer: recopilacionRenderer,
          visible: false,
          labelsVisible: false,
          opacity: 1,
          group: 'PIRDAIS',
     },
  ];

  public lis: [] = [];
  public searchTerm = '';
  public filteredArray: [] = [];
  //* Footer coordenadas
  public gcsLongitude = '00.00';
  public gcsLatitude = '00.00';
  public utmZone = '00.00';
  public utmEast = '00.00';
  public utmNorth = '00.00';
  public scale = '00.00';
  public legend!: Legend;

  constructor() {
    this.mapa.add(this.highlightLayer);
  }

  initializeMap(mapViewEl: ElementRef): Promise<void> {
    this.layers.forEach((layerConfig) => {
      const hasValidLayerId = /\/\d+$/.test(layerConfig.url); // Ej. .../MapServer/0
      const isMapImage = /\/MapServer$/.test(layerConfig.url); // Ej. .../MapServer
      let layer: __esri.Layer;
      if (hasValidLayerId) {
        // 🔹 Es un FeatureLayer
        const layerOptions: __esri.FeatureLayerProperties = {
          url: layerConfig.url,
          title: layerConfig.title,
          visible: layerConfig.visible,
        };
        if (layerConfig.popupTemplate)
          layerOptions.popupTemplate = layerConfig.popupTemplate;
        if (layerConfig.renderer) layerOptions.renderer = layerConfig.renderer;
        if (layerConfig.labelingInfo)
          layerOptions.labelingInfo = layerConfig.labelingInfo;
        if (layerConfig.labelsVisible !== undefined) {
          layerOptions.labelsVisible = layerConfig.labelsVisible;
        }
        if (layerConfig.outFields)
          layerOptions.outFields = layerConfig.outFields;
        if (layerConfig.maxScale !== undefined)
          layerOptions.maxScale = layerConfig.maxScale;
        if (layerConfig.minScale !== undefined)
          layerOptions.minScale = layerConfig.minScale;
        if (layerConfig.featureReduction)
          layerOptions.featureReduction = layerConfig.featureReduction;
        if (layerConfig.opacity !== undefined)
          layerOptions.opacity = layerConfig.opacity;
        layer = new FeatureLayer(layerOptions);
      } else if (isMapImage) {
        // 🔹 Es un MapImageLayer
        const layerOptions: __esri.MapImageLayerProperties = {
          url: layerConfig.url,
          title: layerConfig.title,
          visible: layerConfig.visible,
          opacity: layerConfig.opacity ?? 1,
        };
        if (layerConfig.minScale !== undefined)
          layerOptions.minScale = layerConfig.minScale;
        if (layerConfig.maxScale !== undefined)
          layerOptions.maxScale = layerConfig.maxScale;
        if (layerConfig.sublayers)
          layerOptions.sublayers = layerConfig.sublayers;
        layer = new MapImageLayer(layerOptions);
      } else {
        // 🔹 Es un WebTileLayer
        layer = new WebTileLayer({
          urlTemplate: layerConfig.url,
          title: layerConfig.title,
          visible: layerConfig.visible,
          opacity: layerConfig.opacity ?? 1,
        });
      }
      this.mapa.add(layer);
    });

    //*Creacion de la Vista del Mapa
    this.view = new MapView({
      container: mapViewEl.nativeElement,
      map: this.mapa,
      center: [-74.0, -10.0],
      zoom: 6,
      rotation: 0,
      constraints: {
        maxZoom: 25,
        minZoom: 6,
        snapToZoom: false,
      },
      padding: { top: 0 },
      ui: {
        components: [],
      },
    });

    this.mapa.layers.on('after-add', (event) => {
      const lyr = event.item;
      //console.log('Nueva capa agregada:', lyr.title || lyr.id);

      // Forzar carga interna de la capa o sublayer
      if (lyr.type === 'feature') {
        (lyr as __esri.FeatureLayer)
          .load()
          .then(() => this.actualizarSelectCapas());
      } else if (lyr.type === 'map-image') {
        (lyr as __esri.MapImageLayer).sublayers?.forEach((sub) => {
          (sub as unknown as __esri.FeatureLayer)
            .load()
            .then(() => this.actualizarSelectCapas());
        });
      }
    });

    //*ESCALA DEL MAPA
    this.view.when(() => {
      this.actualizarSelectCapas();
      this.mapa.layers.on('change', () => {
        this.actualizarSelectCapas();
      });
      reactiveUtils.watch(
        () => this.view!.scale, // <- aquí el "!" le dice a TS que no es null
        (scale) => {
          this.scale = this.formatScale(scale);
        }
      );
    });
    //*CONTROLES DE FUNCION DEL MAPA (LADO DERECHO)
    const buscaCapasDEVIDA = [
      {
        layer: new FeatureLayer({
          url: `${this.restApiDevida}/0`,
        }),
        searchFields: ['dni', 'nombres'],
        displayField: 'nombres',
        exactMatch: true,
        outFields: ['*'],
        name: 'CULTIVOS',
        placeholder: 'Digite el DNI',
        maxResults: 1,
        maxSuggestions: 20,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
      {
        layer: new FeatureLayer({
          url: `${this.restCaribSurvey.serviceBase}/${this.restCaribSurvey.capas.recopilacion}`,
        }),
        searchFields: ['dni_participante', 'nombre_participante'],
        displayField: 'nombre_participante',
        exactMatch: true,
        outFields: ['*'],
        name: 'VISITAS DE MONITOREO',
        placeholder: 'Digite el DNI',
        maxResults: 10,
        maxSuggestions: 10,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
      {
        layer: new FeatureLayer({
          url: `${this.restApiDevida}/5`,
        }),
        searchFields: ['nombre'],
        displayField: 'nombre',
        exactMatch: false,
        outFields: ['*'],
        name: 'OFICINA ZONAL',
        placeholder: 'Nombre OZ',
        maxResults: 5,
        maxSuggestions: 5,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
    ];
    const searchElement = document.querySelector('arcgis-search') as any;
    if (searchElement) {
      searchElement.view = this.view;
      searchElement.sources = buscaCapasDEVIDA; // tus capas personalizadas
    }

    this.view.ui.add(new Zoom({ view: this.view }), {
      position: 'top-right',
      index: 1,
    });
    const homeEl = document.createElement('arcgis-home') as any;
    homeEl.autoDestroyDisabled = true; // 👈 evita que se destruya
    homeEl.view = this.view;
    this.view.ui.add(homeEl, { position: 'top-right', index: 2 });
    const locateEl = document.createElement('arcgis-locate') as any;
    locateEl.autoDestroyDisabled = true; // 👈 evita que se destruya
    locateEl.view = this.view;
    this.view.ui.add(locateEl, { position: 'top-right', index: 3 });
    //Nueva version del boton de Galeria de mapas
    const galleryEl = document.createElement('arcgis-basemap-gallery') as any;
    galleryEl.autoDestroyDisabled = true; // 👈 evita que se destruya
    galleryEl.view = this.view;
    const expand = new Expand({
      view: this.view,
      content: galleryEl,
      expandTooltip: 'Galería de Mapas Base',
      expandIcon: 'basemap',
    });
    this.view.ui.add(expand, { position: 'top-right', index: 4 });

    //*Funcion para importar Data (GeoJson)-Widget
    // --- Crear contenedor del widget ---
    const uploadEl = document.createElement('div');
    uploadEl.className = 'file-upload-widget p-2 bg-white rounded shadow';

    // --- Crear input de archivos ---
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.accept = '.json,.geojson,.csv'; // solo los formatos permitidos
    inputEl.style.cursor = 'pointer';
    inputEl.className = 'border rounded p-1';

    // Conectar evento change
    inputEl.addEventListener('change', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        this.dataImport(file).then(() => {
          target.value = ''; // limpiar input después de cargar
        });
      }
    });

    uploadEl.appendChild(inputEl); // Esto es clave para que se muestre el input

    // --- Crear Expand ---
    const expanduploadEl = new Expand({
      view: this.view,
      content: uploadEl,
      expandTooltip: 'Cargar archivo',
      expandIcon: 'upload',
    });

    // Añadir el widget a la vista
    this.view.ui.add(expanduploadEl, { position: 'top-right', index: 5 });

    // --- Función para ocultar o mostrar en móviles ---
    function toggleUploadWidget() {
      if (!expanduploadEl.container) return; // verificar que exista

      if (window.innerWidth < 768) {
        expanduploadEl.container.style.display = 'none'; // ocultar en móviles
        expanduploadEl.collapse(); // asegurar que esté cerrado
      } else {
        expanduploadEl.container.style.display = 'block'; // mostrar en desktop
      }
    }

    // Ejecutar al cargar
    toggleUploadWidget();

    // Escuchar cambios de tamaño de pantalla
    window.addEventListener('resize', toggleUploadWidget);

    //*Fin de Funcion para importar Data (GeoJson)-Widget
    // --- Crear contenedor del widget ---
    const uploadEl6 = document.createElement('div');
    uploadEl6.className = 'file-upload-widget p-2 bg-white rounded shadow';

    // Título
    const titleEl = document.createElement('div');
    titleEl.textContent = 'Selecciona capas para superposición:';
    titleEl.className = 'mb-2 font-semibold';
    uploadEl6.appendChild(titleEl);

    // Select multiple
    const selectEl = document.createElement('select');
    selectEl.multiple = true;
    selectEl.className = 'w-full p-1 border rounded mb-2';
    uploadEl6.appendChild(selectEl);

    // Botón analizar
    const buttonEl = document.createElement('button');
    buttonEl.textContent = '🔎 Analizar superposición';
    buttonEl.className = `
        px-4 py-1
        bg-blue-600 hover:bg-blue-700
        text-white font-semibold rounded
        text-base
        transition-colors
        mx-auto
        block
      `;
    uploadEl6.appendChild(buttonEl);

    // --- Llenar select con capas visibles ---
    const capasVisibles: __esri.FeatureLayer[] = [];
    this.mapa.layers.forEach((lyr) => {
      const layerType = (lyr as any).type;

      if (layerType === 'feature' && lyr.visible) {
        capasVisibles.push(lyr as __esri.FeatureLayer);
        const opt = document.createElement('option');
        opt.value = lyr.id;
        opt.text = (lyr as any).title || (lyr as any).name || lyr.id;
        selectEl.appendChild(opt);
      } else if (layerType === 'map-image' && lyr.visible) {
        const mapImg = lyr as __esri.MapImageLayer;
        mapImg.sublayers?.forEach((sub) => {
          if (sub.visible && 'queryFeatures' in sub) {
            const fl = sub as unknown as __esri.FeatureLayer;
            capasVisibles.push(fl);
            const opt = document.createElement('option');
            opt.value = fl.id.toString();
            opt.text =
              (sub as any).title || (sub as any).name || `${mapImg.title}`;
            selectEl.appendChild(opt);
          }
        });
      }
    });

    // --- Evento del botón ---
    buttonEl.onclick = async () => {
      try {
        await this.analizarSuperposicion();
      } catch (err) {
        console.error('Error en el análisis:', err);
      }
    };

    // --- Crear Expand ---
    const expandAnalisis = new Expand({
      view: this.view,
      content: uploadEl6,
      expandTooltip: 'Analizar superposición',
      expandIcon: 'analysis',
    });
    this.view.ui.add(expandAnalisis, { position: 'top-right', index: 6 });

    // --- Función para ocultar o mostrar widget en móviles ---
    function toggleAnalisisWidget() {
      if (!expandAnalisis.container) return;

      if (window.innerWidth < 768) {
        expandAnalisis.container.style.display = 'none'; // ocultar en móvil
        expandAnalisis.collapse(); // asegurar que esté cerrado
      } else {
        expandAnalisis.container.style.display = 'block'; // mostrar en desktop
      }
    }

    // Ejecutar al cargar
    toggleAnalisisWidget();

    // Escuchar cambios de tamaño de pantalla
    window.addEventListener('resize', toggleAnalisisWidget);
    this.legend = new Legend({
      view: this.view,
      container: document.createElement('div'),
    });
    const ccWidget = new CoordinateConversion({ view: this.view });
    if (this.view) {
      this.view.when(() => {
        this.view!.on('pointer-move', (event) => {
          // Convertir posición de pantalla a mapa
          const point = this.view!.toMap({
            x: event.x,
            y: event.y,
          }) as __esri.Point;

          if (point?.latitude != null && point?.longitude != null) {
            this.updateCoordinates(point.latitude, point.longitude);
          }
        });
      });
    }
    return this.view.when();
  } //*FIN <InitializeMap>
  destroyMap(): void {
    if (this.view) {
      this.view.container = null;
    }
  }
  //*Inicio del Toogle
  toggleLayerVisibility(layerTitle: string, visibility: boolean): void {
    const layer = this.mapa.layers.find((layer) => layer.title === layerTitle);
    if (layer) {
      layer.visible = visibility;
    }
  } //*Fin de toggleLayerVisibility
  //*Inicio carga de capa
  getLayerVisibility(layerTitle: string): boolean {
    const layer = this.mapa.layers.find((layer) => layer.title === layerTitle);
    return layer ? layer.visible : false;
  }
  private capas: Record<string, FeatureLayer> = {};
  getActiveLayers(): FeatureLayer[] {
    return Object.values(this.capas).filter((layer) => layer.visible);
  }
  //* Coordenadas
  async updateCoordinates(lat: number, lon: number): Promise<void> {
    this.gcsLatitude = lat.toFixed(5);
    this.gcsLongitude = lon.toFixed(5);
    // Calculate UTM Zone
    const zoneNumber = Math.floor((lon + 180) / 6) + 1;
    const utmBand = this.getUtmBand(lat);
    this.utmZone = `${zoneNumber} ${utmBand}`;
    const utm = latLonToUTM(lat, lon);
    this.utmZone = `${utm.zoneNumber} ${utm.zoneLetter}`;
    this.utmEast = `${utm.easting.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} m`;
    this.utmNorth = `${utm.northing.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} m`;
    function latLonToUTM(lat: number, lon: number) {
      const a = 6378137.0;
      const f = 1 / 298.257223563;
      const k0 = 0.9996;
      const zoneNumber = Math.floor((lon + 180) / 6) + 1;
      const lonOrigin = (zoneNumber - 1) * 6 - 180 + 3;
      const lonOriginRad = (lonOrigin * Math.PI) / 180;
      const latRad = (lat * Math.PI) / 180;
      const lonRad = (lon * Math.PI) / 180;
      const e = Math.sqrt(f * (2 - f));
      const N = a / Math.sqrt(1 - Math.pow(e * Math.sin(latRad), 2));
      const T = Math.tan(latRad) ** 2;
      const C = ((e * e) / (1 - e * e)) * Math.cos(latRad) ** 2;
      const A = Math.cos(latRad) * (lonRad - lonOriginRad);
      const M =
        a *
        ((1 - (e * e) / 4 - (3 * e ** 4) / 64 - (5 * e ** 6) / 256) * latRad -
          ((3 * e * e) / 8 + (3 * e ** 4) / 32 + (45 * e ** 6) / 1024) *
          Math.sin(2 * latRad) +
          ((15 * e ** 4) / 256 + (45 * e ** 6) / 1024) * Math.sin(4 * latRad) -
          ((35 * e ** 6) / 3072) * Math.sin(6 * latRad));
      const easting =
        k0 *
        N *
        (A +
          ((1 - T + C) * A ** 3) / 6 +
          ((5 - 18 * T + T ** 2 + 72 * C - 58 * ((e * e) / (1 - e * e))) *
            A ** 5) /
          120) +
        500000;
      let northing =
        k0 *
        (M +
          N *
          Math.tan(latRad) *
          (A ** 2 / 2 +
            ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 +
            ((61 -
              58 * T +
              T ** 2 +
              600 * C -
              330 * ((e * e) / (1 - e * e))) *
              A ** 6) /
            720));
      if (lat < 0) northing += 10000000;
      const bands = 'CDEFGHJKLMNPQRSTUVWX';
      const index = Math.floor((lat + 80) / 8);
      const zoneLetter = bands.charAt(index);
      return { easting, northing, zoneNumber, zoneLetter };
    }
  }
  getUtmBand(latitude: number): string {
    const bands = 'CDEFGHJKLMNPQRSTUVWX'; // Bands from 80S to 84N
    const index = Math.floor((latitude + 80) / 8);
    return bands.charAt(index);
  }
  formatScale(scale: number): string {
    return scale.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  async dataImport(
    file: File,
    coordType?: 'UTM' | 'GEOGRAFICA'
  ): Promise<void> {
    if (!file || !this.view || !this.mapa) return;
    const fileName = file.name.toLowerCase();

    if (
      !fileName.endsWith('.json') &&
      !fileName.endsWith('.geojson') &&
      !fileName.endsWith('.csv')
    ) {
      await this.showModal(
        'Formato no soportado. Solo se permiten archivos .json, .geojson o .csv',
        '⚠️ Error'
      );
      return;
    }

    const utmDefs: Record<string, string> = {
      '17S': '+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs',
      '18S': '+proj=utm +zone=18 +south +datum=WGS84 +units=m +no_defs',
      '19S': '+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs',
    };
    const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

    // 👉 reemplazo de prompt por select (tipo coordenadas)
    if (!coordType) {
      coordType = await this.showSelect<'UTM' | 'GEOGRAFICA'>(
        'Seleccione el tipo de coordenadas:',
        [
          { value: 'UTM', label: 'UTM' },
          { value: 'GEOGRAFICA', label: 'GEOGRÁFICA' },
        ]
      );
      if (!coordType) return;
    }

    // 👉 si eligió UTM, pedimos zona con otro select
    let utmZone: '17S' | '18S' | '19S' | undefined;
    if (coordType === 'UTM') {
      utmZone = await this.showSelect<'17S' | '18S' | '19S'>(
        'Seleccione la zona UTM:',
        [
          { value: '17S', label: '17S' },
          { value: '18S', label: '18S' },
          { value: '19S', label: '19S' },
        ]
      );
      if (!utmZone) return;
    }

    function reproyectarCoord(coord: number[]): number[] {
      if (!utmZone) return coord;
      return proj4(utmDefs[utmZone!], wgs84, coord);
    }

    function reproyectarGeoJSONGeometry(geom: any): any {
      if (!geom) return geom;
      const mapCoord = (c: number[]) => reproyectarCoord(c);
      switch (geom.type) {
        case 'Point':
          return { type: 'Point', coordinates: mapCoord(geom.coordinates) };
        case 'LineString':
        case 'MultiPoint':
          return {
            type: geom.type,
            coordinates: geom.coordinates.map(mapCoord),
          };
        case 'Polygon':
        case 'MultiLineString':
          return {
            type: geom.type,
            coordinates: geom.coordinates.map((ring: any) =>
              ring.map(mapCoord)
            ),
          };
        case 'MultiPolygon':
          return {
            type: 'MultiPolygon',
            coordinates: geom.coordinates.map((poly: any) =>
              poly.map((ring: any) => ring.map(mapCoord))
            ),
          };
        default:
          return geom;
      }
    }

    try {
      let geojson: any;
      let layer: __esri.Layer | null = null;

      if (fileName.endsWith('.csv')) {
        const blobUrl = URL.createObjectURL(file);
        layer = new CSVLayer({ url: blobUrl, title: file.name });
      } else {
        const text = await file.text();
        geojson = JSON.parse(text);
      }

      if (!layer && geojson) {
        const validFeatures =
          geojson.features?.filter((f: any) => f.geometry) || [];
        if (validFeatures.length === 0) {
          await this.showModal(
            'El archivo no contiene geometrías válidas para mostrar en el mapa.',
            '⚠️ Error'
          );
          return;
        }

        // --- contar polígonos ---
        const polygonCount = validFeatures.filter(
          (f: any) =>
            f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
        ).length;

        const featuresProcesadas = validFeatures.map((f: any) => ({
          ...f,
          geometry: reproyectarGeoJSONGeometry(f.geometry),
        }));

        const blob = new Blob(
          [
            JSON.stringify({
              type: 'FeatureCollection',
              features: featuresProcesadas,
            }),
          ],
          { type: 'application/json' }
        );
        const blobUrl = URL.createObjectURL(blob);

        const sampleGeom = featuresProcesadas[0].geometry;
        let renderer: any;
        if (!sampleGeom) {
          renderer = undefined;
        } else if (
          sampleGeom.type === 'Point' ||
          sampleGeom.type === 'MultiPoint'
        ) {
          renderer = {
            type: 'simple',
            symbol: {
              type: 'simple-marker',
              color: [0, 128, 255, 0.8],
              size: 8,
              outline: { color: [0, 0, 0, 0.8], width: 1 },
            },
          };
        } else if (
          sampleGeom.type === 'LineString' ||
          sampleGeom.type === 'MultiLineString'
        ) {
          renderer = {
            type: 'simple',
            symbol: {
              type: 'simple-line',
              color: [0, 255, 0, 0.8],
              width: 2,
            },
          };
        } else if (
          sampleGeom.type === 'Polygon' ||
          sampleGeom.type === 'MultiPolygon'
        ) {
          renderer = {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [0, 0, 255, 0.3],
              outline: { color: [255, 0, 0, 1], width: 1 },
            },
          };
        }

        layer = new GeoJSONLayer({ url: blobUrl, title: file.name, renderer });

        // --- mostrar cantidad de polígonos ---
        if (polygonCount > 0) {
          //console.log(`📌 Se importaron ${polygonCount} polígonos`);
          await this.showModal(
            `Se importaron ${polygonCount} polígonos.`,
            '✅ Importación exitosa'
          );
        }
      }

      if (!layer) return;

      this.mapa.add(layer);

      layer
        .when(() => {
          if (layer!.fullExtent && this.view) {
            this.view
              .goTo(layer!.fullExtent)
              .catch((err) =>
                console.warn('No se pudo hacer zoom a la capa:', err)
              );
          }
          this.showModal(
            `Capa "${file.name}" cargada correctamente.`,
            '✅ Éxito'
          );
        })
        .catch((err) => {
          console.error('Error cargando la capa:', err);
          this.showModal(
            'Ocurrió un error cargando la capa. Revisa la consola.',
            '⚠️ Error'
          );
        });
    } catch (err) {
      console.error('Error procesando el archivo:', err);
      this.showModal(
        'Ocurrió un error procesando el archivo. Revisa la consola.',
        '⚠️ Error'
      );
    }
  }
  private showModal(
    message: string,
    typeOrTitle?: 'success' | 'error' | 'info' | string,
    title?: string
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      // mapa de iconos y títulos por defecto
      const icons: Record<'success' | 'error' | 'info', string> = {
        success: '✅',
        error: '⚠️',
        info: 'ℹ️',
      };
      const defaultTitles: Record<'success' | 'error' | 'info', string> = {
        success: 'Éxito',
        error: 'Error',
        info: 'Aviso',
      };

      // determinar type y título final según lo que se pase
      let type: 'success' | 'error' | 'info' = 'info';
      let finalTitle: string | undefined = title;

      if (typeof typeOrTitle === 'string') {
        // si es exactamente uno de los tipos
        if (
          typeOrTitle === 'success' ||
          typeOrTitle === 'error' ||
          typeOrTitle === 'info'
        ) {
          type = typeOrTitle;
        } else if (typeOrTitle.includes('✅')) {
          type = 'success';
          finalTitle = typeOrTitle;
        } else if (typeOrTitle.includes('⚠️')) {
          type = 'error';
          finalTitle = typeOrTitle;
        } else if (typeOrTitle.includes('ℹ️')) {
          type = 'info';
          finalTitle = typeOrTitle;
        } else {
          // si no contiene emoji ni es literal tipo, lo tratamos como título personalizado
          finalTitle = typeOrTitle;
        }
      }

      const icon = icons[type];
      const header = finalTitle || defaultTitles[type];

      const wrapper = document.createElement('div');
      wrapper.className =
        'modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';

      wrapper.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 w-96">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-3">${icon}</span>
            <h2 class="text-lg font-bold">${header}</h2>
          </div>
          <p class="mb-4">${message}</p>
          <div class="flex justify-end">
            <button id="modalOk" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Aceptar</button>
          </div>
        </div>
      `;
      document.body.appendChild(wrapper);

      const btn = wrapper.querySelector<HTMLButtonElement>('#modalOk')!;
      btn.onclick = () => {
        wrapper.remove();
        resolve();
      };

      // opcional: cerrar con ESC
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          wrapper.remove();
          window.removeEventListener('keydown', onKey);
          resolve();
        }
      };
      window.addEventListener('keydown', onKey);
    });
  }
  private showSelect<T extends string>(
    label: string,
    options: { value: T; label: string }[]
  ): Promise<T | undefined> {
    return new Promise<T | undefined>((resolve) => {
      const wrapper = document.createElement('div');
      wrapper.className =
        'modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';

      wrapper.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 w-96">
          <div class="flex items-center mb-4">
            <span class="text-2xl mr-2">📌</span>
            <h2 class="text-lg font-bold">Seleccione una opción</h2>
          </div>
          <p class="mb-2">${label}</p>
          <select id="modalSelect" class="p-2 border rounded w-full mb-4">
            <option value="">-- Seleccione --</option>
            ${options
          .map((o) => `<option value="${o.value}">${o.label}</option>`)
          .join('')}
          </select>
          <button id="modalOk" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Aceptar</button>
        </div>
      `;
      document.body.appendChild(wrapper);

      const select = wrapper.querySelector<HTMLSelectElement>('#modalSelect')!;
      const btn = wrapper.querySelector<HTMLButtonElement>('#modalOk')!;

      btn.onclick = () => {
        const value = select.value as T;
        wrapper.remove();
        resolve(value || undefined);
      };
    });
  }
  // Funcion que analiza la superposicion de una capa con la capa BPP
  async analizarSuperposicion(): Promise<void> {
    if (!this.view || !this.mapa) return;
    this.highlightLayer.removeAll();

    // --- Overlay de carga ---
    let overlay = document.getElementById("loading-overlay") as HTMLDivElement | null;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "loading-overlay";
      Object.assign(overlay.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
        color: "#fff",
        fontSize: "1.2rem",
      });
      const spinner = document.createElement("div");
      spinner.className = "animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white";
      const text = document.createElement("div");
      text.id = "progress-text";
      text.textContent = "Analizando superposición, por favor espere...";
      text.style.marginLeft = "10px";
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.appendChild(spinner);
      container.appendChild(text);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
    }
    overlay.style.display = "flex";

    const progressText = document.getElementById("progress-text")!;
    let overlaps: __esri.Graphic[] = [];
    let intersectedFeaturesB: __esri.Graphic[] = []; // <-- Array de polígonos intersectados
    let capaBTitle = "la capa seleccionada";

    try {
      // --- Cargar capa SERFOR ---
      progressText.textContent = "🔹Cargando la capa Bosque Proteccion Permanente (SERFOR)...!";
      const capaSerfor = new FeatureLayer({
        url: "https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/Ordenamiento_Forestal/MapServer/1",

      });
      await capaSerfor.load();

      const featuresA: __esri.Graphic[] = [];
      const num = 2000;
      for (let startA = 0;; startA += num) {
        const res = await capaSerfor.queryFeatures({
          where: "1=1",
          outFields: ["*"],
          returnGeometry: true,
          start: startA,
          num,

        });
        featuresA.push(...res.features);
        if (res.features.length < num) break;
      }

      const validGeometriesA = featuresA
        .map(f => f.geometry)
        .filter((g): g is __esri.Polygon => !!g && ["polygon", "multipolygon"].includes(g.type.toLowerCase()));

      if (!validGeometriesA.length) {
        this.showToast("⚠️ No hay geometrías válidas en BPP-SERFOR.", "error");
        overlay.style.display = "none";
        return;
      }

      const geomA = await geometryEngineAsync.union(validGeometriesA) as __esri.GeometryUnion;
      if (!geomA) {
        this.showToast("⚠️ No se pudieron unir las geometrías de SERFOR.", "error");
        overlay.style.display = "none";
        return;
      }

      // --- Obtener capa seleccionada ---
      const selectEl = document.querySelector<HTMLSelectElement>(".file-upload-widget select");
      if (!selectEl) { overlay.style.display = "none"; return; }
      const selectedId = selectEl.value;
      if (!selectedId) {
        this.showToast("⚠️ Selecciona una capa para analizar.", "error");
        overlay.style.display = "none";
        return;
      }

      let capaB: __esri.Layer | undefined = this.mapa.layers.find(l => l.id === selectedId);
      if (!capaB) {
        for (const l of this.mapa.layers.toArray()) {
          if (l.type === "map-image") {
            const mapImg = l as __esri.MapImageLayer;
            const sub = mapImg.sublayers?.find(s => s.id.toString() === selectedId);
            if (sub) { capaB = sub as unknown as __esri.Layer; break; }
          }
        }
      }
      if (!capaB) {
        this.showToast("⚠️ No se encontró la capa seleccionada en el mapa.", "error");
        overlay.style.display = "none";
        return;
      }
      capaBTitle = capaB.title || capaB.id;
      progressText.textContent = `⏳ Analizando superposición con la capa: ${capaBTitle}`;
      await capaB.load?.();

      // --- Cargar features de la capa B ---
      let featuresB: __esri.Graphic[] = [];
      if ("queryFeatures" in capaB) {
        for (let startB = 0;; startB += num) {
          const resB = await (capaB as __esri.FeatureLayer).queryFeatures({
            where: "1=1",
            outFields: ["*"],
            returnGeometry: true,
            start: startB,
            num
          });
          featuresB.push(...resB.features);
          if (resB.features.length < num) break;
        }
      } else if ("source" in capaB) {
        featuresB = ((capaB as any).source as __esri.Collection<__esri.Graphic>).toArray();
      }

      if (!featuresB.length) {
        this.showToast("⚠️ La capa seleccionada no contiene geometrías.", "error");
        overlay.style.display = "none";
        return;
      }

      // --- Procesamiento por bloques ---
      const blockSize = 25;
      overlaps = [];
      intersectedFeaturesB = [];
      for (let i = 0; i < featuresB.length; i += blockSize) {
        const block = featuresB.slice(i, i + blockSize);
        const promises = block.map(fB => (async () => {
          if (!fB.geometry || !["polygon", "multipolygon"].includes(fB.geometry.type.toLowerCase())) return null;
          const intersecta = await geometryEngineAsync.intersects(fB.geometry as __esri.GeometryUnion, geomA);
          if (intersecta) {
            intersectedFeaturesB.push(fB); // <-- guardamos la feature de B
            return new Graphic({
              geometry: fB.geometry,
              attributes: { capaA: "Ordenamiento Forestal", capaB: capaB.title || capaB.id, ...fB.attributes },
              symbol: { type: "simple-fill", color: [255, 0, 0, 0.4], outline: { color: [255, 0, 0], width: 2 } } as any,
              popupTemplate: {
                title: "Superposición detectada",
                content: `Polígono de <b>${capaB.title || capaB.id}</b> se superpone con <b>Ordenamiento Forestal</b>.`
              }
            });
          }
          return null;
        })());
        const results = await Promise.all(promises);
        overlaps.push(...results.filter(r => r !== null) as __esri.Graphic[]);
        progressText.innerHTML = `Procesadas ${Math.min(i + blockSize, featuresB.length)} de ${featuresB.length} features<br>Superposiciones detectadas: ${overlaps.length}`;
        await new Promise(r => setTimeout(r, 0));
      }

      this.highlightLayer.addMany(overlaps);

    } catch (error) {
      console.error("Error analizando superposiciones:", error);
      this.showToast("❌ Ocurrió un error al analizar superposiciones.", "error");
    } finally {
      const overlapsCount = overlaps.length;

      // 🔹 Ocultar overlay
      if (overlay) overlay.style.display = "none";

      // 🔹 Modal interactivo con exportación CSV
      const modal = document.createElement("div");
      modal.id = "resultado-modal";
      Object.assign(modal.style, {
        position: "fixed",
        top: "0", left: "0",
        width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "10001",
      });

      const csvButton = intersectedFeaturesB.length > 0
        ? `<button id="export-csv"
            style="
              margin-top:10px;
              padding:6px 12px;
              background-color:#16A34A;
              color:white;
              border:none;
              border-radius:6px;
              font-weight:bold;
              cursor:pointer;
              transition: background-color 0.3s;
            "
            onmouseover="this.style.backgroundColor='#15803D'"
            onmouseout="this.style.backgroundColor='#16A34A'">
            Exportar CSV
          </button>`
        : '';

      modal.innerHTML = `
        <div style="background:white;padding:20px;border-radius:8px;max-width:450px;text-align:center;">
          <h2>Resultado del análisis</h2>
          <p>${overlapsCount > 0 ? `Se encontraron ${overlapsCount} superposiciones en ${capaBTitle}.` : `No se encontraron superposiciones.`}</p>
          ${csvButton}
          <button id="modal-close"
              style="
                margin-top:10px;
                padding:6px 12px;
                background-color:#2563EB;
                color:white;
                border:none;
                border-radius:6px;
                font-weight:bold;
                cursor:pointer;
                transition: background-color 0.3s;
              "
              onmouseover="this.style.backgroundColor='#1D4ED8'"
              onmouseout="this.style.backgroundColor='#2563EB'">
              Cerrar
          </button>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector<HTMLButtonElement>("#modal-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          modal.remove();
          this.highlightLayer.removeAll();
        });
      }

      const exportBtn = modal.querySelector<HTMLButtonElement>("#export-csv");
      if (exportBtn) {
        exportBtn.addEventListener("click", () => {
          if (!intersectedFeaturesB.length) return;

          const keys = Object.keys(intersectedFeaturesB[0].attributes);
          const csvContent = [
            keys.join(","), // encabezado
            ...intersectedFeaturesB.map(f =>
              keys.map(k => `"${(f.attributes[k] ?? '').toString().replace(/"/g, '""')}"`).join(",")
            )
          ].join("\n");

          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `superposiciones_${capaBTitle}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }

      // 🔹 Toast resumen
      const toastMessage = overlapsCount > 0
        ? `✅ Se encontraron ${overlapsCount} superposiciones en ${capaBTitle}.`
        : `✅ No se encontraron superposiciones en la capa seleccionada.`;
      this.showToast(toastMessage, "success", false);
    }
  }


  //Funcion para actualizar las capas del Visor
  actualizarSelectCapas() {
    const selectEl = document.querySelector<HTMLSelectElement>(
      '.file-upload-widget select'
    );
    if (!selectEl) return;
    // Limpiar opciones existentes
    selectEl.innerHTML = '';
    const capasExcluir = [
      'DISTRITO',
      'PROVINCIA',
      'DEPARTAMENTO',
      'PERU',
      'OFICINAS ZONALES',
      'BPP-BOSQUE DE PRODUCCION PERMANENTE',
      'ANP - AREAS NATURALES PROTEGIDAS',
      'MONITOREO DEFORESTACION',
      'COMUNIDADES NATIVAS',
      'ZA-ZONAS DE AMORTIGUAMIENTO',
      'ACR-AREAS DE CONSERVACION REGIONAL',
    ];
    this.mapa.layers.toArray().forEach((lyr) => {
      const tituloLyr = lyr.title?.toUpperCase() || '';
      // Ignorar capas excluidas
      if (capasExcluir.includes(tituloLyr)) return;
      if (
        lyr.type === 'feature' ||
        lyr.type === 'geojson' ||
        lyr.type === 'csv'
      ) {
        // Para capas FeatureLayer, CSVLayer o GeoJSONLayer
        const opt = document.createElement('option');
        opt.value = lyr.id;
        opt.text = lyr.title || lyr.id;
        selectEl.appendChild(opt);
      } else if (lyr.type === 'map-image') {
        (lyr as __esri.MapImageLayer).sublayers?.forEach((sub) => {
          const tituloSub = (sub as any).title?.toUpperCase() || '';
          if (capasExcluir.includes(tituloSub)) return;
          const opt = document.createElement('option');
          opt.value = sub.id.toString();
          opt.text = (sub as any).title || `${lyr.title}`;
          selectEl.appendChild(opt);
        });
      }
    });
  }
}
