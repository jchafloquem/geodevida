import {ElementRef, Injectable} from '@angular/core';
import {LayerConfig} from '../interface/layerConfig';

//*Libreria de ArcGIS 4.30
import * as projection from '@arcgis/core/geometry/projection';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion.js';
import Expand from '@arcgis/core/widgets/Expand.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import Home from '@arcgis/core/widgets/Home.js';
import Legend from '@arcgis/core/widgets/Legend.js';
import Locate from "@arcgis/core/widgets/Locate.js";
import Map from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import Point from '@arcgis/core/geometry/Point';
import Search from "@arcgis/core/widgets/Search.js";
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import PopupTemplate from "@arcgis/core/PopupTemplate.js";
import Zoom from '@arcgis/core/widgets/Zoom.js';



//* Popup y Clusters
const popAcuicola = new PopupTemplate({
	title: 'CULTIVO DE: {PRODUCCIÓ}',
	outFields: ["*"],
	content: [
		{
			type: 'fields',
			fieldInfos: [
				{
					fieldName: 'APELLIDO_P',
					label: '<b><font>Nombre Completo</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},

			],
		},
	],
});
const popObservaciones = new PopupTemplate({
	title: 'DISTRITO:{DISTRITO}',
	outFields: ["*"],
	content: [
		{
			type: 'fields',
			fieldInfos: [
				{
					fieldName: 'NOMBRES',
					label: '<b><font>Nombre Completo</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'DNI',
					label: '<b><font>DNI</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'OBS',
					label: '<b><font>Observaciones</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'ORG',
					label: '<b><font>Oficina Zonal / Cultivo</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'Shape__Area',
					label: '<b><font>Area (m2)</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
					format: {
						places: 2, // Solo dos decimales
						digitSeparator: true // Activa separadores de miles
					}
				},
				{
					fieldName: 'Shape_Leng',
					label: '<b><font>Perimetro (ml.)</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
					format: {
						places: 2, // Solo dos decimales
						digitSeparator: true // Activa separadores de miles
					}
				},


			],
		},
	],
});

@Injectable({
	providedIn: 'root',
})

export class GeovisorSharedService {

	public mapa = new Map({basemap: 'satellite'});
	public view!: MapView;

	public googleMap!: google.maps.Map;



//*DATOS_GEOESPACIALES DE IDEP
	public layerUrls = {
		baseService: 'https://www.idep.gob.pe/geoportal/rest/services',
		limits: {
			departamentos: 'DATOS_GEOESPACIALES/LÍMITES/FeatureServer/3',
			provincias: 'DATOS_GEOESPACIALES/LÍMITES/FeatureServer/4',
			distritos: 'DATOS_GEOESPACIALES/LÍMITES/FeatureServer/5',

		}
	}
	//*Servicio de DEVIDA
		public layerUrlDevida = {
			baseServicio: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/Mapa_Muestra/FeatureServer',
			capasdevida: {
				observaciones:'0',
				acuicola: '1',
				segundoEnvio:'2',

		}
	};

	public layers: LayerConfig[] = [
	//*Servicios de capas base
		//*Capas de Limites Politicos

		{
			title: 'DISTRITOS',
			url: `${this.layerUrls.baseService}/${this.layerUrls.limits.distritos}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			group: 'LIMITES POLITICOS',
		},
		{
			title: 'PROVINCIAS',
			url: `${this.layerUrls.baseService}/${this.layerUrls.limits.provincias}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'LIMITES POLITICOS',
		},
		{
			title: 'DEPARTAMENTOS',
			url: `${this.layerUrls.baseService}/${this.layerUrls.limits.departamentos}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: true,
			labelsVisible: true,

			group: 'LIMITES POLITICOS',
		},
		//*Capas de DEVIDA
		{
			title: 'OBSERVACIONES - 1er ENVIO',
			url: `${this.layerUrlDevida.baseServicio}/${this.layerUrlDevida.capasdevida.observaciones}`,
			labelingInfo: undefined,
			popupTemplate: popObservaciones,
			renderer: undefined,
			visible: true,
			labelsVisible: true,
			group: 'DEVIDA',
		},
		{
			title: 'ACUICOLA - PRODUCCION DE PACOS Y TRUCHAS',
			url: `${this.layerUrlDevida.baseServicio}/${this.layerUrlDevida.capasdevida.acuicola}`,
			labelingInfo: undefined,
			popupTemplate: popAcuicola,
			renderer: undefined,
			visible: true,
			labelsVisible: true,
			group: 'DEVIDA',
		},
		{
			title: 'CULTIVOS - CAFE & CACAO',
			url: `${this.layerUrlDevida.baseServicio}/${this.layerUrlDevida.capasdevida.segundoEnvio}`,
			labelingInfo: undefined,
			//popupTemplate: popCultivo,
			renderer: undefined,
			visible: false,
			labelsVisible: true,
			group: 'DEVIDA',
		},


	];

	public lis: [] = [];
	public searchTerm = '';
	public filteredArray: [] = [];
	//* Footer coordenadas
	public gcsLongitude = '--';
	public gcsLatitude = '--';
	public utmZone = '--';
	public utmEast = '--';
	public utmNorth = '--';
	public scale = '--';
	public legend!: Legend;

	constructor() {}

	initializeMap(mapViewEl: ElementRef): Promise<void> {

		const container = mapViewEl.nativeElement;

		this.layers.forEach((layerConfig) => {
			let featureLayer;
			if (layerConfig.popupTemplate == undefined) {
				featureLayer = new FeatureLayer({
					url: layerConfig.url,
					title: layerConfig.title,
					visible: layerConfig.visible,
					outFields: layerConfig.outFields,
					featureReduction:layerConfig.featureReduction
				});
			}
			else if (layerConfig.popupTemplate && layerConfig.renderer == undefined) {
				featureLayer = new FeatureLayer({
					url: layerConfig.url,
					title: layerConfig.title,
					popupTemplate: layerConfig.popupTemplate,
					labelsVisible: layerConfig.labelsVisible,
					visible: layerConfig.visible,
					featureReduction:layerConfig.featureReduction
				});
			}
			else if (layerConfig.popupTemplate && layerConfig.renderer && layerConfig.labelingInfo == undefined) {
				featureLayer = new FeatureLayer({
					url: layerConfig.url,
					title: layerConfig.title,
					popupTemplate: layerConfig.popupTemplate,
					renderer: layerConfig.renderer,
					visible: layerConfig.visible,
					labelsVisible: layerConfig.labelsVisible,
					featureReduction:layerConfig.featureReduction
				});
			}
			else {
				featureLayer = new FeatureLayer({
					url: layerConfig.url,
					title: layerConfig.title,
					popupTemplate: layerConfig.popupTemplate,
					labelingInfo: layerConfig.labelingInfo,
					outFields: layerConfig.outFields,
					visible: layerConfig.visible,
					renderer: layerConfig.renderer,
					maxScale: layerConfig.maxScale,
					minScale: layerConfig.minScale,
					labelsVisible: layerConfig.labelsVisible,
					featureReduction:layerConfig.featureReduction
				});
			}
			this.mapa.add(featureLayer);
		});
		//*Creacion de la Vista del Mapa
		const view = new MapView({
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
			padding: {top: 0},
			ui: {
				components: [],
			},
		});
		//*Escala del Mapa
		view.watch('scale', (scale) => {
			this.scale = this.formatScale(scale);
		});

		//CONTROLES DE FUNCION DEL MAPA (LADO DERECHO)
		const sourceDEVIDA = [
				{
					layer: new FeatureLayer({
						url: `${this.layerUrlDevida.baseServicio}/${this.layerUrlDevida.capasdevida.observaciones}`,
						labelsVisible: true
					}),
					searchFields: ["DNI"],
					displayField: "DNI",
					exactMatch: false,
					outFields: ["*"],
					name: "Observaciones",
					placeholder: "Ingrese DNI",
					maxResults: 5,
					maxSuggestions: 5,
					suggestionsEnabled: true,
					minSuggestCharacters: 1,
				},
				{
					layer: new FeatureLayer({
						url: `${this.layerUrlDevida.baseServicio}/${this.layerUrlDevida.capasdevida.acuicola}`
					}),
					searchFields: ["DNI"],
					displayField: "APELLIDO_P",
					exactMatch: false,
					outFields: ["*"],
					name: "Acuicola",
					placeholder: "Ingrese DNI",
					maxResults: 4,
					maxSuggestions: 4,
					suggestionsEnabled: true,
					minSuggestCharacters: 1,
				},
			]

		const buscar = new Search({
			view: view,
			sources:sourceDEVIDA,
			allPlaceholder: 'Buscar dirección o lugar',
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
						await view.goTo({
							target: geometry,
							zoom: 17, // Aplica zoom al punto
						});
					} else if (geometry.extent) {
						await view.goTo({
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

			//{position:'top-right', index:0})
		view.ui.add(new Zoom({view}),{position:'top-right',index:1});
		view.ui.add(new Home({view }), {position:'top-right',index:2});
		view.ui.add(new Locate({view, icon:'gps-on-f'}),{position:'top-right', index:3});
		view.ui.add(new Expand({view, expandTooltip:'Galeria de Mapas Base', content: new BasemapGallery({view, icon:'move-to-basemap'})}), {position:'top-right', index:4});

		this.legend = new Legend({view, container: document.createElement('div')});
		new CoordinateConversion({view });
		view.when( () => {
			view.on('pointer-move', (event) => {
				const point = view.toMap({ x: event.x, y: event.y });
				if (point) this.updateCoordinates(point.latitude, point.longitude);
			});
		});	this.view = view;
		 return this.view.when();
	} //*Fin <initializeMap>








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

	updateCoordinates(lat: number, lon: number): void {
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
		const utmWkid = lat >= 0 ? 32600 + zoneNumber : 32700 + zoneNumber; // WKID for UTM zone
		const projected = projection.project(pointUTM, new SpatialReference({wkid: utmWkid})) as Point;

		const utmPoint = projected as Point;
		this.utmEast = `${utmPoint.x.toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})} m`;
		this.utmNorth = `${utmPoint.y.toLocaleString('en-US', {
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
