import EmberRouter from '@ember/routing/router';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from './config/environment';

const Router = EmberRouter.extend({
  metrics: service(),

  didTransition(...args) {
    this._super(...args);
    this._trackPage();
  },

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');
      get(this, 'metrics').trackPage({ page, title });
    });
  },

  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() { // eslint-disable-line
  this.route('page', { path: '/:slug' });
  this.route('map', { path: ':categorySlug/:slug' });
});

export default Router;
