import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { computed } from 'ember-decorators/object';
import numeral from 'numeral';
import carto from 'ember-jane-maps/utils/carto';

import railConfig from '../supporting-layers/rail';
import aerialsConfig from '../supporting-layers/aerials';


function buildPaint({
  colors,
  breaks,
  opacity,
}) {
  const paint = {
    'fill-color': [
      'step',
      ['get', 'value'],
    ],
    'fill-opacity': opacity,
  };
  const colorArray = paint['fill-color'];

  // there will always be 1 more color than breaks
  colorArray.push(colors[0]);

  breaks.forEach((color, i) => {
    colorArray.push(breaks[i]);
    colorArray.push(colors[i + 1]);
  });

  return paint;
}

export default Component.extend({
  classNameBindings: ['narrativeVisible:narrative-visible'],
  classNames: 'map-container cell large-auto',

  // noop for passed context
  toggleNarrative() {},
  mapConfig: {},

  zoom: 6.8,
  center: [-73.869324, 40.815888],

  highlightedFeature: null,
  railVisible: false,
  railConfig,
  aerialsConfig,
  railSource: null,

  aerialVisible: false,

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
    type: 'line',
    source: 'highlighted-feature',
    paint: {
      'line-color': '#555555',
      'line-opacity': 0.8,
      'line-width': {
        stops: [
          [8, 2],
          [11, 4],
        ],
      },
    },
  },

  @computed('mapConfig', 'geographyLevel')
  visibleLayers({ layers = [], toggles = [] }, selectedGeographyLevel) {
    // find toggle-able layers to hide
    // 1. find which toggle-ables are not selected
    // 2. grab those from the layers
    const hiddenLayersIDs = toggles
      .filter(toggle => toggle.type !== selectedGeographyLevel)
      .mapBy('layerId');

    return layers
      .filter(layer => !hiddenLayersIDs.some(layerId => (layer.id === layerId || layer.id === `${layerId}-line`)));
  },

  @computed('visibleLayers')
  builtLayers(visibleLayers) {
    const builtLayers = [];
    const mutatedLayers = visibleLayers;

    mutatedLayers.forEach((layer) => {
      if (layer.type === 'choropleth') {
        const { id, source, paintConfig } = layer;

        builtLayers.push({
          id,
          type: 'fill',
          source,
          'source-layer': layer['source-layer'],
          paint: buildPaint(paintConfig),
        });

        // for choropleth fill layers, push an outlines line layer as well
        builtLayers.push({
          id: `${id}-line`,
          type: 'line',
          source,
          'source-layer': layer['source-layer'],
          paint: {
            'line-color': 'rgba(131, 131, 131, 1)',
            'line-width': 0.5,
          },
        });
      } else {
        // no building necessary if not type choropleth
        builtLayers.push(layer);
      }
    });

    return builtLayers;
  },

  @computed('mapConfig')
  breaks(mapConfig) {
    // return an array of objects, each with a display-ready range and color
    const { layers = [] } = mapConfig;
    const [firstLayer = {}] = layers;
    const { paintConfig: config = {} } = firstLayer;
    const { isPercent, breaks = [], colors = [] } = config;

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
        continue; // eslint-disable-line
      }

      if (i === 0) {
        breaksArray.push({
          label: isPercent ? `Less than ${format(breaks[0])}` : `Under ${format(breaks[0])}`,
          color: colors[0],
        });
        continue; // eslint-disable-line
      }

      breaksArray.push({
        label: `${format(breaks[i - 1])} - ${format(breaks[i])}`,
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

      map.addSource('highlighted-feature', this.get('highlightedFeatureSource'));
    },

    handleMouseMove(e) {
      const layers = this.get('visibleLayers').map(d => d.id);
      const feature = e.target.queryRenderedFeatures(e.point, { layers })[0];
      const popup = this.get('popup');
      const map = this.get('map');

      if (feature) {
        // set the highlighted feature
        this.set('highlightedFeature', feature);
        map.getSource('highlighted-feature').setData(feature);

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

    toggleRail() {
      // set railSource if user is toggling rails on.
      if (!this.get('railVisible')) {
        const source = this.get('railConfig.source');
        carto.getVectorTileTemplate(source['source-layers'])
          .then(template => ({
            id: source.id,
            type: 'vector',
            tiles: [template],
          }))
          .then((builtSource) => {
            this.set('railSource', builtSource);
          });
      }


      this.toggleProperty('railVisible');
    },

    toggleAerial() {
      this.toggleProperty('aerialVisible');
    },
  },
});
