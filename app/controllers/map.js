import { next } from '@ember/runloop';
import Controller, { inject } from '@ember/controller';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  queryParams: [
    {
      narrativeVisible: {
        scope: 'controller',
      },
    },
  ],

  application: inject(),
  narrativeVisible: true,

  @computed('application.model.maps', 'model.slug')
  previousNarrative(maps, currentSlug) {
    const mapNarratives = maps.filter(map => map.hasNarrative);
    const currentPosition = mapNarratives.findIndex(map => map.slug === currentSlug);

    return mapNarratives[currentPosition - 1];
  },

  @computed('application.model.maps', 'model.slug')
  nextNarrative(maps, currentSlug) {
    const mapNarratives = maps.filter(map => map.hasNarrative);
    const currentPosition = mapNarratives.findIndex(map => map.slug === currentSlug);

    return mapNarratives[currentPosition + 1];
  },

  actions: {
    toggleNarrative() {
      this.toggleProperty('narrativeVisible');

      next(function() {
        window.dispatchEvent(new Event('resize'));
      });
    },
  },
});
