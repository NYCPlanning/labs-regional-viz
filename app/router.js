import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
<<<<<<< HEAD
  this.route('narrative', { path: ':category/:slug' });
  this.route('map', { path: '/map/:slug' });
=======
  this.route('page', { path: '/:slug' });
  this.route('map', { path: ':category/:slug' });
>>>>>>> develop
});

export default Router;
