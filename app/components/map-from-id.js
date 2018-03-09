import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { computed } from 'ember-decorators/object';
import { get } from '@ember/object';
import carto from 'ember-jane-maps/utils/carto';
import numeral from 'numeral';
import getPopupSQL from '../utils/get-popup-sql';

export default Component.extend({
  classNameBindings: ['narrativeVisible:narrative-visible'],
  classNames: 'map-container cell large-auto',
  toggledGeographyLevel: null,

  // noop for passed context
  toggleNarrative() {},
  mapConfig: {},

  zoom: 6.8,
  center: [-73.869324, 40.815888],

  highlightedFeature: null,

  popup: new mapboxgl.Popup({
    closeOnClick: false,
  }),

  @computed('mapConfig', 'toggledGeographyLevel')
  geographyLevel(defaultGeographyLevel = 'county', toggledGeographyLevel = null) {
    if (toggledGeographyLevel) {
      return toggledGeographyLevel;
    }
    return get(defaultGeographyLevel, 'defaultGeographyLevel');
  },

  @computed('mapConfig', 'geographyLevel')
  currentLayerConfig(mapConfig, geographyLevel) {
    const { toggles = [] } = mapConfig;
    const foundLayer = toggles.find(d => d.type === geographyLevel) || {};
    const { layerId: currentLayerId } = foundLayer;

    return mapConfig.layers.find(d => d.id === currentLayerId);
  },

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
  visibleLayers({ mapboxLayers: layers = [], toggles = [] }, selectedGeographyLevel) {
    // find toggle-able layers to hide
    // 1. find which toggle-ables are not selected
    // 2. grab those from the layers
    const hiddenLayersIDs = toggles
      .filter(toggle => toggle.type !== selectedGeographyLevel)
      .mapBy('layerId');

    return layers
      .filter(layer => !hiddenLayersIDs.some(layerId => (layer.id === layerId || layer.id === `${layerId}-line`)));
  },

  didReceiveAttrs() {
    const previousNarrativeVisible = this.get('previousNarrativeVisible');
    const narrativeVisible = this.get('narrativeVisible');

    if (previousNarrativeVisible === narrativeVisible) {
      this.set('toggledGeographyLevel', null);
    }

    this.set('previousNarrativeVisible', narrativeVisible);
  },

  didUpdateAttrs() {
    const map = this.get('map');
    if (!map) return;
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
      const { isPercent, popupColumns } = this.get('mapConfig');

      // Add the popup with a spinner before loading its data
      popup.setLngLat(e.lngLat)
        .setHTML('<i aria-hidden="true" class="fa fa-spinner fa-spin medium-gray fa-3x fa-fw"></i>')
        .addTo(this.get('map'));

      // Add data to the popup
      if (feature) {
        const SQL = getPopupSQL(e.lngLat, this.get('mapConfig'), this.get('geographyLevel'));
        const geographyLevel = this.get('geographyLevel');

        carto.SQL(SQL)
          .then((data) => {
            console.log(data)
            let rowStrings = data.map((rowData) => {
              const isHighlighted = geographyLevel === rowData.geomtype ? 'highlighted' : '';
              const columnTitles = popupColumns.map(d => d.title);

              const columns = columnTitles.map((title) => {
                const { columnName } = popupColumns
                  .find(d => d.title === title).values // filter for matching columns
                  .find(d => d.geomType === rowData.geomtype); // filter for matching geomType

                console.log(rowData, columnName)
                // use the columnName to look up the corresponding value in the data
                const value = rowData[title];

                return (`
                  <td class="value text-right">
                    ${isPercent ? numeral(value).format('0,0%') : numeral(value).format('0.0a')}
                  </td>
                `);
              }).join('');


              // build a row with a column for each columntitle
              return (`
                <tr class="${isHighlighted}">
                  <td class="geom">
                    <small class="geom-type">${rowData.geomtype}</small>
                    <span class="geom-name">${rowData.name}</span>
                  </td>
                  ${columns}
                </tr>
              `);
            });

            rowStrings = rowStrings.join('');

            popup.setLngLat(e.lngLat)
              .setHTML(`<table class="popup-table"><tbody>${rowStrings}</tbody></table>`);
          });
      } else {
        popup.remove();
      }
    },

    handleGeographyLevelToggle(geog) {
      const popup = this.get('popup');

      popup.remove();
      this.set('toggledGeographyLevel', geog);
    },
  },
});
