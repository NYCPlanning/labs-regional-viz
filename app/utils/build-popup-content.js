import numeral from 'numeral';

export default function buildPopupContent(data, geographyLevel, popupColumns, isPermitMap, isComNycWork, isComNycRes, isPercent, isRatio, isChangeMeasurement) {
  const reliabilityDisclaimer = '<p class="popup-footer">Grayed values are not statistically reliable.</p>';
  let popupFooter = '';

  // create rows for the table body
  let rowStrings = data.map((rowData) => {
    const isHighlighted = geographyLevel === rowData.geomtype ? 'highlighted' : '';
    const columnTitles = popupColumns.map(d => d.id);
    const columns = columnTitles.map((id) => {
      const value = rowData[id];
      const isLarge = popupColumns.find(d => d.id === id).large;
      const { isMOE } = popupColumns.find(d => d.id === id);

      let formattedValue = 'N/A';
      if (value !== null) {
        formattedValue = numeral(value).format('0,0');
        if (value >= 10000) formattedValue = numeral(value).format('0.0a');
        if (isPercent) formattedValue = numeral(value).format('0,0%');
        if (isRatio) formattedValue = numeral(value).format('0.00');
        if (isChangeMeasurement) formattedValue = numeral(value).format('+0,0');
        if (isMOE) formattedValue = `±${numeral(value).format('0,0a')}`;
        if (isPercent && isChangeMeasurement) formattedValue = numeral(value).format('+0.0%');
        if (isRatio && isChangeMeasurement) formattedValue = numeral(value).format('+0.00');
        if (isChangeMeasurement && isMOE) formattedValue = `±${numeral(value).format('0,0')}`;
        if (isMOE && isPercent) formattedValue = `±${numeral(value).format('0.0%')}`;
      }

      let isInsignificant = false;
      if (
        (rowData[`${id}_cv`] >= 20 && rowData[`${id}_cv`] !== null)
        || (rowData[`${id}_sig`] <= 1.645 && rowData[`${id}_sig`] !== null)
      ) {
        isInsignificant = true;
        popupFooter = reliabilityDisclaimer;
      }

      return (`
        <td class="${isLarge ? 'large' : ''} ${isInsignificant ? 'medium-gray' : ''} text-right">
          ${formattedValue}
        </td>
      `);
    }).join('');

    // If this is a Permit Map
    if (isPermitMap) {
      // hide the rows that are Long Island municipalities that do not report housing permit data
      if (rowData.houpermits === 'N') {
        return '';
      }
    } else if (rowData.islitown === 'Y') {
      // If it's not a Permit Map, always hide the Long Island town rows
      return '';
    }

    if (isComNycWork) {
      // If this is a NYC Workers county commuting map (isComNycWork===true) indicated in yaml
      if (rowData.iscomnycwork === false) {
        // hide the individual county rows that are instead shown as part of combined geographies
        return '';
      }
    } else if (isComNycRes) {
      // If this is a NYC Residents county commuting map (isComNycRes===true) indicated in yaml
      if (rowData.iscomnycres === false) {
        // hide the individual county rows that are instead shown as part of combined geographies
        return '';
      }
    } else if (rowData.iscommap === true) {
      // If this isn't a commuting map (neither isComNycRes nor isComNycWork)
      // hide the combined geography rows (rows where rowData.iscommap === true)
      return '';
    }

    return (`
      <tr class="${isHighlighted}">
        <td class="geom">
          <small class="geom-type">${rowData.geomtype}</small>
          <span class="geom-name">${rowData.name}</span>
        </td>
        ${columns}
      </tr>
    `);
  });
  rowStrings = rowStrings.join('');

  // create table header cells
  const headerCells = popupColumns.map(d => (
    `<td class="text-right">${d.title}</td>`
  )).join('');

  return `
    <table class="popup-table">
      <thead><td></td>${headerCells}</thead>
      <tbody>${rowStrings}</tbody>
    </table>
    ${popupFooter}
  `;
}
