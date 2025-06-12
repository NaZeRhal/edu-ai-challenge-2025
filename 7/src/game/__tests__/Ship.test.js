import { Ship } from '../Ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship();
  });

  test('should initialize with empty locations and hits', () => {
    expect(ship.locations).toEqual([]);
    expect(ship.hits).toEqual(['', '', '']);
  });

  test('should add location correctly', () => {
    ship.addLocation('00');
    expect(ship.locations).toContain('00');
  });

  test('should mark hit correctly', () => {
    ship.addLocation('00');
    expect(ship.isHit('00')).toBe(true);
    expect(ship.hits[0]).toBe('hit');
  });

  test('should not mark hit for invalid location', () => {
    ship.addLocation('00');
    expect(ship.isHit('11')).toBe(false);
  });

  test('should detect sunk ship', () => {
    ship.addLocation('00');
    ship.addLocation('01');
    ship.addLocation('02');

    ship.isHit('00');
    ship.isHit('01');
    ship.isHit('02');

    expect(ship.isSunk()).toBe(true);
  });

  test('should not detect sunk ship if not all parts are hit', () => {
    ship.addLocation('00');
    ship.addLocation('01');
    ship.addLocation('02');

    ship.isHit('00');
    ship.isHit('01');

    expect(ship.isSunk()).toBe(false);
  });
}); 