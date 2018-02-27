import Route from '@ember/routing/route';
import fetch from 'fetch';

import structureContentData from '../utils/structure-and-order-cms';

export default Route.extend({
  model() {
    return fetch('/assets/cms/content.json')
      .then(blob => blob.json())
      .then(json => structureContentData(json));
  },
});
