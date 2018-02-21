import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';

export default Component.extend({
  classNameBindings: ['noNarrative:no-narrative'],
  classNames: 'map-container cell large-auto',
  zoom: 8.5,
  center: [-73.869324, 40.815888],

  actions: {
    handleMapLoad(map) {
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.addControl(new mapboxgl.ScaleControl({ unit: 'imperial' }), 'bottom-left');
    }
  }
});
