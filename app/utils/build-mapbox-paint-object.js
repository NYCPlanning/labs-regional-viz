export default function buildPaint({ colors, breaks, opacity }) {
  const paint = {
    'fill-color': [
      'step',
      ['get', 'value'],
    ],
    'fill-opacity': opacity,
  };
  const colorArray = paint['fill-color'];

  // there will always be 1 more color than breaks
  colorArray.push(colors[0]);

  breaks.forEach((color, i) => {
    colorArray.push(breaks[i]);
    colorArray.push(colors[i + 1]);
  });

  return paint;
}
