import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import numeral from 'numeral';

export default Component.extend({
  handleGeographyLevelToggle() {},
  currentLayerConfig: {},
  mapConfig: {},

  // TODO: Don't use firstLayer. Nix this when making legends update on geographyLevel change.
  @computed('currentLayerConfig')
  layerTitle({ title = '' } = {}) {
    return title;
  },

  @computed('currentLayerConfig', 'isPercent', 'isChangeMeasurement')
  breaks(layerConfig, isPercent, isChangeMeasurement) {
    // return an array of objects, each with a display-ready range and color
    const { paintConfig: config = {} } = layerConfig || {};
    const { breaks = [], colors = [] } = config;

    const format = (value) => { // eslint-disable-line

      let formatter = '0.0a';
      if (isPercent) formatter = '0.0%';
      if (isChangeMeasurement) formatter = '+0.0';
      if (isPercent && isChangeMeasurement) formatter = '+0.0%';

      return numeral(value).format(formatter);
    };

    const breaksArray = [];

    for (let i = breaks.length; i >= 0; i -= 1) {
      if (i === breaks.length) {
        breaksArray.push({
          label: `${format(breaks[breaks.length - 1])} or more`,
          color: colors[breaks.length],
        });
        continue; // eslint-disable-line
      }

      if (i === 0) {
        breaksArray.push({
          label: isPercent ? `Less than ${format(breaks[0])}` : `Under ${format(breaks[0])}`,
          color: colors[0],
        });
        continue; // eslint-disable-line
      }

      breaksArray.push({
        label: `${format(breaks[i - 1])} to ${format(breaks[i])}`,
        color: colors[i],
      });
    }
    return breaksArray;
  },
});
