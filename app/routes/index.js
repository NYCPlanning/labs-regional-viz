import Route from '@ember/routing/route';

export default Route.extend({
  redirect({ maps }) {
    const [firstMap] = maps;
    const { categorySlug, slug } = firstMap;
    this.transitionTo('map', categorySlug, slug);
  },
});
