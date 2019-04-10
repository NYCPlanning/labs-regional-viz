import { next } from '@ember/runloop';
import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { inject } from '@ember-decorators/controller';

export default class MapController extends Controller {
  queryParams = [
    {
      narrativeVisible: {
        scope: 'controller',
      },
    },
  ]

  @inject
  application;

  // @argument
  narrativeVisible = true

  @computed('application.model.maps', 'model.slug')
  get previousNarrative() {
    const maps = this.get('application.model.maps');
    const currentSlug = this.get('model.slug');
    const mapNarratives = maps.filter(map => map.isLinearNarrative);
    const currentPosition = mapNarratives.findIndex(map => map.slug === currentSlug);

    return mapNarratives[currentPosition - 1];
  }

  @computed('application.model.maps', 'model.slug')
  get nextNarrative() {
    const maps = this.get('application.model.maps');
    const currentSlug = this.get('model.slug');
    const mapNarratives = maps.filter(map => map.isLinearNarrative);
    const currentPosition = mapNarratives.findIndex(map => map.slug === currentSlug);

    return mapNarratives[currentPosition + 1];
  }

  @action
  toggleNarrative() {
    this.toggleProperty('narrativeVisible');

    next(function() {
      window.dispatchEvent(new Event('resize'));
    });
  }
}
