import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() { // eslint-disable-line
  this.route('page', { path: '/:slug' });
  this.route('map', { path: ':categorySlug/:slug' });
});

export default Router;
