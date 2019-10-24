import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, click, find, pauseTest, currentURL } from '@ember/test-helpers';

module('Acceptance | click through routes', function(hooks) {
  setupApplicationTest(hooks);

  test('user can toggle narrative off and on', async function(assert) {
    await visit('/');
    await click('.narrative-toggle');

    assert.equal(find('.narrative-toggle'), undefined);
    assert.ok(find('.narrative-link'));
  });

  test('index redirects to welcome/intro', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/welcome/intro');
  });

  test('user can click "next" from intro', async function(assert) {
    await visit('/');
    // await pauseTest();
    await click('.pagination-next');
    // await pauseTest();

    assert.equal(currentURL().indexOf('/welcome/intro'), -1);
  });
});
