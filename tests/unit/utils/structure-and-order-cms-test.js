import structureAndOrderCms from 'labs-regional-viz/utils/structure-and-order-cms';
import { module, test } from 'qunit';

module('Unit | Utility | structure and order cms');

const testData = {
   "maps":{
      "housing1":{
         "slug":"housing-1",
      },
      "housing2":{
         "slug":"housing-2",
      },
      "housing3":{
         "slug":"housing-3",
      },
   },
   "meta":{
      "orderings":{
         "maps":[
            {
               "id":"housing-3",
               "hasNarrative":true
            },
            {
               "id":"housing-2",
               "hasNarrative":true
            },
            {
               "id":"housing-1",
               "hasNarrative":true
            },
         ]
      }
   },
};

// Replace this with your real tests.
test('it works', function(assert) {
  let thisTestData = Object.assign({}, testData);
  let result = structureAndOrderCms(thisTestData);
  assert.ok(result);
});

test('it orders according to the orderings metadata', function(assert) {
  const naturalObjectOrder = Object.keys(testData.maps).join();
  let result = structureAndOrderCms(testData).maps.map(({ slug }) => slug).join();

  // respects "implied" unsafe object prop order
  assert.equal(naturalObjectOrder, 'housing1,housing2,housing3');

  // respects explicit object ordering
  assert.equal(result, 'housing-3,housing-2,housing-1');
});
