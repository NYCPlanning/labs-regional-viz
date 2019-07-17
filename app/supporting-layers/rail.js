export default {
  source: {
    id: 'rail',
    type: 'cartovector',
    'source-layers': [
      {
        id: 'rail-lines',
        sql: 'SELECT the_geom_webmercator FROM region_rail_lines_v20190716',
      },

      {
        id: 'rail-stops',
        sql: 'SELECT the_geom_webmercator FROM region_rail_stops_v20190716',
      },
    ],
  },

  lines: {
    id: 'rail-lines',
    type: 'line',
    source: 'rail',
    'source-layer': 'rail-lines',
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
