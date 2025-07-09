import { ElementRef, Injectable } from '@angular/core';
import { LayerConfig } from '../interface/layerConfig';

//*LIBRERIA DEL API DE ARCGIS 4.33
import * as projection from '@arcgis/core/geometry/projection';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion.js';
import Expand from '@arcgis/core/widgets/Expand.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Legend from '@arcgis/core/widgets/Legend.js';
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import Point from '@arcgis/core/geometry/Point';
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import Search from "@arcgis/core/widgets/Search.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import Zoom from '@arcgis/core/widgets/Zoom.js';

import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';




//* POPUP & CLUSTERS
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

@Injectable({
  providedIn: 'root',
})
export class GeovisorSharedService {





  public mapa = new Map({ basemap: 'satellite' });
  public view!: MapView;

  //*SERVICIO SISCOD-DEVIDA
  public restGeoDevida = {
    serviceBase: 'https://siscod.devida.gob.pe/server/rest',
    capas: {
      oficinaZonal: 'services/DPM_LIMITES_PIRDAIS/MapServer/0',
      bosqueProdPermanente: 'services/DPM_LIMITES_PIRDAIS/MapServer/2',
      zonaAmortiguamiento: 'services/DPM_LIMITES_PIRDAIS/MapServer/3',
      areaNaturalProtegida: 'services/DPM_LIMITES_PIRDAIS/MapServer/4',
      limiteDepartamento: 'services/DPM_LIMITES_PIRDAIS/MapServer/5',
      limiteProvincia: 'services/DPM_LIMITES_PIRDAIS/MapServer/7',
      limiteDistrito: 'services/DPM_LIMITES_PIRDAIS/MapServer/8',
      limitePeru: 'services/DPM_LIMITES_PIRDAIS/MapServer/9',
    }
  }
  public restCaribSurveyPercepcionCafe = {
    serviceBase: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services',
    capas: {
      infraestructura:'FICHA_DE_MONITOREO_TIPOLOGÍA_INFRAESTRUCTURA_vista/FeatureServer/0',
      cacao:'CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_–_PTA_DEVIDA_vista/FeatureServer/0',
      cafe: 'CUESTIONARIO_DE_PERCEPCION_DE_LA_FAMILIA_%E2%80%93_CAFE_vista/FeatureServer/0',
      registroForestal:'REGISTRO_FORESTAL_vista/FeatureServer/0',
      medidasAmbientales:'MEDIDAS_AMBIENTALES_vista/FeatureServer/0'
    }
  }
  //*SERVICIOS GLOBALES
  public restAna = {
    serviceBase: 'https://geosnirh.ana.gob.pe/server/rest/services/P%C3%BAblico',
    capas: {
      lagunas: 'Lagunas/MapServer/36',
      riosQuebradas: 'Rios/MapServer/37',
      fajaMarginal: 'DUA_Acuicola/MapServer/22',
    }
  }
  public restMidagri = {
    serviceBase: 'https://georural.midagri.gob.pe/geoservicios/rest',
    capas: {
      predioRural: 'services/servicios_ogc/Catastro_Rural/MapServer/0',
      comunidadCampesina: 'services/servicios_ogc/Catastro_Rural/MapServer/1',
      comunidadNativa: 'services/servicios_ogc/Catastro_Rural/MapServer/2',
    }
  }
  public layers: LayerConfig[] = [
    //*SERVICIOS REST DE GEODEVIDA-CARIB
    {
      title: 'CUESTIONARIO MEDIDAS AMBIENTALES',
      url: `${this.restCaribSurveyPercepcionCafe.serviceBase}/${this.restCaribSurveyPercepcionCafe.capas.medidasAmbientales}`,
      popupTemplate: undefined,
      outFields: ['*'],
      visible: true,
      labelsVisible: true,
      opacity: 1,
      group: 'MONITOREO CAFE',
    },
    {
      title: 'CUESTIONARIO REGISTRO FORESTAL',
      url: `${this.restCaribSurveyPercepcionCafe.serviceBase}/${this.restCaribSurveyPercepcionCafe.capas.registroForestal}`,
      popupTemplate: undefined,
      outFields: ['*'],
      visible: true,
      labelsVisible: true,
      opacity: 1,
      group: 'MONITOREO CAFE',
    },
    {
      title: 'CUESTIONARIO INFRAESTRUCTURA',
      url: `${this.restCaribSurveyPercepcionCafe.serviceBase}/${this.restCaribSurveyPercepcionCafe.capas.infraestructura}`,
      popupTemplate: undefined,
      outFields: ['*'],
      visible: true,
      labelsVisible: true,
      opacity: 1,
      group: 'MONITOREO CAFE',
    },
    {
      title: 'CUESTIONARIO PERCEPCION CACAO',
      url: `${this.restCaribSurveyPercepcionCafe.serviceBase}/${this.restCaribSurveyPercepcionCafe.capas.cacao}`,
      popupTemplate: undefined,
      outFields: ['*'],
      visible: true,
      labelsVisible: true,
      opacity: 1,
      group: 'MONITOREO CAFE',
    },
    {
      title: 'CUESTIONARIO PERCEPCION CAFE',
      url: `${this.restCaribSurveyPercepcionCafe.serviceBase}/${this.restCaribSurveyPercepcionCafe.capas.cafe}`,
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: `"Participante con DNI: "+TextFormatting.NewLine+$feature.dni_participante`  // Campo con el nombre del departamento
          },
          symbol: {
            type: "text",
            color: "#00274D",
            font: {
              size: 12,
              family: "Arial",
              weight: "bold"
            },
            haloColor: "white",
            haloSize: 2,
            horizontalAlignment: "center",  // Centrado horizontal
            verticalAlignment: "middle"
          },
          labelPlacement: "above-center",
          minScale: 20000,
        }
      ],
      popupTemplate: restCaribSurveyPercepcionCafe,
      renderer: cafeRenderer,
      visible: true,
      labelsVisible: true,
      opacity: 1,
      group: 'MONITOREO CAFE',
    },
    {
      title: 'ZA - ZONA DE AMORTIGUAMIENTO',
      url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.zonaAmortiguamiento}`,
      labelingInfo: undefined,
      popupTemplate: caribZA,
      renderer: undefined,
      visible: false,
      labelsVisible: true,
      opacity: 0.5,
      group: 'CARTOGRAFIA DEVIDA',
    },
    {
      title: 'ANP - AREA NATURAL PROTEGIDA',
      url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.areaNaturalProtegida}`,
      labelingInfo: undefined,
      popupTemplate: caribANP,
      renderer: undefined,
      visible: false,
      labelsVisible: true,
      opacity: 0.5,
      group: 'CARTOGRAFIA DEVIDA',
    },
    {
      title: 'BPP - BOSQUE DE PRODUCCION PERMANENTE',
      url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.bosqueProdPermanente}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: false,
      labelsVisible: true,
      opacity: 0.5,
      group: 'CARTOGRAFIA DEVIDA',
    },
    {
      title: 'OFICINA ZONAL',
      url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.oficinaZonal}`,
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: `"OFICINA ZONAL: "+TextFormatting.NewLine+$feature.nombre`  // Campo con el nombre del departamento
          },
          symbol: {
            type: "text",
            color: "#00274D",
            font: {
              size: 8,
              family: "Arial",
              weight: "bold"
            },
            haloColor: "white",
            haloSize: 2
          },
          labelPlacement: "always-horizontal"
        }
      ],
      popupTemplate: popupLimitesOficinaZonal,
      renderer: undefined,
      visible: true,
      labelsVisible: true,
      opacity: 1,
      group: 'CARTOGRAFIA DEVIDA',
    },
    //*CARGA DE CAPAS DE HIDROGRAFIA
    {
      title: 'COMUNIDADES NATIVAS',
      url: `${this.restMidagri.serviceBase}/${this.restMidagri.capas.comunidadNativa}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: false,
      labelsVisible: true,
      opacity: 0.5,
      group: 'MIDAGRI',
    },
    {
      title: 'COMUNIDADES CAMPESINAS',
      url: `${this.restMidagri.serviceBase}/${this.restMidagri.capas.comunidadCampesina}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: false,
      labelsVisible: true,
      opacity: 0.5,
      group: 'MIDAGRI',
    },
    {
      title: 'PREDIO RURAL',
      url: `${this.restMidagri.serviceBase}/${this.restMidagri.capas.predioRural}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: true,
      labelsVisible: true,
      opacity: 0.5,
      group: 'MIDAGRI',
    },
    {
      title: 'RIOS & QUEBRADAS',
      url: `${this.restAna.serviceBase}/${this.restAna.capas.riosQuebradas}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: false,
      labelsVisible: true,
      opacity: 0.85,
      group: 'HIDROGRAFIA',
    },
    {
      title: 'LAGUNAS',
      url: `${this.restAna.serviceBase}/${this.restAna.capas.lagunas}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: false,
      labelsVisible: true,
      opacity: 0.85,
      group: 'HIDROGRAFIA',
    },
    //*CARGA DE CAPAS DE LIMITES POLITICOS (IDEP)
    {
      title: 'DISTRITOS',
      url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.limiteDistrito}`,
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: `"DISTRITO: "+TextFormatting.NewLine+$feature.NOMBDIST`
          },
          symbol: {
            type: "text",
            color: "#FF0000",
            font: {
              size: 12,
              family: "Arial",
              weight: "bold"
            },
            haloColor: "white",
            haloSize: 1,
            //horizontalAlignment: "center",  // Centrado horizontal
            verticalAlignment: "middle"
          },
          labelPlacement: "always-horizontal"
        }
      ],
      popupTemplate: undefined,
      renderer: undefined,
      visible: true,
      group: 'LIMITES POLITICOS',
    },
    {
      title: 'PROVINCIAS',
      url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.limiteProvincia}`,
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: `"PROVINCIA: "+TextFormatting.NewLine+$feature.NOMBPROV`
          },
          symbol: {
            type: "text",
            color: "#FFFF00",
            font: {
              size: 12,
              family: "Arial",
              weight: "bold"
            },
            haloColor: "black",
            haloSize: 1,
            horizontalAlignment: "center",
            verticalAlignment: "middle"
          },
          labelPlacement: "always-horizontal"
        }
      ],
      popupTemplate: undefined,
      renderer: undefined,
      visible: true,
      labelsVisible: false,
      group: 'LIMITES POLITICOS',
    },
    {
      title: 'DEPARTAMENTOS',
      url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.limiteDepartamento}`,
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: `"DEPARTAMENTO: "+TextFormatting.NewLine+$feature.NOMBDEP`
          },
          symbol: {
            type: "text",
            color: "white",
            font: {
              size: 10,
              family: "Arial",
              weight: "bold"
            },
            haloColor: "black",
            haloSize: 1,
            horizontalAlignment: "center",
            verticalAlignment: "middle"
          },
          labelPlacement: "always-horizontal",
          minScale: 9000000
        }
      ],
      popupTemplate: undefined,
      renderer: undefined,
      visible: true,
      labelsVisible: true,
      group: 'LIMITES POLITICOS',
    },
    {
      title: 'PERU',
      url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.limitePeru}`,
      labelingInfo: undefined,
      popupTemplate: undefined,
      renderer: undefined,
      visible: true,
      labelsVisible: false,
      group: 'LIMITES POLITICOS',
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

  constructor() { }

  initializeMap(mapViewEl: ElementRef): Promise<void> {
    const container = mapViewEl.nativeElement;
    this.layers.forEach((layerConfig) => {

      const hasValidLayerId = /\/\d+$/.test(layerConfig.url);
      if (!hasValidLayerId) {
        console.warn(`⚠️ Se ignoró la capa "${layerConfig.title}" porque no tiene un layerId válido: ${layerConfig.url}`);
        return;
      }

      const layerOptions: any = {
        url: layerConfig.url,
        title: layerConfig.title,
        visible: layerConfig.visible,
      };

      if (layerConfig.popupTemplate) {
        layerOptions.popupTemplate = layerConfig.popupTemplate;
      }

      if (layerConfig.renderer) {
        layerOptions.renderer = layerConfig.renderer;
      }

      if (layerConfig.labelingInfo) {
        layerOptions.labelingInfo = layerConfig.labelingInfo;
      }

      if (layerConfig.labelsVisible !== undefined) {
        layerOptions.labelsVisible = layerConfig.labelsVisible;
      }

      if (layerConfig.outFields) {
        layerOptions.outFields = layerConfig.outFields;
      }

      if (layerConfig.maxScale !== undefined) {
        layerOptions.maxScale = layerConfig.maxScale;
      }

      if (layerConfig.minScale !== undefined) {
        layerOptions.minScale = layerConfig.minScale;
      }

      if (layerConfig.featureReduction) {
        layerOptions.featureReduction = layerConfig.featureReduction;
      }

      if (layerConfig.opacity !== undefined) {
        layerOptions.opacity = layerConfig.opacity;
      }

      const featureLayer = new FeatureLayer(layerOptions);
      this.mapa.add(featureLayer);
    });


    //*Creacion de la Vista del Mapa
    this.view = new MapView({
      container: container,
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
    reactiveUtils.watch(
      () => this.view.scale,
      (scale) => {
        this.scale = this.formatScale(scale);
      }
    );


    //*CONTROLES DE FUNCION DEL MAPA (LADO DERECHO)
    const sourceDEVIDA = [
      {
        layer: new FeatureLayer({
          url: `${this.restGeoDevida.serviceBase}/${this.restGeoDevida.capas.oficinaZonal}`
        }),
        searchFields: ["nombre"],
        displayField: "nombre",
        exactMatch: false,
        outFields: ["*"],
        name: "Oicina Zonal",
        placeholder: "Nombre OZ",
        maxResults: 5,
        maxSuggestions: 5,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
      {
        layer: new FeatureLayer({
          url: `${this.restAna.serviceBase}/${this.restAna.capas.lagunas}`
        }),
        searchFields: ["NOMBREOFICIAL"],
        displayField: "NOMBREOFICIAL",
        exactMatch: false,
        outFields: ["*"],
        name: "Lagunas",
        placeholder: "Ingrese nombre",
        maxResults: 5,
        maxSuggestions: 5,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
      {
        layer: new FeatureLayer({
          url: `${this.restCaribSurveyPercepcionCafe.serviceBase}/${this.restCaribSurveyPercepcionCafe.capas.cafe}`
        }),
        searchFields: ["dni_participante", "tecnico"],
        displayField: "dni_participante",
        exactMatch: false,
        outFields: ["*"],
        name: "Percepcion de Cafe",
        placeholder: "Ingrese DNI o Cod. Monitor",
        maxResults: 5,
        maxSuggestions: 5,
        suggestionsEnabled: true,
        minSuggestCharacters: 1,
      },
    ]

    const buscar = new Search({
      view: this.view,
      sources: sourceDEVIDA,
      includeDefaultSources: false, // desactiva el World Geocoding Service
      allPlaceholder: 'Buscar',
      label: 'Buscar',
      locationEnabled: true,
      maxResults: 10,
      popupEnabled: false,
      container: "searchDiv"
    });

    buscar.on("select-result", async (event) => {
      const result = event.result;
      if (result && result.feature && result.feature.geometry) {
        const geometry = result.feature.geometry;
        try {
          if (geometry.type === "point") {
            await this.view.goTo({
              target: geometry,
              zoom: 17, // Aplica zoom al punto
            });
          } else if (geometry.extent) {
            await this.view.goTo({
              target: geometry.extent.expand(1.5), // Aplica zoom a entidades de área
            });
          } else {
            console.warn("La geometría no tiene un 'extent' válido.");
          }
        } catch (error) {
          console.error("Error al aplicar el zoom:", error);
        }
      } else {
        console.error("No se encontró geometría en el resultado.");
      }
    });


    this.view.ui.add(new Zoom({ view: this.view }), { position: 'top-right', index: 1 });

    const homeEl = document.createElement('arcgis-home') as any;
          homeEl.view = this.view;
    this.view.ui.add(homeEl, {position: 'top-right',index: 2});

    const locateEl = document.createElement('arcgis-locate') as any;
          locateEl.view = this.view;
    this.view.ui.add(locateEl, {position: 'top-right',index: 3});

    //Nueva version del boton de Galeria de mapas
    const galleryEl = document.createElement('arcgis-basemap-gallery') as any;
          galleryEl.view = this.view;
    const expand = new Expand({
      view: this.view,
      content: galleryEl,
      expandTooltip: 'Galería de Mapas Base',
      expandIcon: 'basemap'
    });

    this.view.ui.add(expand, { position: 'top-right', index: 4 });
    this.legend = new Legend({ view: this.view, container: document.createElement('div') });
    new CoordinateConversion({ view: this.view });
    this.view.when(() => {
      this.view.on('pointer-move', (event) => {
        const point: any = this.view.toMap({ x: event.x, y: event.y });
        if (point) this.updateCoordinates(point.latitude, point.longitude);
      });
    });

    return this.view.when();

  } //*FIN <InitializeMap>

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

  async updateCoordinates(lat: number, lon: number): Promise<void> {
    this.gcsLongitude = lon.toFixed(5);
    this.gcsLatitude = lat.toFixed(5);

    // Calculate UTM Zone
    const zoneNumber = Math.floor((lon + 180) / 6) + 1;
    const utmBand = this.getUtmBand(lat);
    this.utmZone = `${zoneNumber} ${utmBand}`;

    // Convert to UTM
    const pointUTM = new Point({
      latitude: lat,
      longitude: lon,
      spatialReference: SpatialReference.WGS84,
    });

      // Cargar proyección
  await projection.load();

  const utmWkid = lat >= 0 ? 32600 + zoneNumber : 32700 + zoneNumber;

    const srUTM = new SpatialReference({ wkid: utmWkid });

    const projected = projection.project(pointUTM, srUTM) as Point;

    this.utmEast = `${projected.x.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} m`;

    this.utmNorth = `${projected.y.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} m`;
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
}
