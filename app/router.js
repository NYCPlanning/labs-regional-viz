import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import config from 'labs-regional-viz/config/environment';

export default class Router extends EmberRouter {
  @service metrics;

  didTransition(...args) {
    super.didTransition(...args);
    this._trackPage();
  }

  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      const page = this.url;
      const title = (this.currentRouteName === undefined ? 'unknown' : this.currentRouteName);
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
