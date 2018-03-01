import { test } from 'qunit';
import moduleForAcceptance from 'labs-regional-viz/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | click through routes');

test('user can toggle narrative off and on', function(assert) {
  visit('/');
  click('.narrative-toggle');

  andThen(function() {
    assert.equal(find('.narrative-toggle').length, 0);
    assert.equal(find('.narrative-link').length, 1);
  });
});

test('index redirects to welcome/intro', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/welcome/intro');
  });
});

test('user can click "next" from intro', function(assert) {
  visit('/');
  click('.pagination-next a');

  andThen(function() {
    assert.equal(currentURL().indexOf('/welcome/intro'), -1);
  });
});

