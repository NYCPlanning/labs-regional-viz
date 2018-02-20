import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('narratives', { path: ':category/:slug' });
  this.route('maps', { path: '/:slug' });
});

export default Router;
