import Route from '@ember/routing/route';

export default Route.extend({
  model({ slug }) {
    const { pages = [] } = this
      .modelFor('application');

    return pages
      .findBy('slug', slug);
  },
});
