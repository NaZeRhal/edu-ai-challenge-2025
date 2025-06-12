import { Board } from '../game/Board.js';
import { Ship } from '../game/Ship.js';
import { NUM_SHIPS, SHIP_LENGTH, BOARD_SIZE, BOARD_SYMBOLS } from '../utils/constants.js';

export class Player {
  constructor() {
    this.board = new Board();
    this.ships = [];
    this.guesses = new Set();
    this.remainingShips = NUM_SHIPS;
  }

  placeShips() {
    throw new Error('Method placeShips() must be implemented');
  }

  makeGuess() {
    throw new Error('Method makeGuess() must be implemented');
  }

  receiveGuess(row, col) {
    const guess = `${row}${col}`;
    if (this.guesses.has(guess)) {
      return { hit: false, alreadyGuessed: true };
    }

    this.guesses.add(guess);
    let hit = false;
    let sunk = false;

    for (const ship of this.ships) {
      if (ship.isHit(guess)) {
        hit = true;
        this.board.markHit(row, col);
        if (ship.isSunk()) {
          this.remainingShips--;
          sunk = true;
        }
        break;
      }
    }

    if (!hit) {
      this.board.markMiss(row, col);
    }

    return { hit, sunk, alreadyGuessed: false };
  }

  hasLost() {
    return this.remainingShips === 0;
  }

  // Helper: Check if all adjacent cells (including diagonals) are free
  areAdjacentCellsFree(positions) {
    for (const { row, col } of positions) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = row + dr;
          const c = col + dc;
          if (
            r >= 0 && r < BOARD_SIZE &&
            c >= 0 && c < BOARD_SIZE &&
            this.board.getCell(r, c) === BOARD_SYMBOLS.SHIP
          ) {
            // If any adjacent cell is a ship, return false
            // (including the cell itself, but that's fine since we check before placing)
            return false;
          }
        }
      }
    }
    return true;
  }
} 