export default function getPopupSQL(lngLat = { lng: 0, lat: 0 }, mapConfig = { popupColumns: [] }, geographyLevel = 'municipality') {
  const { lng, lat } = lngLat;

  const { popupColumns } = mapConfig;

  function getPopupValue(geomType) {
    const selectChunks = [];
    popupColumns.forEach((columnConfig) => {
      const match = columnConfig.values.find(d => d.geomType === geomType);
      if (match) selectChunks.push(`${match.columnName} AS ${columnConfig.id}`);
      console.log(match.columnName);
    });

    if (selectChunks.length === 0) return '';
    return `,${selectChunks.join(',')}`; // prepend comma
  }

  const SQLArray = [];

  SQLArray.push(`
    SELECT 'region' as geomtype, 'Total Metro Area' as name ${getPopupValue('region')}
    FROM region_region_v0
  `);

  if (getPopupValue('subregion')) {
    SQLArray.push(`
      SELECT 'subregion' as geomtype, name as name ${getPopupValue('subregion')}
      FROM region_subregion_v0
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  if (geographyLevel === 'subregion') return SQLArray.reverse().join(' UNION ALL ');

  if (getPopupValue('county')) {
    SQLArray.push(`
      SELECT 'county' as geomtype, name as name ${getPopupValue('county')}
      FROM region_county_v0
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  if (geographyLevel === 'county') return SQLArray.reverse().join(' UNION ALL ');

  if (getPopupValue('municipality')) {
    SQLArray.push(`
      SELECT 'municipality' as geomtype, namelsad as name ${getPopupValue('municipality')}
      FROM region_municipality_v0
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  return SQLArray.reverse().join(' UNION ALL ');
}
