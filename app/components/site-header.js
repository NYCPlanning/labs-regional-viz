import Component from '@ember/component';
import { computed } from '@ember/object'; // eslint-disable-line

export default class SiteHeader extends Component {
  @computed('model.maps')
  get filteredMapLinks() {
    const maps = this.get('model.maps');
    return maps.filter(map => !map.hideFromMenu);
  }

  classNames = ['site-header']

  closed = true

  // @argument
  model = {
    maps: [],
  }
}
