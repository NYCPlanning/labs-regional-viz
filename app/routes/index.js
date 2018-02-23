import Route from '@ember/routing/route';

export default Route.extend({
  redirect({ maps }) {
    const [firstMap] = maps;
    const { category, slug } = firstMap;
    this.transitionTo('map', category, slug);
  },
});
