import Route from '@ember/routing/route';

export default Route.extend({
  model({ slug }) {
    return this
      .modelFor('application')
      .narratives
      .findBy('slug', slug);
  }
});
