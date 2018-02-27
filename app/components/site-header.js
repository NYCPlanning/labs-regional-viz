import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  classNames: ['site-header'],
  closed: true,

  model: {
    maps: [],
  },

  @computed('model.maps')
  filteredMapLinks(maps) {
    return maps.filter(map => map.hasNarrative);
  },
});
