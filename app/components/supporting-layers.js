import Component from '@ember/component';
import carto from 'ember-jane-maps/utils/carto';

import railConfig from '../supporting-layers/rail';
import aerialsConfig from '../supporting-layers/aerials';

export default Component.extend({
  railVisible: false,
  railConfig,
  aerialsConfig,
  railSource: null,
  aerialVisible: false,

  actions: {
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
