import { moduleFor, test } from 'ember-qunit';

moduleFor('route:map', 'Unit | Route | map', {
  // Specify the other units that are required for this test.
  needs: ['service:scroller']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
