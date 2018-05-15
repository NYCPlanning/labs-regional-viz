import { moduleFor, test } from 'ember-qunit';

moduleFor('route:page', 'Unit | Route | page', {
  // Specify the other units that are required for this test.
  needs: ['service:scroller', 'service:metrics']
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
