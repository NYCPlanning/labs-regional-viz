import Route from '@ember/routing/route';
import fetch from 'fetch';

export default Route.extend({
  model() {
    return fetch('/config.json').then(blob => blob.json());
  },
});
