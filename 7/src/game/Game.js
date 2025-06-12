import { HumanPlayer } from '../players/HumanPlayer.js';
import { CPUPlayer } from '../players/CPUPlayer.js';
import { BOARD_SIZE, BOARD_SYMBOLS } from '../utils/constants.js';

export class Game {
  constructor(readlineInterface) {
    this.rl = readlineInterface;
    this.humanPlayer = new HumanPlayer(readlineInterface);
    this.cpuPlayer = new CPUPlayer();
  }

  async initialize() {
    await this.humanPlayer.placeShips();
    this.cpuPlayer.placeShips();
  }

  printBoards() {
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    const header = '  ' + Array(BOARD_SIZE).fill().map((_, i) => i).join(' ') + '     ' +
                  '  ' + Array(BOARD_SIZE).fill().map((_, i) => i).join(' ');

    console.log(header);

    for (let i = 0; i < BOARD_SIZE; i++) {
      let rowStr = i + ' ';
      // Print CPU's board (opponent's view) - hide ships
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = this.cpuPlayer.board.getCell(i, j);
        // Only show hits and misses, hide ships
        const displayCell = cell === BOARD_SYMBOLS.SHIP ? BOARD_SYMBOLS.WATER : cell;
        rowStr += displayCell + ' ';
      }
      rowStr += '    ' + i + ' ';
      // Print player's board (your view) - show everything
      for (let j = 0; j < BOARD_SIZE; j++) {
        rowStr += this.humanPlayer.board.getCell(i, j) + ' ';
      }
      console.log(rowStr);
    }
    console.log('\n');
  }

  async playTurn() {
    // Human's turn
    const { row, col } = await this.humanPlayer.makeGuess();
    const result = this.cpuPlayer.receiveGuess(row, col);

    if (result.alreadyGuessed) {
      console.log('You already guessed that location!');
      return;
    }

    if (result.hit) {
      console.log('PLAYER HIT!');
      if (result.sunk) {
        console.log('You sunk an enemy battleship!');
      }
    } else {
      console.log('PLAYER MISS.');
    }

    // CPU's turn
    const cpuGuess = this.cpuPlayer.makeGuess();
    const cpuResult = this.humanPlayer.receiveGuess(cpuGuess.row, cpuGuess.col);

    if (cpuResult.alreadyGuessed) {
      console.log('CPU already guessed that location!');
      return;
    }

    if (cpuResult.hit) {
      console.log(`CPU HIT at ${cpuGuess.row}${cpuGuess.col}!`);
      if (cpuResult.sunk) {
        console.log('CPU sunk your battleship!');
      }
    } else {
      console.log(`CPU MISS at ${cpuGuess.row}${cpuGuess.col}.`);
    }

    this.cpuPlayer.updateStrategy(cpuGuess.row, cpuGuess.col, cpuResult.hit, cpuResult.sunk);
  }

  async play() {
    await this.initialize();
    
    while (true) {
      this.printBoards();
      
      if (this.cpuPlayer.hasLost()) {
        console.log('\n*** CONGRATULATIONS! You sunk all enemy battleships! ***');
        break;
      }
      
      if (this.humanPlayer.hasLost()) {
        console.log('\n*** GAME OVER! The CPU sunk all your battleships! ***');
        break;
      }
      
      await this.playTurn();
    }
    
    this.printBoards();
    this.rl.close();
  }
} 