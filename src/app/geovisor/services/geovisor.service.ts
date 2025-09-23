import { ElementRef, Injectable } from '@angular/core';

//Libreria actual de ArcGIS 4.33
import "@arcgis/map-components/components/arcgis-search";
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion.js';
import Expand from '@arcgis/core/widgets/Expand.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Legend from '@arcgis/core/widgets/Legend.js';
import Map from '@arcgis/core/Map.js';
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import MapView from '@arcgis/core/views/MapView.js';
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import Zoom from '@arcgis/core/widgets/Zoom.js';

import { LayerConfig } from '../interface/layerConfig';

import * as JSZip from 'jszip';
import { DOMParser } from 'xmldom';
import * as toGeoJSON from '@tmcw/togeojson';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import KMLLayer from '@arcgis/core/layers/KMLLayer';
import CSVLayer from '@arcgis/core/layers/CSVLayer';
import proj4 from "proj4";

import FileUpload from "@arcgis/core/widgets/Widget";







//* POPUP & CLUSTERS
const popupPoligonoCultivo = new PopupTemplate({
  title: 'Tipo de Cultivo: {cultivo}',
  outFields: ['*'],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Datos del poligono de Cultivo: {nombre}</div>`
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
            dateFormat: "short-date" // opciones: short-date, long-date
          }
        },
        {
          fieldName: 'area_cultivo',
          label: '<b><font>Area del Cultivo: (has)</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 3,
            digitSeparator: true
          }
        },
      ]
    },
  ]
});
const popupLimitesOficinaZonal = new PopupTemplate({
  title: '',
  outFields: ['*'],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Ambito de la Oficina Zonal: {nombre}</div>`
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
            digitSeparator: true
          }
        },
        {
          fieldName: 'perimetro_st',
          label: '<b><font>Perímetro (Km):</font></b>',
          visible: true,
          stringFieldOption: 'text-box',
          format: {
            places: 3,
            digitSeparator: true
          }
        }
      ]
    },
  ]
});
const caribANP = new PopupTemplate({
  title: '',
  outFields: ['*'],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Area Natural Protegida: {nombre}</div>`
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
      ]
    },
  ]
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
      `
    },
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'anp_nomb',
          label: 'Área Natural Protegida:',
          visible: true,
          stringFieldOption: 'text-box'
        }
      ]
    }
  ]
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
      `
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
      `
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
      `
    }
  ],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Nro PTA: {nro_pta}</div>`
    },
    {
      type: 'text',
      text: `<div style="margin-top: 8px;"><b><font>Técnico:</font></b> {expression/nombreTecnico}</div>`
    },
    {
      type: 'text',
      text: `<div><b><font>Fecha de monitoreo:</font></b> {expression/fechaHoraFormateada}</div>`
    },
    {
      type: 'text',
      text: `<div><b><font>Fecha de Envío:</font></b> {expression/fechaHoraFormateadaEnvio}</div>`
    },
    {
      type: 'attachments' // ✔️ Galería automática de imágenes
    }
  ]
})
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
      `
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
      `
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
      `
    }
  ],
  content: [
    {
      type: 'text',
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">Nro PTA: {nro_pta}</div>`
    },
    {
      type: 'text',
      text: `<div style="margin-top: 8px;"><b><font>Técnico:</font></b> {expression/nombreTecnico}</div>`
    },
    {
      type: 'text',
      text: `<div><b><font>Fecha de monitoreo:</font></b> {expression/fechaHoraFormateada}</div>`
    },
    {
      type: 'text',
      text: `<div><b><font>Fecha de Envío:</font></b> {expression/fechaHoraFormateadaEnvio}</div>`
    },
    {
      type: 'attachments' // ✔️ Galería automática de imágenes
    }
  ]
});
const cafeRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    color: [255, 0, 0, 0.8],      // rojo
    outline: { color: [0, 0, 0], width: 1 },
    size: 10,
    style: "circle"
  })
});
const recopilacionRenderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    color: [139, 69, 19, 0.9],   // café sólido
    outline: {
      color: [255, 255, 255, 1], // borde blanco como GPS
      width: 1
    },
    size: 12,
    style: "circle"
  })
});
const restCaribRecopilacion = new PopupTemplate({
  title: "Ficha de Recopilación",
  outFields: ["*"],
  content: [
    {
      type: "text",
      text: `<div style="text-align: center; font-weight: bold; font-size: 16px;">
               PARTICIPANTE: {nombre_participante}
             </div>`
    },
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "dni_participante",
          label: "DNI del participante",
          visible: true
        },
        {
          fieldName: "objectid",
          label: "ID interno",
          visible: false
        },
        {
          fieldName: "globalid",
          label: "ID global",
          visible: false
        }
      ]
    },
    {
      type: "attachments"
    }
  ]
});

