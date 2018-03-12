import numeral from 'numeral';

export default function buildPopupContent(data, geographyLevel, popupColumns, isPercent) {
  console.log(JSON.stringify(data));
  console.log(JSON.stringify(popupColumns));
  console.log(JSON.stringify(isPercent));


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
      }

      return (`
        <td class="${isLarge ? 'large' : ''} ${isInsignificant ? 'medium-gray' : ''} text-right">
          ${formattedValue}
        </td>
      `);
    }).join('');

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
  `;
}
