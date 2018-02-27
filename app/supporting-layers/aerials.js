export default {
  source: {
    type: 'raster',
    tiles: [
      'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
    ],
    tileSize: 256,
    attribution: '<a href="https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer">USGS ImageryOnly MapServer</a>',
  },
  layer: {
    id: 'aerials',
    type: 'raster',
    source: 'aerials',
    paint: {},
  },
};
