import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { computed } from 'ember-decorators/object';
import carto from 'ember-jane-maps/utils/carto';

export default Component.extend({
  classNameBindings: ['narrativeVisible:narrative-visible'],
  classNames: 'map-container cell large-auto',

  // noop for passed context
  toggleNarrative() {},
  mapConfig: {},

  zoom: 6.8,
  center: [-73.869324, 40.815888],

  highlightedFeature: null,

  popup: new mapboxgl.Popup({
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

  didUpdateAttrs() {
    const map = this.get('map');
    const sources = this.get('mapConfig.sources');
    const popup = this.get('popup');

    sources.forEach((source) => {
      if (!map.getSource(source.id)) {
        map.addSource(source.id, source);
      }
    });

    popup.remove();
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
      const map = this.get('map');

      if (feature) {
        // set the highlighted feature
        this.set('highlightedFeature', feature);
        map.getSource('highlighted-feature').setData(feature);
      } else {
        this.set('highlightedFeature', null);
      }

      map.getCanvas().style.cursor = feature ? 'pointer' : '';
    },

    handleMouseClick(e) {
      const layers = this.get('visibleLayers').map(d => d.id);
      const feature = e.target.queryRenderedFeatures(e.point, { layers })[0];
      const popup = this.get('popup');

      if (feature) {

        const { geoid } = feature.properties;

        const SQL = `
          WITH municipality AS (
            SELECT 'municipality' as geomtype, namelsad as name, countyfp, statefp, subregid, houp1016 as value FROM planninglabs.region_municipality_v0
            WHERE geoid = '${geoid}'
          )

          SELECT 'subregion' as geomtype, a.name, houp1016 as value FROM planninglabs.region_subregion_v0 a, municipality
          WHERE geoid = municipality.subregid

          UNION ALL

          SELECT 'county' as geomtype, a.name, houp1016 as value FROM planninglabs.region_county_v0 a, municipality
          WHERE geoid = (municipality.statefp || municipality.countyfp)

          UNION ALL

          SELECT geomtype::text, name, value FROM municipality
        `;

        carto.SQL(SQL)
          .then((data) => {
            console.log(data)
            // configure the popup
            popup.setLngLat(e.lngLat)
              .setHTML(`${data[0].value} ${data[1].value} ${data[2].value}`)
              // .setHTML(`${feature.properties.name} ${feature.properties.value} ${feature.properties.actual ? feature.properties.actual : ''}`)
              .addTo(this.get('map'));
          });

      } else {
        popup.remove();
      }
    },
  },
});