@Injectable({
  providedIn: 'root',
})
export class GeovisorSharedService {
  public mapa = new Map({ basemap: 'satellite' });
  public view: MapView | null = null;

  //*SERVICIO SISCOD-DEVIDA
  public restApiDevida = 'https://siscod.devida.gob.pe/server/rest/services/DPM_LIMITES_PIRDAIS/MapServer';
  public restCaribSurvey = {
    serviceBase: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/ArcGIS/rest/services',
    capas: {
      infraestructura: 'FICHA_DE_MONITOREO_TIPOLOGÍA_INFRAESTRUCTURA_vista/FeatureServer/0',
      cacao: 'CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_–_PTA_DEVIDA_vista/FeatureServer/0',
      cafe: 'CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_%E2%80%93_CAFE_vista/FeatureServer/0',
      registroForestal: 'REGISTRO_FORESTAL_vista/FeatureServer/0',
      medidasAmbientales: 'MEDIDAS_AMBIENTALES_vista/FeatureServer/0',
      recopilacion: 'survey123_b76b6ab3a7fa403384473a05b7ecce49_results/FeatureServer/0'
    }
  }
  public layers: LayerConfig[] = [
    {
      type: 'map-image',
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
          popupTemplate: popupPoligonoCultivo
        }
      ]
    },

    //* (SERFOR)

    {
      type: 'map-image',
      title: 'MONITOREO DEFORESTACION',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/Monitoreo_Deforestacion_Tala/MapServer`,
      visible: false,
      opacity: 0.2,
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
        }
      ]
    },
    {
      type: 'map-image',
      title: 'COMUNIDADES NATIVAS',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/OCAPAS_SERNANP/MapServer`,
      visible: false,
      opacity: 0.2,
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
        }
      ]
    },
    {
      type: 'map-image',
      title: 'ZA - ZONAS DE AMORTIGUAMIENTO',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/OCAPAS_SERNANP/MapServer`,
      visible: false,
      opacity: 0.65,
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
        }
      ]
    },
    {
      type: 'map-image',
      title: 'ACR - AREAS DE CONSERVACION REGIONAL',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/OCAPAS_SERNANP/MapServer`,
      visible: false,
      opacity: 0.65,
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
        }
      ]
    },
    {
      type: 'map-image',
      title: 'BPP - BOSQUE DE PRODUCCION PERMANENTE',
      url: `https://geo.serfor.gob.pe/geoservicios/rest/services/Visor/Ordenamiento_Forestal/MapServer`,
      visible: false,
      opacity: 0.65,
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
        }
      ]
    },



    {
      type: 'map-image',
      title: 'OFICINAS ZONALES',
      url: this.restApiDevida,
      visible: false,
      opacity: 0.9,
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
        }
      ]
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
        }
      ]
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
        }
      ]
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
        }
      ]
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
        }
      ]
    },
    /*     {
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
        }, */
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

  constructor() { }
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
        if (layerConfig.popupTemplate) layerOptions.popupTemplate = layerConfig.popupTemplate;
        if (layerConfig.renderer) layerOptions.renderer = layerConfig.renderer;
        if (layerConfig.labelingInfo) layerOptions.labelingInfo = layerConfig.labelingInfo;
        if (layerConfig.labelsVisible !== undefined) {
          layerOptions.labelsVisible = layerConfig.labelsVisible;
        }
        if (layerConfig.outFields) layerOptions.outFields = layerConfig.outFields;
        if (layerConfig.maxScale !== undefined) layerOptions.maxScale = layerConfig.maxScale;
        if (layerConfig.minScale !== undefined) layerOptions.minScale = layerConfig.minScale;
        if (layerConfig.featureReduction) layerOptions.featureReduction = layerConfig.featureReduction;
        if (layerConfig.opacity !== undefined) layerOptions.opacity = layerConfig.opacity;
        layer = new FeatureLayer(layerOptions);
      } else if (isMapImage) {
        // 🔹 Es un MapImageLayer
        const layerOptions: __esri.MapImageLayerProperties = {
          url: layerConfig.url,
          title: layerConfig.title,
          visible: layerConfig.visible,
          opacity: layerConfig.opacity ?? 1,
        };
        if (layerConfig.minScale !== undefined) layerOptions.minScale = layerConfig.minScale;
        if (layerConfig.maxScale !== undefined) layerOptions.maxScale = layerConfig.maxScale;
        if (layerConfig.sublayers) layerOptions.sublayers = layerConfig.sublayers;
        layer = new MapImageLayer(layerOptions);
      } else {
        // 🔹 Es un WebTileLayer
        layer = new WebTileLayer({
          urlTemplate: layerConfig.url,
          title: layerConfig.title,
          visible: layerConfig.visible,
          opacity: layerConfig.opacity ?? 1
        });
      }
      this.mapa.add(layer);
    });

    //*Creacion de la Vista del Mapa
    this.view = new MapView({
      container: mapViewEl.nativeElement,
      map: this.mapa,
      center: [-74.00000, -10.00000],
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
    //*ESCALA DEL MAPA
    this.view.when(() => {
      reactiveUtils.watch(
        () => this.view!.scale,   // <- aquí el "!" le dice a TS que no es null
        (scale) => {
          this.scale = this.formatScale(scale);
        }
      );
    });
    //*CONTROLES DE FUNCION DEL MAPA (LADO DERECHO)
    const buscaCapasDEVIDA = [
      {
        layer: new FeatureLayer({
          url: `${this.restApiDevida}/0`
        }),
        searchFields: ["dni", "nombres"],
        displayField: "nombres",
        exactMatch: true,
        outFields: ["*"],
        name: "CULTIVOS",
        placeholder: "Digite el DNI",
        maxResults: 1,
        maxSuggestions: 20,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
      {
        layer: new FeatureLayer({
          url: `${this.restCaribSurvey.serviceBase}/${this.restCaribSurvey.capas.recopilacion}`
        }),
        searchFields: ["dni_participante", "nombre_participante"],
        displayField: "nombre_participante",
        exactMatch: true,
        outFields: ["*"],
        name: "VISITAS DE MONITOREO",
        placeholder: "Digite el DNI",
        maxResults: 10,
        maxSuggestions: 10,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
      {
        layer: new FeatureLayer({
          url: `${this.restApiDevida}/5`
        }),
        searchFields: ["nombre"],
        displayField: "nombre",
        exactMatch: false,
        outFields: ["*"],
        name: "OFICINA ZONAL",
        placeholder: "Nombre OZ",
        maxResults: 5,
        maxSuggestions: 5,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
    ]
    const searchElement = document.querySelector("arcgis-search") as any;
    if (searchElement) {
      searchElement.view = this.view;
      searchElement.sources = buscaCapasDEVIDA; // tus capas personalizadas
    }

    this.view.ui.add(new Zoom({ view: this.view }), { position: 'top-right', index: 1 });
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
      expandIcon: 'basemap'
    });

    this.view.ui.add(expand, { position: 'top-right', index: 4 });

    const uploadEl = document.createElement("div");
    uploadEl.className = "file-upload-widget p-2 bg-white rounded shadow";

    // Crear el input de archivos dentro del contenedor
    const inputEl = document.createElement("input");
    inputEl.type = "file";
    //inputEl.accept = ".kml,.kmz,.geojson,.json,.csv,.zip";
    inputEl.accept = ".json,.geojson,.csv";
    inputEl.style.cursor = "pointer";
    inputEl.className = "border rounded p-1";

    // Conectar el evento change
    inputEl.addEventListener("change", (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        this.dataImport(file); // tu función de carga de capas
      }
    }); uploadEl.appendChild(inputEl);

    // Crear un Expand para integrarlo al MapView
    const expanduploadEl = new Expand({
      view: this.view,
      content: uploadEl,
      expandTooltip: "Cargar archivo",
      expandIcon: "upload" // icono de subida
    });

    // Añadir el widget a la vista
    this.view.ui.add(expanduploadEl, { position: 'top-right', index: 5 });





    this.legend = new Legend({ view: this.view, container: document.createElement('div') });

    const ccWidget = new CoordinateConversion({ view: this.view });
    if (this.view) {
      this.view.when(() => {
        this.view!.on('pointer-move', (event) => {
          // Convertir posición de pantalla a mapa
          const point = this.view!.toMap({ x: event.x, y: event.y }) as __esri.Point;

          if (point?.latitude != null && point?.longitude != null) {
            this.updateCoordinates(point.latitude, point.longitude);
          }
        });
      });
    }
    return this.view.when();
  } //*FIN <InitializeMap>
  destroyMap(): void {
    if (this.view) { this.view.container = null }
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
    this.utmEast = `${utm.easting.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;
    this.utmNorth = `${utm.northing.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;
    function latLonToUTM(lat: number, lon: number) {
      const a = 6378137.0;
      const f = 1 / 298.257223563;
      const k0 = 0.9996;
      const zoneNumber = Math.floor((lon + 180) / 6) + 1;
      const lonOrigin = (zoneNumber - 1) * 6 - 180 + 3;
      const lonOriginRad = lonOrigin * Math.PI / 180;
      const latRad = lat * Math.PI / 180;
      const lonRad = lon * Math.PI / 180;
      const e = Math.sqrt(f * (2 - f));
      const N = a / Math.sqrt(1 - Math.pow(e * Math.sin(latRad), 2));
      const T = Math.tan(latRad) ** 2;
      const C = (e * e) / (1 - e * e) * Math.cos(latRad) ** 2;
      const A = Math.cos(latRad) * (lonRad - lonOriginRad);
      const M = a * (
        (1 - e * e / 4 - 3 * e ** 4 / 64 - 5 * e ** 6 / 256) * latRad
        - (3 * e * e / 8 + 3 * e ** 4 / 32 + 45 * e ** 6 / 1024) * Math.sin(2 * latRad)
        + (15 * e ** 4 / 256 + 45 * e ** 6 / 1024) * Math.sin(4 * latRad)
        - (35 * e ** 6 / 3072) * Math.sin(6 * latRad)
      );
      const easting = k0 * N * (
        A + (1 - T + C) * A ** 3 / 6
        + (5 - 18 * T + T ** 2 + 72 * C - 58 * (e * e / (1 - e * e))) * A ** 5 / 120
      ) + 500000;
      let northing = k0 * (M + N * Math.tan(latRad) * (
        A ** 2 / 2 + (5 - T + 9 * C + 4 * C ** 2) * A ** 4 / 24
        + (61 - 58 * T + T ** 2 + 600 * C - 330 * (e * e / (1 - e * e))) * A ** 6 / 720
      ));
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

  async dataImport(file: File): Promise<void> {
    if (!file || !this.view || !this.mapa) return;

    const fileName = file.name.toLowerCase();
    // Solo permitir json, geojson y csv
    if (!fileName.endsWith(".json") && !fileName.endsWith(".geojson") && !fileName.endsWith(".csv")) {
      alert("Formato no soportado. Solo se permiten archivos .json, .geojson o .csv");
      return;
    }

    // --- Definir proyecciones UTM sur ---
    const utmDefs: Record<string, string> = {
      "17S": "+proj=utm +zone=17 +south +datum=WGS84 +units=m +no_defs",
      "18S": "+proj=utm +zone=18 +south +datum=WGS84 +units=m +no_defs",
      "19S": "+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs"
    };
    const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

    // --- Preguntar tipo de coordenadas ---
    const coordType = prompt("¿Sus coordenadas están en UTM o GEOGRÁFICAS? (Escriba 'UTM' o 'GEOGRAFICA')");
    if (!coordType || !["UTM","GEOGRAFICA"].includes(coordType.toUpperCase())) {
      alert("Tipo de coordenadas no válido. Use 'UTM' o 'GEOGRAFICA'.");
      return;
    }

    let utmZone: "17S" | "18S" | "19S" | undefined;
    if (coordType.toUpperCase() === "UTM") {
      const zoneInput = prompt("Indique la zona UTM de sus coordenadas (17S, 18S, 19S):");
      if (!zoneInput || !["17S","18S","19S"].includes(zoneInput)) {
        alert("Zona UTM no válida. Use 17S, 18S o 19S.");
        return;
      }
      utmZone = zoneInput as "17S" | "18S" | "19S";
    }

    // --- Funciones internas de reproyección ---
    function reproyectarCoord(coord: number[]): number[] {
      if (!utmZone) return coord; // Si es geográfica, no se reproyecta
      return proj4(utmDefs[utmZone!], wgs84, coord);
    }

    function reproyectarGeoJSONGeometry(geom: any): any {
      if (!geom) return geom;
      const mapCoord = (c: number[]) => reproyectarCoord(c);

      switch (geom.type) {
        case "Point":
          return { type: "Point", coordinates: mapCoord(geom.coordinates) };
        case "LineString":
        case "MultiPoint":
          return { type: geom.type, coordinates: geom.coordinates.map(mapCoord) };
        case "Polygon":
        case "MultiLineString":
          return { type: geom.type, coordinates: geom.coordinates.map((ring: any) => ring.map(mapCoord)) };
        case "MultiPolygon":
          return { type: "MultiPolygon", coordinates: geom.coordinates.map((poly: any) => poly.map((ring: any) => ring.map(mapCoord))) };
        default:
          return geom;
      }
    }

    try {
      let geojson: any;
      let layer: __esri.Layer | null = null;

      if (fileName.endsWith(".csv")) {
        const blobUrl = URL.createObjectURL(file);
        layer = new CSVLayer({ url: blobUrl, title: file.name });
      } else {
        // Solo json/geojson
        const text = await file.text();
        geojson = JSON.parse(text);
      }

      if (!layer && geojson) {
        const validFeatures = geojson.features?.filter((f: any) => f.geometry) || [];
        if (validFeatures.length === 0) {
          alert("El archivo no contiene geometrías válidas para mostrar en el mapa.");
          return;
        }

        const featuresProcesadas = validFeatures.map((f: any) => ({
          ...f,
          geometry: reproyectarGeoJSONGeometry(f.geometry)
        }));

        const blob = new Blob(
          [JSON.stringify({ type: "FeatureCollection", features: featuresProcesadas })],
          { type: "application/json" }
        );
        const blobUrl = URL.createObjectURL(blob);

        layer = new GeoJSONLayer({ url: blobUrl, title: file.name });
      }

      if (!layer) return;

      this.mapa.add(layer);

      layer.when(() => {
        if (layer!.fullExtent && this.view) {
          this.view.goTo(layer!.fullExtent).catch(err => console.warn("No se pudo hacer zoom a la capa:", err));
        }
        alert(`Capa "${file.name}" cargada correctamente.`);
      }).catch(err => {
        console.error("Error cargando la capa:", err);
        alert("Ocurrió un error cargando la capa. Revisa la consola.");
      });

    } catch (err) {
      console.error("Error procesando el archivo:", err);
      alert("Ocurrió un error procesando el archivo. Revisa la consola.");
    }
  }

  // --- Convertir KML plano a GeoJSON ---
  private async convertKmlToGeoJSON(file: File): Promise<any> {
    const text = await file.text();
    const { DOMParser } = await import("@xmldom/xmldom");
    const parser = new DOMParser({
      errorHandler: { warning: () => { }, error: () => { }, fatalError: e => console.error(e) }
    });

    const kmlDoc = parser.parseFromString(text, "application/xml");
    if (!kmlDoc || !kmlDoc.documentElement) throw new Error("No se pudo parsear el KML correctamente.");

    const { kml } = await import("@mapbox/togeojson");
    return kml(kmlDoc);
  }
  // --- Convertir KMZ a GeoJSON ---
  private async convertKmzToGeoJSON(file: File): Promise<any> {
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(file);

    const kmlFileName = Object.keys(zip.files).find(name => name.toLowerCase().endsWith(".kml"));
    if (!kmlFileName) throw new Error("No se encontró KML dentro del KMZ");

    const kmlText = await zip.file(kmlFileName)!.async("text");

    const { DOMParser } = await import("@xmldom/xmldom");
    const parser = new DOMParser({
      errorHandler: { warning: () => { }, error: () => { }, fatalError: e => console.error(e) }
    });

    const kmlDoc = parser.parseFromString(kmlText, "application/xml");
    if (!kmlDoc || !kmlDoc.documentElement) throw new Error("No se pudo parsear el KML dentro del KMZ.");

    const { kml } = await import("@mapbox/togeojson");
    return kml(kmlDoc);
  }
}