import Component from '@ember/component';
import { computed } from 'ember-decorators/object'; // eslint-disable-line
import { argument } from '@ember-decorators/argument'; // eslint-disable-line
import numeral from 'numeral';


function getChoroplethRows(layerConfig, isPercent, isChangeMeasurement, isRatio) {
  // return an array of objects, each with a display-ready range and color
  const { paintConfig: config = {} } = layerConfig || {};
  const { breaks = [], colors = [] } = config;
  const format = (value) => { // eslint-disable-line

    let formatter = '0,0';
    if (value >= 10000) formatter = '0.0a';
    if (isPercent) formatter = '0,0%';
    if (isRatio) formatter = '0.00';
    if (isChangeMeasurement) formatter = '+0,0';
    if (isPercent && isChangeMeasurement) formatter = '+0.0%';
    if (isRatio && isChangeMeasurement) formatter = '+0.00';

    return numeral(value).format(formatter);
  };

  let lowBreakPrefix = 'Under';
  let lowBreakSuffix = '';
  let highBreakPrefix = 'Over';
  let highBreakSuffix = '';

  if (isChangeMeasurement) {
    lowBreakPrefix = 'Loss of';
    lowBreakSuffix = 'or more';
    highBreakPrefix = 'Gain of';
    highBreakSuffix = 'or more';
  }

  if (isPercent) {
    lowBreakPrefix = 'Less than';
    lowBreakSuffix = '';
    highBreakPrefix = '';
    highBreakSuffix = 'or more';
  }

  const breaksArray = [];

  for (let i = breaks.length; i >= 0; i -= 1) {
    // Handles the highest break
    if (i === breaks.length) {
      breaksArray.push({
        label: `${highBreakPrefix} ${format(breaks[breaks.length - 1])} ${highBreakSuffix}`,
        color: colors[breaks.length],
      });
      continue; // eslint-disable-line
    }

    // Handles the lowset break
    if (i === 0) {
      breaksArray.push({
        label: `${lowBreakPrefix} ${format(breaks[0])} ${lowBreakSuffix}`,
        color: colors[0],
      });
      continue; // eslint-disable-line
    }

    // Handles all other breaks
    breaksArray.push({
      label: `${format(breaks[i - 1])} to ${format(breaks[i])}`,
      color: colors[i],
    });
  }

  return breaksArray;
}

export default class LegendBox extends Component {
  handleGeographyLevelToggle() {} // eslint-disable-line

  @argument
  currentLayerGroup

  @argument
  mapConfig

  @computed('currentLayerGroup', 'isPercent', 'isChangeMeasurement', 'isRatio')
  get rows() {
    const layerConfig = this.get('currentLayerGroup');
    const isPercent = this.get('isPercent');
    const isChangeMeasurement = this.get('isChangeMeasurement');
    const isRatio = this.get('isRatio');
    const { legend } = layerConfig;
    if (typeof legend === 'string') {
      return getChoroplethRows(layerConfig.layers.find(layer => layer.id === legend), isPercent, isChangeMeasurement, isRatio);
    }

    return layerConfig.legend;
  }
}
