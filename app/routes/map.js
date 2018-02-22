import Ember from 'ember';

import Route from '@ember/routing/route';
import carto from 'ember-jane-maps/utils/carto';

const { Promise } = Ember.RSVP;

export default Route.extend({
  model({ slug }) {
    console.log('MODEL')
    const { maps = [] } = this
      .modelFor('application');



    const mapConfig = maps.findBy('slug', slug).map[0];

    console.log('mapconfig', mapConfig)


    const { sources } = mapConfig;

    console.log('sources', sources)


    const cartoSourcePromises = Object.keys(sources)
      .filter(key => sources[key].type === 'cartovector')
      .map((key) => {
        console.log(key)
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

    // mapConfig.sources = Promise.all(cartoSourcePromises)

    return Promise.all(cartoSourcePromises)
      .then(cartoPromises => {
        mapConfig.sources = cartoPromises;
        return mapConfig;
      });
  }
});
