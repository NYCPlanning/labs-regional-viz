import buildPopupContent from 'labs-regional-viz/utils/build-popup-content';
import { module, test } from 'qunit';

module('Unit | Utility | build popup content');

const data = [{"geomtype":"county","name":"Orange","pop":-202,"cv":null,"sig":0.197304},{"geomtype":"subregion","name":"Mid Hudson","pop":-11983,"cv":null,"sig":7.318501},{"geomtype":"region","name":"Total Metro Area","pop":401287,"cv":null,"sig":48.817284}];
const popupColumns = [{"id":"pop","title":"Population","large":true,"values":[{"geomType":"region","columnName":"lfpw0016","cv":null,"sig":"lfpw0016si"},{"geomType":"subregion","columnName":"lfpw0016","cv":null,"sig":"lfpw0016si"},{"geomType":"county","columnName":"lfpw0016","cv":null,"sig":"lfpw0016si"}]}];


// Replace this with your real tests.
test('it renders a table tag', function(assert) {
  let result = buildPopupContent(data, 'county', popupColumns, false);

  const foundTable = result.indexOf('<table class="popup-table">') > -1
  assert.ok(result);
  assert.equal(foundTable, true)
});
