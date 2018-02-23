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
      if (layer.type === 'choropleth') {
        const { id, source, paintConfig } = layer;
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

  didUpdateAttrs() {
    console.log('didupdate', this.get('mapConfig.sources'))
    const map = this.get('map');
    const sources = this.get('mapConfig.sources');
    sources.forEach(source => {
      map.addSource(source.id, source)
    });
  },

  actions: {
    handleMapLoad(map) {
      const sources = this.get('mapConfig.sources');
      this.set('map', map);

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
