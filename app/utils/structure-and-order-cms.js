import { set } from '@ember/object';
import { merge } from '@ember/polyfills';

export default function structureAndOrderCms(json) {
  const mutatedJson = json;
  const { meta: { orderings = {} } } = mutatedJson;

  // turn everything except meta into arrays of objects
  const keys = Object.keys(mutatedJson).filter(key => key !== 'meta');
  keys.forEach((key) => {
    const collection = Object.values(mutatedJson[key]);

    // check for ordering and apply it
    if (orderings[key]) {
      orderings[key].forEach((ordering, index) => {
        const { id } = ordering;
        const mutatedItem = collection.findBy('slug', id);
        if (mutatedItem) {
          set(mutatedItem, 'position', index);
          merge(mutatedItem, ordering);
        }
      });
    }

    mutatedJson[key] = collection.sortBy('position');
  });

  return mutatedJson;
}
