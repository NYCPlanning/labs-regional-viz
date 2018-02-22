import Ember from 'ember';
import Controller from '@ember/controller';

export default Controller.extend({
  narrativeVisible: true,

  actions: {
    toggleNarrative() {
      this.toggleProperty('narrativeVisible');
      Ember.run.next(function() {
        window.dispatchEvent(new Event('resize'));
      });
    }
  },
});
