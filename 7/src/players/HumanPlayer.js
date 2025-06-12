import { Player } from './Player.js';
import { BOARD_SIZE, NUM_SHIPS, SHIP_LENGTH } from '../utils/constants.js';
import { Ship } from '../game/Ship.js';

export class HumanPlayer extends Player {
  constructor(readlineInterface) {
    super();
    this.rl = readlineInterface;
  }

  async placeShips() {
    console.log('\nPlacing your ships...');
    for (let i = 0; i < NUM_SHIPS; i++) {
      const ship = new Ship();
      let placed = false;

      while (!placed) {
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const startRow = Math.floor(Math.random() * BOARD_SIZE);
        const startCol = Math.floor(Math.random() * (BOARD_SIZE - SHIP_LENGTH + 1));

        placed = this.tryPlaceShip(ship, startRow, startCol, orientation);
      }

      this.ships.push(ship);
    }
    console.log('All ships placed!');
  }

  tryPlaceShip(ship, startRow, startCol, orientation) {
    const positions = [];
    for (let i = 0; i < SHIP_LENGTH; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;

      if (!this.board.isValidPosition(row, col)) {
        return false;
      }

      positions.push({ row, col });
    }

    // Check adjacency
    if (!this.areAdjacentCellsFree(positions)) {
      return false;
    }

    for (const { row, col } of positions) {
      this.board.placeShip(row, col);
      ship.addLocation(`${row}${col}`);
    }

    return true;
  }

  async makeGuess() {
    return new Promise((resolve) => {
      this.rl.question('Enter your guess (e.g., 00): ', (answer) => {
        if (this.isValidGuess(answer)) {
          const row = parseInt(answer[0]);
          const col = parseInt(answer[1]);
          resolve({ row, col });
        } else {
          console.log('Invalid guess! Please enter two digits (e.g., 00, 34, 98).');
          resolve(this.makeGuess());
        }
      });
    });
  }

  isValidGuess(guess) {
    if (!guess || guess.length !== 2) {
      return false;
    }

    const row = parseInt(guess[0]);
    const col = parseInt(guess[1]);

    return (
      !isNaN(row) &&
      !isNaN(col) &&
      row >= 0 &&
      row < BOARD_SIZE &&
      col >= 0 &&
      col < BOARD_SIZE
    );
  }
} 