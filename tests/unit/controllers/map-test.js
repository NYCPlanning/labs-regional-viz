import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:map', 'Unit | Controller | map', {
  // Specify the other units that are required for this test.
  needs: ['controller:application', 'service:metrics']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
