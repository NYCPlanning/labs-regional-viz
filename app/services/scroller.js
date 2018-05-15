import Ember from 'ember';
import Scroller from 'ember-scroll-to/services/scroller';

export default Scroller.extend({
  getJQueryElement (target) {
    const jQueryElement = Ember.$(target);

    if (Ember.isEmpty(jQueryElement)) {
      Ember.Logger.warn("element couldn't be found:", target);
      return;
    }

    return jQueryElement;
  },

  scrollable: Ember.computed(function() {
    return Ember.$('#scrollable-content');
  }),
});
