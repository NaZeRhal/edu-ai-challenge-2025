import { SHIP_LENGTH } from '../utils/constants.js';

export class Ship {
  constructor() {
    this.locations = [];
    this.hits = new Array(SHIP_LENGTH).fill('');
  }

  addLocation(location) {
    this.locations.push(location);
  }

  isHit(location) {
    const index = this.locations.indexOf(location);
    if (index >= 0) {
      this.hits[index] = 'hit';
      return true;
    }
    return false;
  }

  isSunk() {
    return this.hits.every(hit => hit === 'hit');
  }
} 