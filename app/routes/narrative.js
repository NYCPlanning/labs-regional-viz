import Route from '@ember/routing/route';

export default Route.extend({
  model({ slug }) {
    const { narratives = [] } = this
      .modelFor('application');

    return narratives
      .findBy('slug', slug);
  }
});
