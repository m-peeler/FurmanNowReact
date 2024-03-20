import BELLTOWER from '../assets/images/icons/belltowerx1.png';

export default class Page {
  constructor(id, name, { icon = BELLTOWER, category = 'None', showName = true }) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.category = category;
    this.showName = showName;
  }
}
