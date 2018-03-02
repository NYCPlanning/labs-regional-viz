import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('geometry-toggle', 'Integration | Component | geometry toggle', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{geometry-toggle}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#geometry-toggle}}
      template block text
    {{/geometry-toggle}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
