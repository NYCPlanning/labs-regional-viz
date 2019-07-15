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
    SELECT 'region' as geomtype, null as islitown, null as houptest, null as iscommap, null as iscomnycwork, null as iscomnycres, 'Total Metro Area' as name ${getPopupValue('region')}
<<<<<<< HEAD
    FROM region_region_v20190708
=======
    FROM region_region
>>>>>>> develop
  `);

  if (getPopupValue('subregion')) {
    SQLArray.push(`
      SELECT 'subregion' as geomtype, null as islitown, null as houptest, null as iscommap, null as iscomnycwork, null as iscomnycres, name as name ${getPopupValue('subregion')}
<<<<<<< HEAD
      FROM region_subregion_v20190708
=======
      FROM region_subregion
>>>>>>> develop
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  if (geographyLevel === 'subregion') return SQLArray.reverse().join(' UNION ALL ');

  if (getPopupValue('county')) {
    SQLArray.push(`
      SELECT 'county' as geomtype, null as islitown, null as houptest, iscommap, iscomnycwork, iscomnycres, name as name ${getPopupValue('county')}
<<<<<<< HEAD
      FROM region_county_v20190708
=======
      FROM region_county
>>>>>>> develop
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  if (geographyLevel === 'county') return SQLArray.reverse().join(' UNION ALL ');

  if (getPopupValue('municipality')) {
    SQLArray.push(`
      SELECT 'municipality' as geomtype, islitown, houptest, null as iscommap, null as iscomnycwork, null as iscomnycres, namelsad as name ${getPopupValue('municipality')}
<<<<<<< HEAD
      FROM region_municipality_v20190708
=======
      FROM region_municipality
>>>>>>> develop
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  return SQLArray.reverse().join(' UNION ALL ');
}
