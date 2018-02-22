import Route from '@ember/routing/route';

export default Route.extend({
  model({ slug }) {
    const { maps = [] } = this
      .modelFor('application');

    return maps
      .findBy('slug', slug);
  }
});
