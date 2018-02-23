import { next } from '@ember/runloop';
import Controller from '@ember/controller';

export default Controller.extend({
  narrativeVisible: true,

  actions: {
    toggleNarrative() {
      this.toggleProperty('narrativeVisible');

      next(function() {
        window.dispatchEvent(new Event('resize'));
      });
    },
  },
});
