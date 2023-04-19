import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from './config/environment';

export default class Router extends EmberRouter {
  @service metrics;

  didTransition(...args) {
    this._super(...args);
    this._trackPage();
  }

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');
      this.metrics.trackPage({ page, title });
    });
  }

  location = config.locationType;

  rootURL = config.rootURL;
}

Router.map(function() { // eslint-disable-line
  this.route('page', { path: '/:slug' });
  this.route('map', { path: ':categorySlug/:slug' });
});
