import { BOARD_SIZE, BOARD_SYMBOLS } from '../utils/constants.js';

export class Board {
  constructor() {
    this.grid = Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(BOARD_SYMBOLS.WATER));
  }

  placeShip(row, col) {
    if (!this.isValidPosition(row, col) || this.grid[row][col] !== BOARD_SYMBOLS.WATER) {
      return false;
    }
    this.grid[row][col] = BOARD_SYMBOLS.SHIP;
    return true;
  }

  markHit(row, col) {
    if (!this.isValidPosition(row, col)) {
      return false;
    }
    this.grid[row][col] = BOARD_SYMBOLS.HIT;
    return true;
  }

  markMiss(row, col) {
    if (!this.isValidPosition(row, col)) {
      return false;
    }
    this.grid[row][col] = BOARD_SYMBOLS.MISS;
    return true;
  }

  getCell(row, col) {
    if (!this.isValidPosition(row, col)) {
      return null;
    }
    return this.grid[row][col];
  }

  isValidPosition(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  toString(isOpponentView = false) {
    return this.grid
      .map(row =>
        row
          .map(cell => {
            if (isOpponentView && cell === BOARD_SYMBOLS.SHIP) {
              return BOARD_SYMBOLS.WATER;
            }
            return cell;
          })
          .join(' ')
      )
      .join('\n');
  }
} 