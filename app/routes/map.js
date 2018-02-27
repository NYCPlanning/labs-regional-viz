import Ember from 'ember';

import Route from '@ember/routing/route';
import carto from 'ember-jane-maps/utils/carto';

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
      });
  },
});
