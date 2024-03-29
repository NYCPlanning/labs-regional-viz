export default function getPopupSQL(lngLat = { lng: 0, lat: 0 }, mapConfig = { popupColumns: [] }, geographyLevel = 'municipality') {
  const { lng, lat } = lngLat;

  const { popupColumns } = mapConfig;

  function getPopupValue(geomType) {
    const selectChunks = [];
    popupColumns.forEach((columnConfig) => {
      const match = columnConfig.values.find(d => d.geomType === geomType);
      if (match) selectChunks.push(`${match.columnName} AS ${columnConfig.id}, ${match.cv} AS ${columnConfig.id}_cv, ${match.sig} AS ${columnConfig.id}_sig`);
    });

    if (selectChunks.length === 0) return '';
    return `,${selectChunks.join(',')}`; // prepend comma
  }

  const SQLArray = [];

  SQLArray.push(`
    SELECT 'region' as geomtype, null as islitown, null as ishouperm, null as iscommap, null as iscomnycwork, null as iscomnycres, name as name ${getPopupValue('region')}
    FROM region_region_v220615
  `);

  if (getPopupValue('subregion')) {
    SQLArray.push(`
      SELECT 'subregion' as geomtype, null as islitown, null as ishouperm, null as iscommap, null as iscomwork, null as iscomres, name as name ${getPopupValue('subregion')}
      FROM region_subregion_v220615
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  if (geographyLevel === 'subregion') return SQLArray.reverse().join(' UNION ALL ');

  if (getPopupValue('county')) {
    SQLArray.push(`
      SELECT 'county' as geomtype, null as islitown, null as ishouperm, iscommap, iscomwork, iscomres, name as name ${getPopupValue('county')}
      FROM region_county_v220615
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  if (geographyLevel === 'county') return SQLArray.reverse().join(' UNION ALL ');

  if (getPopupValue('municipality')) {
    SQLArray.push(`
      SELECT 'municipality' as geomtype, islitown, ishouperm, null as iscommap, null as iscomwork, null as iscomres, namelsad as name ${getPopupValue('municipality')}
      FROM region_municipality_v220615
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  return SQLArray.reverse().join(' UNION ALL ');
}
