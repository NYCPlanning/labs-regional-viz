export default function getPopupSQL(lngLat = { lng: 0, lat: 0 }, mapConfig = { popupValues: [] }, geographyLevel = 'municipality') {
  const { lng, lat } = lngLat;

  const { popupValues } = mapConfig;

  function getPopupValue(geomType) {
    const match = popupValues.find(d => d.id === geomType);
    return match ? match.value : null;
  }

  const SQLArray = [];

  SQLArray.push(`
    SELECT 'region' as geomtype, 'NYC region' as name, 100000 as value
  `);

  if (getPopupValue('subregion')) {
    SQLArray.push(`
      SELECT 'county' as geomtype, name as name, ${getPopupValue('subregion')} as value
      FROM region_subregion_v0
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  if (geographyLevel === 'subregion') return SQLArray.join(' UNION ALL ');

  if (getPopupValue('county')) {
    SQLArray.push(`
      SELECT 'county' as geomtype, name as name, ${getPopupValue('county')} as value
      FROM region_county_v0
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  if (geographyLevel === 'county') return SQLArray.join(' UNION ALL ');

  if (getPopupValue('municipality')) {
    SQLArray.push(`
      SELECT 'municipality' as geomtype, namelsad as name, ${getPopupValue('municipality')} as value
      FROM region_municipality_v0
      WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    `);
  }

  return SQLArray.join(' UNION ALL ');
}
