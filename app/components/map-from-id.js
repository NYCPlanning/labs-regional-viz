import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { computed } from 'ember-decorators/object';

function buildPaint({ property, colors, breaks, opacity }) {
  const paint =  {
    'fill-color': [
      'curve',
      ['step'],
      [
        'number',
        ['get', property],
        1,
      ]
    ],
    'fill-opacity': opacity
  };
  const colorArray = paint['fill-color'];

  colors.forEach((color, i) => {
    colorArray.push(colors[i]);
    colorArray.push(breaks[i]);
  })

  colorArray.push('#FFF')

  console.log('PAINT', paint)
  return paint;
}

export default Component.extend({
  classNameBindings: ['narrativeVisible:narrative-visible'],
  classNames: 'map-container cell large-auto',
  zoom: 6.8,
  center: [-73.869324, 40.815888],

  @computed('mapConfig.layers')
  builtLayers(layers) {
    return layers.map(layer => {
      console.log('layer', layer)
      if (layer.type === 'choropleth') {
        const { id, source, paintConfig } = layer;
        console.log('here', id, source)
        return {
          id,
          type: 'fill',
          source,
          'source-layer': layer['source-layer'],
          paint: buildPaint(paintConfig),
        }
      }

      return layer
    });
  },

  actions: {
    handleMapLoad(map) {
      console.log('mapConfig', this.get('mapConfig'))
      const sources = this.get('mapConfig.sources');

      if (window) {
        window.map = map;
      }

      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-left');

      sources.forEach(source => {
        map.addSource(source.id, source)
      });
    }
  }
});
