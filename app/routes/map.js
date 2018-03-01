import Ember from 'ember';

import Route from '@ember/routing/route';
import { set } from '@ember/object';

import carto from 'ember-jane-maps/utils/carto';
import buildPaint from '../utils/build-mapbox-paint-object';

const { Promise } = Ember.RSVP;

export default Route.extend({
  model({ slug }) {
    const { maps = [] } = this
      .modelFor('application');
    const mapNarrative = maps.findBy('slug', slug);

    // find the first map config because the
    // design doesn't support multiple
    const mapConfig = mapNarrative.map;
    const { sources } = mapConfig;

    const cartoSourcePromises = Object.keys(sources || {})
      .filter(key => sources[key].type === 'cartovector')
      .map((key) => {
        const source = sources[key];
        const { minzoom = 0 } = source;

        return carto.getVectorTileTemplate(source['source-layers'])
          .then(template => ({
            id: source.id,
            type: 'vector',
            tiles: [template],
            minzoom,
          }));
      });

    return Promise.all(cartoSourcePromises)
      .then((cartoPromises) => {
        mapConfig.sources = cartoPromises;
        return mapNarrative;
      })
      .then((enrichedMapNarrative) => {
        const { map: { layers } } = enrichedMapNarrative;
        const builtLayers = [];

        layers.forEach((layer) => {
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

        set(enrichedMapNarrative, 'map.mapboxLayers', builtLayers);
        // set(enrichedMapNarrative, 'map.legends', layers);
        return enrichedMapNarrative;
      });
  },
});
