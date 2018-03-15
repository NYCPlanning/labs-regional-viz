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
      const scroller = this.get('scroller');
      const section = window.location.hash.substr(1);

      if (section) {
        next(this, () => {
          scroller.scrollVertical(`#${section}`, {
          });
        });
      }
    },
  },
});
