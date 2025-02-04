import {ElementRef, Injectable} from '@angular/core';
import {LayerConfig} from '../interfaces/layerConfig';

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
const popCultivo = new PopupTemplate({
	title: 'CULTIVO DE: {CUTIVO}',
	content: [
		{
			type: 'fields',
			fieldInfos: [
				{
					fieldName: 'APELLIDO_P',
					label: '<b><font>Apellido Paterno</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'APELLIDO_M',
					label: '<b><font>Apellido Materno</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'NOMBRES',
					label: '<b><font>Nombres</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'DNI',
					label: '<b><font>Nro de DNI</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'AREA_HA',
					label: '<b><font>HECTAREAS</font></b>',
					visible: true,
					stringFieldOption: 'text-box',
				},
				{
					fieldName: 'OZ',
					label: '<b><font>Oficina Zonal</font></b>',
					format: {
						digitSeparator: true, // Uses a comma separator in numbers >999
						places: 5, // Sets the number of decimal places to 0 and rounds up
					},
				},
			],
		},
	],
});

@Injectable({
	providedIn: 'root',
})
export class GeovisorSharedService {
	public mapa = new Map({basemap: 'topo'});
	public view!: MapView;

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
		baseServicio: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/ZONAS/FeatureServer',
		capasdevida: {
			zonas: '0',
			ofiZonales:'4',
			cultivos:'3'
		}
	};
	//*Servicio de DEVIDA
	public layerUrlDevida1 = {
		baseServicio: 'https://services8.arcgis.com/tPY1NaqA2ETpJ86A/arcgis/rest/services/UbicacionAcuicola/FeatureServer',
		capasdevida: {
			acuicola: '0',
		}
	};
	//*Servicio de COFOPRI - FORMALIZACION
	public layerUrlgeollaqta = {
		baseServicio: 'https://geoportal.cofopri.gob.pe/cofopri/rest/services/Cofopri/FORMALIZACION_PSAD56/MapServer',
		formalizacion: {
			lotes: '1',
			manzanas:'2',
			pueblo:'3'
		}
	};
	//*Servicio de MIDAGRI
	public layerUrlMIDAGRI = {
		baseServicio: 'https://georural.midagri.gob.pe/geoservicios/rest/services/servicios_ogc/Catastro_Rural/MapServer',
		data: {
			predioRural: '0',
			comunidadesCampesina:'1',
			comunidadesNativas:'2'
		}
	};
		//*Servicio de MTC
		public layerUrlMtc = {
			baseServicio: 'https://www.idep.gob.pe/geoportal/rest/services/INSTITUCIONALES/MTC/FeatureServer',
			baseCapas: {
				aerodromo: '0',
				estacionesTren:'1',
				lineaFerrea:'2',
				terminalPortuario:'3',
				terminalTerrestre:'4',
				peajes:'5',
				postesSOS:'6',
				puentes:'7',
				redVialVecinal:'8',
				redVialDepartamental:'9',
				redVialNacional:'10'
			}
		};
		//*Servicio de ANA
		public layerUrlAna = {
			baseServicio: 'https://www.idep.gob.pe/geoportal/rest/services/INSTITUCIONALES/ANA_WMS/FeatureServer',
			baseCapas: {
				cochas: '0',
				humedalesCosteros:'1',
				manantial:'2',
				glaciales:'3',
				hidrometeorologica:'4',
				autAdmAgua:'5',
				unidadHidrograficas:'6',
				marinoCostero:'11',
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
			title: 'PRODUCCION DE PACOS Y TRUCHAS',
			url: `${this.layerUrlDevida1.baseServicio}/${this.layerUrlDevida1.capasdevida.acuicola}`,
			labelingInfo: undefined,
			popupTemplate: popCultivo,
			renderer: undefined,
			visible: true,
			labelsVisible: false,
			group: 'ACUICOLA',
		},
		{
			title: 'CULTIVO',
			url: `${this.layerUrlDevida.baseServicio}/${this.layerUrlDevida.capasdevida.cultivos}`,
			labelingInfo: undefined,
			popupTemplate: popCultivo,
			renderer: undefined,
			visible: true,
			labelsVisible: false,
			group: 'PARCELAS',
		},
		{
			title: 'MUESTRA PIRDAIS 2024',
			url: `${this.layerUrlDevida.baseServicio}/${this.layerUrlDevida.capasdevida.zonas}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'LIMITES DE AMBITO',
		},
		{
			title: 'OFICINAS ZONALES',
			url: `${this.layerUrlDevida.baseServicio}/${this.layerUrlDevida.capasdevida.ofiZonales}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'LIMITES DE AMBITO',
		},
		//*Capas de COFOPRI
		{
			title: 'PUEBLOS',
			url: `${this.layerUrlgeollaqta.baseServicio}/${this.layerUrlgeollaqta.formalizacion.pueblo}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'COFOPRI - FORMALIZACION',
		},
		{
			title: 'MANZANAS',
			url: `${this.layerUrlgeollaqta.baseServicio}/${this.layerUrlgeollaqta.formalizacion.manzanas}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'COFOPRI - FORMALIZACION',
		},
		{
			title: 'LOTES',
			url: `${this.layerUrlgeollaqta.baseServicio}/${this.layerUrlgeollaqta.formalizacion.lotes}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'COFOPRI - FORMALIZACION',
		},
		//*Capas de MIDAGRI
		{
			title: 'PREDIO RURAL',
			url: `${this.layerUrlMIDAGRI.baseServicio}/${this.layerUrlMIDAGRI.data.predioRural}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MIDAGRI',
		},
		{
			title: 'COMUNIDADES CAMPESINAS',
			url: `${this.layerUrlMIDAGRI.baseServicio}/${this.layerUrlMIDAGRI.data.comunidadesCampesina}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MIDAGRI',
		},
		{
			title: 'COMUNIDADES NATIVAS',
			url: `${this.layerUrlMIDAGRI.baseServicio}/${this.layerUrlMIDAGRI.data.comunidadesNativas}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MIDAGRI',
		},
		//*Capas de MTC
		{
			title: 'AERODROMO',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.aerodromo}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'ESTACION DE TREN',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.estacionesTren}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'LINEA FERREA',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.lineaFerrea}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'TERMINAL PORTUARIO',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.terminalPortuario}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'TERMINAL TERRESTRE',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.terminalTerrestre}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: true,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'PEAJES',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.peajes}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'POSTES SOS',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.postesSOS}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'PUENTES',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.puentes}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'RED VIAL VECINAL',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.redVialVecinal}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'RED VIAL DEPARTAMENTAL',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.redVialDepartamental}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		{
			title: 'RED VIAL NACIONAL',
			url: `${this.layerUrlMtc.baseServicio}/${this.layerUrlMtc.baseCapas.redVialNacional}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'MTC',
		},
		//*Capas de ANA
		{
			title: 'MARINO COSTERO',
			url: `${this.layerUrlAna.baseServicio}/${this.layerUrlAna.baseCapas.marinoCostero}`,
			labelingInfo: undefined,
			popupTemplate: undefined,
			renderer: undefined,
			visible: false,
			labelsVisible: false,
			group: 'ANA',
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
				minZoom: 1,
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
		const buscarDatos = new Search({
			view: view,
			//sources: [this.capas.layerUrlDevida1],
			allPlaceholder: 'Buscar dirección o lugar',
			label: 'Buscar',
			locationEnabled: true,
			maxResults: 10,
			container: "searchDiv"
		});
			//{position:'top-right', index:0})
		view.ui.add(new Zoom({view}),{position:'top-right',index:1});
		view.ui.add(new Home({view }), {position:'top-right',index:2});
		view.ui.add(new Locate({view, icon:'gps-on-f'}),{position:'top-right', index:3});
		view.ui.add(new Expand({view, expandTooltip:'Galeria de Mapas Base', content: new BasemapGallery({view, icon:'move-to-basemap'})}), {position:'top-right', index:4});

		this.legend = new Legend({view, container: document.createElement('div')});
		new CoordinateConversion({view });
		view.on('pointer-move', (event: {x: number; y: number}) => {
			const point = this.view.toMap({x: event.x, y: event.y});
			this.updateCoordinates(point.latitude, point.longitude);
		}); this.view = view;
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
