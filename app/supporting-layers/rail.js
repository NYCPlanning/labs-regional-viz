export default {
  source: {
    id: 'rail',
    type: 'cartovector',
    'source-layers': [
      {
        id: 'rail-lines-regional',
        sql: 'SELECT the_geom_webmercator FROM region_rail_lines_v20190716 WHERE rail_oper IS NOT NULL',
      },

      {
        id: 'rail-lines-subway',
        sql: 'SELECT the_geom_webmercator FROM region_rail_lines_v20190716 WHERE rail_oper IS NULL',
      },

      {
        id: 'rail-stops',
        sql: 'SELECT the_geom_webmercator FROM region_rail_stops_v20190716',
      },
    ],
  },

  regionalLines: {
    id: 'rail-lines-regional',
    type: 'line',
    source: 'rail',
    'source-layer': 'rail-lines-regional',
    paint: {
      'line-color': 'rgba(70, 31, 31, 1)',
      'line-width': {
        stops: [
          [
            8,
            1,
          ],
          [
            12,
            4,
          ],
        ],
      },
    },
  },

  subwayLines: {
    id: 'rail-lines-subway',
    type: 'line',
    source: 'rail',
    'source-layer': 'rail-lines-subway',
    paint: {
      'line-color': 'rgba(17, 39, 58, 1)',
      'line-width': {
        stops: [
          [
            8,
            1,
          ],
          [
            12,
            4,
          ],
        ],
      },
    },
  },

  stops: {
    id: 'rail-stops',
    type: 'circle',
    source: 'rail',
    'source-layer': 'rail-stops',
    paint: {
      'circle-stroke-color': 'rgba(0, 0, 0, 1)',
      'circle-stroke-width': {
        stops: [
          [
            8,
            1,
          ],
          [
            12,
            2,
          ],
        ],
      },
      'circle-color': 'rgba(255, 255, 255, 1)',
      'circle-radius': {
        stops: [
          [
            8,
            1,
          ],
          [
            12,
            4,
          ],
        ],
      },
      'circle-opacity': {
        stops: [
          [
            8,
            0,
          ],
          [
            9,
            1,
          ],
        ],
      },
      'circle-stroke-opacity': {
        stops: [
          [
            8,
            0,
          ],
          [
            9,
            1,
          ],
        ],
      },
    },
  },
};
