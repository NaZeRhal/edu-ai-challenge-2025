import { Board } from '../Board.js';
import { BOARD_SIZE, BOARD_SYMBOLS } from '../../utils/constants.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  test('initializes with water symbols', () => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        expect(board.getCell(i, j)).toBe(BOARD_SYMBOLS.WATER);
      }
    }
  });

  test('places ship correctly', () => {
    expect(board.placeShip(0, 0)).toBe(true);
    expect(board.getCell(0, 0)).toBe(BOARD_SYMBOLS.SHIP);
  });

  test('does not place ship on invalid position', () => {
    expect(board.placeShip(10, 10)).toBe(false);
    expect(board.placeShip(-1, -1)).toBe(false);
  });

  test('marks hit correctly', () => {
    board.placeShip(0, 0);
    expect(board.markHit(0, 0)).toBe(true);
    expect(board.getCell(0, 0)).toBe(BOARD_SYMBOLS.HIT);
  });

  test('marks miss correctly', () => {
    expect(board.markMiss(0, 0)).toBe(true);
    expect(board.getCell(0, 0)).toBe(BOARD_SYMBOLS.MISS);
  });

  test('does not mark hit/miss on invalid position', () => {
    expect(board.markHit(10, 10)).toBe(false);
    expect(board.markMiss(10, 10)).toBe(false);
  });

  test('returns null for invalid position', () => {
    expect(board.getCell(10, 10)).toBe(null);
    expect(board.getCell(-1, -1)).toBe(null);
  });

  test('converts board to string correctly', () => {
    board.placeShip(0, 0);
    board.markHit(1, 1);
    board.markMiss(2, 2);
    const expectedString = board.toString();
    expect(expectedString).toContain(BOARD_SYMBOLS.SHIP);
    expect(expectedString).toContain(BOARD_SYMBOLS.HIT);
    expect(expectedString).toContain(BOARD_SYMBOLS.MISS);
  });

  test('hides ships in opponent view', () => {
    // Place a ship
    board.placeShip(0, 0);
    expect(board.getCell(0, 0)).toBe(BOARD_SYMBOLS.SHIP);

    // Mark a hit
    board.markHit(1, 1);
    expect(board.getCell(1, 1)).toBe(BOARD_SYMBOLS.HIT);

    // Mark a miss
    board.markMiss(2, 2);
    expect(board.getCell(2, 2)).toBe(BOARD_SYMBOLS.MISS);

    // Get opponent view
    const opponentView = board.toString(true);
    expect(opponentView).not.toContain(BOARD_SYMBOLS.SHIP);
    expect(opponentView).toContain(BOARD_SYMBOLS.HIT);
    expect(opponentView).toContain(BOARD_SYMBOLS.MISS);
    expect(opponentView).toContain(BOARD_SYMBOLS.WATER);
  });
}); 