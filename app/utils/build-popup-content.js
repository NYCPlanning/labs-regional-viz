import numeral from 'numeral';

export default function buildPopupContent(data, geographyLevel, popupColumns, isPermitMap, isPercent) {
  const reliabilityDisclaimer = '<p class="popup-footer">Grayed values are not statistically reliable.</p>';
  let popupFooter = '';

  // create rows for the table body
  let rowStrings = data.map((rowData) => {
    const isHighlighted = geographyLevel === rowData.geomtype ? 'highlighted' : '';
    const columnTitles = popupColumns.map(d => d.id);
    const columns = columnTitles.map((id) => {
      const value = rowData[id];
      const isLarge = popupColumns
        .find(d => d.id === id).large;

      let formattedValue = 'N/A';
      if (value !== null) {
        if (value >= 10000) {
          formattedValue = numeral(value).format('0.0a');
        } else {
          formattedValue = isPercent ? numeral(value).format('0,0%') : numeral(value).format('0,0');
        }
      }

      let isInsignificant = false;
      if (
        formattedValue === 'N/A' ||
        (rowData.cv >= 20 && rowData.cv !== null) ||
        (rowData.sig <= 1.645 && rowData.sig !== null)
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
      if (rowData.houptest === 'N') {
        return '';
      }
    } else if (rowData.islitown === 'Y') {
      // If it's not a Permit Map, always hide the Long Island town rows
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
