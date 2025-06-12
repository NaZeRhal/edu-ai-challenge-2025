import { Player } from './Player.js';
import { BOARD_SIZE, NUM_SHIPS, SHIP_LENGTH, CPU_MODES } from '../utils/constants.js';
import { Ship } from '../game/Ship.js';

export class CPUPlayer extends Player {
  constructor() {
    super();
    this.mode = CPU_MODES.HUNT;
    this.targetQueue = [];
    this.lastHits = []; // Track consecutive hits to determine ship direction
    this.firedShots = new Set(); // Track all shots made by the CPU
  }

  placeShips() {
    console.log('\nCPU is placing ships...');
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
    console.log('CPU ships placed!');
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

    if (!this.areAdjacentCellsFree(positions)) {
      return false;
    }

    for (const { row, col } of positions) {
      this.board.placeShip(row, col);
      ship.addLocation(`${row}${col}`);
    }

    return true;
  }

  makeGuess() {
    let row, col;
    let guess;

    do {
      if (this.mode === CPU_MODES.TARGET && this.targetQueue.length > 0) {
        guess = this.targetQueue.shift();
        row = parseInt(guess[0]);
        col = parseInt(guess[1]);
        console.log(`CPU TARGET MODE: Attempting to shoot at ${guess} (${this.targetQueue.length} targets remaining)`);
      } else {
        this.mode = CPU_MODES.HUNT;
        row = Math.floor(Math.random() * BOARD_SIZE);
        col = Math.floor(Math.random() * BOARD_SIZE);
        guess = `${row}${col}`;
        console.log(`CPU HUNT MODE: Attempting to shoot at ${guess}`);
      }
    } while (this.firedShots.has(guess)); // Check if CPU has already fired at this spot

    this.firedShots.add(guess); // Add the successful guess to fired shots
    return { row, col };
  }

  updateStrategy(row, col, hit, sunk) {
    console.log(`\nCPU Strategy Update:`);
    console.log(`- Current mode: ${this.mode}`);
    console.log(`- Last shot: ${row},${col}`);
    console.log(`- Hit: ${hit}, Sunk: ${sunk}`);
    console.log(`- Last hits (on opponent's board): ${JSON.stringify(this.lastHits)}`);
    console.log(`- Target queue: ${JSON.stringify(this.targetQueue)}`);
    console.log(`- Fired Shots: ${JSON.stringify(Array.from(this.firedShots))}`);

    if (hit) {
      this.mode = CPU_MODES.TARGET;
      this.lastHits.push({ row, col });
      console.log(`- Added to last hits: ${row},${col}`);
      
      if (this.lastHits.length >= 2) {
        const direction = this.determineShipDirection();
        console.log(`- Detected ship direction: ${direction}`);
        if (direction) {
          this.targetQueue = [];
          this.addTargetsInDirection(direction);
          console.log(`- Updated target queue for ${direction} direction: ${JSON.stringify(this.targetQueue)}`);
        }
      }
      
      if (!sunk) {
        if (this.lastHits.length < 2) {
          this.addAdjacentTargets(row, col);
          console.log(`- Added adjacent targets: ${JSON.stringify(this.targetQueue)}`);
        }
      } else {
        console.log('- Ship sunk! Resetting to hunt mode');
        this.targetQueue = [];
        this.lastHits = [];
        this.mode = CPU_MODES.HUNT;
      }
    } else if (this.mode === CPU_MODES.TARGET && this.targetQueue.length === 0) {
      console.log('- No more targets, switching to hunt mode');
      this.lastHits = [];
      this.mode = CPU_MODES.HUNT;
    }
  }

  determineShipDirection() {
    if (this.lastHits.length < 2) return null;
    
    const lastHit = this.lastHits[this.lastHits.length - 1];
    const prevHit = this.lastHits[this.lastHits.length - 2];
    
    if (lastHit.row === prevHit.row) {
      return 'horizontal';
    } else if (lastHit.col === prevHit.col) {
      return 'vertical';
    }
    return null;
  }

  addTargetsInDirection(direction) {
    const lastHit = this.lastHits[this.lastHits.length - 1];
    const prevHit = this.lastHits[this.lastHits.length - 2];
    
    if (direction === 'horizontal') {
      const leftCol = Math.min(lastHit.col, prevHit.col) - 1;
      const rightCol = Math.max(lastHit.col, prevHit.col) + 1;
      
      if (leftCol >= 0 && !this.firedShots.has(`${lastHit.row}${leftCol}`)) {
        this.targetQueue.push(`${lastHit.row}${leftCol}`);
        console.log(`- Added horizontal target (left): ${lastHit.row}${leftCol}`);
      }
      if (rightCol < BOARD_SIZE && !this.firedShots.has(`${lastHit.row}${rightCol}`)) {
        this.targetQueue.push(`${lastHit.row}${rightCol}`);
        console.log(`- Added horizontal target (right): ${lastHit.row}${rightCol}`);
      }
    } else if (direction === 'vertical') {
      const topRow = Math.min(lastHit.row, prevHit.row) - 1;
      const bottomRow = Math.max(lastHit.row, prevHit.row) + 1;
      
      if (topRow >= 0 && !this.firedShots.has(`${topRow}${lastHit.col}`)) {
        this.targetQueue.push(`${topRow}${lastHit.col}`);
        console.log(`- Added vertical target (top): ${topRow}${lastHit.col}`);
      }
      if (bottomRow < BOARD_SIZE && !this.firedShots.has(`${bottomRow}${lastHit.col}`)) {
        this.targetQueue.push(`${bottomRow}${lastHit.col}`);
        console.log(`- Added vertical target (bottom): ${bottomRow}${lastHit.col}`);
      }
    }
  }

  addAdjacentTargets(row, col) {
    const adjacent = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 },
    ];

    for (const { r, c } of adjacent) {
      if (
        r >= 0 &&
        r < BOARD_SIZE &&
        c >= 0 &&
        c < BOARD_SIZE &&
        !this.firedShots.has(`${r}${c}`)
      ) {
        this.targetQueue.push(`${r}${c}`);
        console.log(`- Added adjacent target: ${r}${c}`);
      }
    }
  }
} 