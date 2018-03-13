import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('legend-box', 'Integration | Component | map utility box', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{legend-box}}`);

  assert.equal(!!this.$(), true);
});

test('it displays legend', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  const breaks = [
    { color: '#d76423', label: -0.025 },
    { color: '#ffa555', label: -0.01 },
    { color: '#ffffe0', label: 0.01 },
    { color: '#b3e4ff', label: 0.025 },
    { color: '#5ab4ff', label: 0.05 },
    { color: '#004da8', label: 1 },
  ];

  this.set('breaks', breaks);
  this.render(hbs`{{legend-box breaks=breaks}}`);

  assert.equal(this.$('.legend-item').length, 6);
});

test('it displays toggle from data', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  const toggles = [
    { layerIds: 'map-id-1', type: 'county' },
    { layerIds: 'map-id-1', type: 'subregion' },
    { layerIds: 'map-id-1', type: 'region' },
  ];

  this.set('toggles', toggles);
  this.render(hbs`{{legend-box toggles=toggles}}`);

  assert.equal(this.$('.toggle-list-item').length, 3);
});
