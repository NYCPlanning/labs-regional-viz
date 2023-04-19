import { next } from '@ember/runloop';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  scroller: service(),

  model({ slug }) {
    const { pages = [] } = this
      .modelFor('application');

    return pages
      .findBy('slug', slug);
  },

  actions: {
    didTransition() {
      const { scroller } = this;
      const section = window.location.hash.substr(1);

      // add defensive condition for special mapbox hash,
      // which always includes slashes
      if (section && !section.includes('/')) {
        next(this, () => {
          scroller.scrollVertical(`#${section}`);
        });
      }
    },
  },
});
