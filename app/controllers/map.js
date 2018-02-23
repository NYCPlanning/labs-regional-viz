import Ember from 'ember';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: [
    {
      narrativeVisible: {
        scope: 'controller',
      },
    },
  ],
  narrativeVisible: true,

  actions: {
    toggleNarrative() {
      this.toggleProperty('narrativeVisible');
      Ember.run.next(function() {
        window.dispatchEvent(new Event('resize'));
      });
    },
  },
});
