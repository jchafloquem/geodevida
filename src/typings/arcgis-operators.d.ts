declare module "@arcgis/core/geometry/geometryService/projectOperator.js" {
  export function project(params: {
    geometries: __esri.Geometry[],
    outSpatialReference: __esri.SpatialReference
  }): __esri.Geometry[];
}
