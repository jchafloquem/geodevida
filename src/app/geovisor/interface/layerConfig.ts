import PopupTemplate from '@arcgis/core/PopupTemplate';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer.js';
import LabelClass from '@arcgis/core/layers/support/LabelClass.js';



export interface LayerConfig {
  featureReduction?: any;
  geometryType?: string;
  group: string;
  labelingInfo?: any;
  labelsVisible?: boolean;
  maxScale?: number;
  minScale?: number;
  outFields?: string[];
  popupTemplate?: any;
  renderer?: any;
  title: string;
  url: string;
  visible: boolean;
  opacity?: number;
}

