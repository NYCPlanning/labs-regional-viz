import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { computed } from 'ember-decorators/object';
import numeral from 'numeral';

function buildPaint({
  colors,
  breaks,
  opacity,
}) {
  const paint = {
    'fill-color': [
      'curve',
      ['step'],
      [
        'number',
        ['get', 'value'],
        1,
      ],
    ],
    'fill-opacity': opacity,
  };
  const colorArray = paint['fill-color'];

  colors.forEach((color, i) => {
    colorArray.push(colors[i]);
    colorArray.push(breaks[i]);
  });

  colorArray.push('#FFF');

  return paint;
}

export default Component.extend({
  classNameBindings: ['narrativeVisible:narrative-visible'],
  classNames: 'map-container cell large-auto',
  zoom: 6.8,
  center: [-73.869324, 40.815888],

  highlightedFeature: null,

  popup: new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  }),

  @computed('highlightedFeature')
  highlightedFeatureSource(feature) {
    return {
      type: 'geojson',
      data: feature,
    };
  },

  @computed('highlightedFeature')
  popupData(feature) {
    return feature.properties;
  },

  highlightedFeatureLayer: {
    id: 'highlighted-feature',
    type: 'fill',
    source: 'highlighted-feature',
    paint: {
      'fill-opacity': 0.2,
      'fill-color': '#999999',
    },
  },

  @computed('mapConfig.layers')
  layerTitle(layers = []) {
    return layers[0].title;
  },

  @computed('mapConfig.layers')
  builtLayers(layers = []) {
    return layers.map((layer) => {
      if (layer.type === 'choropleth') {
        const { id, source, paintConfig } = layer;
        return {
          id,
          type: 'fill',
          source,
          'source-layer': layer['source-layer'],
          paint: buildPaint(paintConfig),
        };
      }

      return layer;
    });
  },

  @computed('mapConfig')
  breaks(mapConfig) {
    // return an array of objects, each with a display-ready range and color
    const config = mapConfig.layers[0].paintConfig;
    const { isPercent, breaks, colors } = config;

    const format = (value) => { // eslint-disable-line
      return isPercent ? numeral(value).format('0,0%') : numeral(value).format('0,0');
    };

    const breaksArray = [];

    for (let i = breaks.length - 1; i >= 0; i -= 1) {
      if (i === breaks.length - 1) {
        breaksArray.push({
          label: `${format(breaks[breaks.length - 2])} or more`,
          color: colors[breaks.length - 1],
        });
        continue;
      }

      if (i === 0) {
        breaksArray.push({
          label: isPercent ? `Less than ${format(breaks[0])}` : `Under ${format(breaks[0])}`,
          color: colors[0],
        });
        continue;
      }

      breaksArray.push({
        label: `${format(breaks[i - 1])} to ${format(breaks[i])}`,
        color: colors[i],
      });
    }
    return breaksArray;
  },

  didUpdateAttrs() {
    const map = this.get('map');
    const sources = this.get('mapConfig.sources');
    sources.forEach((source) => {
      if (!map.getSource(source.id)) {
        map.addSource(source.id, source);
      }
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

      sources.forEach((source) => {
        map.addSource(source.id, source);
      });
    },

    handleMouseMove(e) {
      const layers = this.get('mapConfig.layers').map(d => d.id);
      const feature = e.target.queryRenderedFeatures(e.point, { layers })[0];
      const popup = this.get('popup');
      const map = this.get('map');

      if (feature) {
        // set the highlighted feature
        this.set('highlightedFeature', feature);

        // configure the popup
        popup.setLngLat(e.lngLat)
          .setHTML(`${feature.properties.name} ${feature.properties.value} ${feature.properties.actual ? feature.properties.actual : ''}`)
          .addTo(this.get('map'));
      } else {
        this.set('highlightedFeature', null);
        popup.remove();
      }

      map.getCanvas().style.cursor = feature ? 'pointer' : '';
    },
  },
});
