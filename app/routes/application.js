import Route from '@ember/routing/route';
import fetch from 'fetch';

export default Route.extend({
  model() {
    return fetch('/assets/cms/content.json').then(blob => blob.json()).then(({ config }) => config);
  },
});
