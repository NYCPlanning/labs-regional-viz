export default function getPopupData(lngLat = { lng: 0, lat: 0 }, mapConfig = { popupValues: [] }) {
  const { lng, lat } = lngLat;

  const { popupValues } = mapConfig;

  function getPopupValue(geomType) {
    const foundPopupValue = popupValues.find(d => d.id === geomType) || {};
    return foundPopupValue.value;
  }

  return `
    SELECT 'municipality' as geomtype, namelsad as name, ${getPopupValue('municipality')} as value
    FROM region_municipality_v0
    WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))

    UNION ALL

    SELECT 'county' as geomtype, name as name, ${getPopupValue('county')} as value
    FROM region_county_v0
    WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))

    UNION ALL

    SELECT 'subregion' as geomtype, name as name, ${getPopupValue('subregion')} as value
    FROM region_subregion_v0
    WHERE ST_Intersects(the_geom, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))

    UNION All

    SELECT 'region' as geomtype, 'NYC region' as name, 100000 as value
  `;
}
