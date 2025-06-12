import { HumanPlayer } from '../HumanPlayer.js';
import { CPUPlayer } from '../CPUPlayer.js';
import { Ship } from '../../game/Ship.js';
import { BOARD_SYMBOLS, CPU_MODES, NUM_SHIPS, BOARD_SIZE, SHIP_LENGTH } from '../../utils/constants.js';
import readline from 'readline';

describe('Player ship placement adjacency rules', () => {
  let human;
  let cpu;
  let rl;

  beforeEach(() => {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    human = new HumanPlayer(rl);
    cpu = new CPUPlayer();
  });

  afterEach(() => {
    rl.close();
  });

  test('HumanPlayer: does not allow adjacent ships (including diagonals)', () => {
    const ship1 = new Ship();
    const ship2 = new Ship();
    // Place first ship horizontally at (0,0)-(0,2)
    expect(human.tryPlaceShip(ship1, 0, 0, 'horizontal')).toBe(true);
    // Try to place adjacent ships
    expect(human.tryPlaceShip(ship2, 0, 1, 'horizontal')).toBe(false); // Directly adjacent
    expect(human.tryPlaceShip(ship2, 1, 1, 'horizontal')).toBe(false); // Diagonally adjacent
    expect(human.tryPlaceShip(ship2, 0, 2, 'vertical')).toBe(false); // Directly adjacent
    expect(human.tryPlaceShip(ship2, 1, 0, 'horizontal')).toBe(false); // Directly below
    expect(human.tryPlaceShip(ship2, 1, 2, 'horizontal')).toBe(false); // Directly below
    // Place a ship far from the first
    expect(human.tryPlaceShip(ship2, 2, 4, 'horizontal')).toBe(true);
  });

  test('CPUPlayer: does not allow adjacent ships (including diagonals)', () => {
    const ship1 = new Ship();
    const ship2 = new Ship();
    // Place first ship horizontally at (0,0)-(0,2)
    expect(cpu.tryPlaceShip(ship1, 0, 0, 'horizontal')).toBe(true);
    // Try to place adjacent ships
    expect(cpu.tryPlaceShip(ship2, 0, 1, 'horizontal')).toBe(false); // Directly adjacent
    expect(cpu.tryPlaceShip(ship2, 1, 1, 'horizontal')).toBe(false); // Diagonally adjacent
    expect(cpu.tryPlaceShip(ship2, 0, 2, 'vertical')).toBe(false); // Directly adjacent
    expect(cpu.tryPlaceShip(ship2, 1, 0, 'horizontal')).toBe(false); // Directly below
    expect(cpu.tryPlaceShip(ship2, 1, 2, 'horizontal')).toBe(false); // Directly below
    // Place a ship far from the first
    expect(cpu.tryPlaceShip(ship2, 2, 4, 'horizontal')).toBe(true);
  });
});

describe('Player game state management', () => {
  let human;
  let cpu;
  let rl;

  beforeEach(() => {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    human = new HumanPlayer(rl);
    cpu = new CPUPlayer();
  });

  afterEach(() => {
    rl.close();
  });

  test('Player: initializes with correct number of ships', () => {
    expect(human.remainingShips).toBe(NUM_SHIPS);
    expect(cpu.remainingShips).toBe(NUM_SHIPS);
  });

  test('Player: tracks guesses correctly', () => {
    const result = human.receiveGuess(0, 0);
    expect(result.alreadyGuessed).toBe(false);
    expect(result.hit).toBe(false);
    expect(result.sunk).toBe(false);
    
    // Try same guess again
    const result2 = human.receiveGuess(0, 0);
    expect(result2.alreadyGuessed).toBe(true);
  });

  test('Player: detects hits and sunk ships', () => {
    const ship = new Ship();
    human.tryPlaceShip(ship, 0, 0, 'horizontal');
    human.ships.push(ship);
    
    // Hit all parts of the ship
    const result1 = human.receiveGuess(0, 0);
    expect(result1.hit).toBe(true);
    expect(result1.sunk).toBe(false);
    
    const result2 = human.receiveGuess(0, 1);
    expect(result2.hit).toBe(true);
    expect(result2.sunk).toBe(false);
    
    const result3 = human.receiveGuess(0, 2);
    expect(result3.hit).toBe(true);
    expect(result3.sunk).toBe(true);
    
    expect(human.remainingShips).toBe(NUM_SHIPS - 1);
  });
});

describe('CPU Player strategy', () => {
  let cpu;

  beforeEach(() => {
    cpu = new CPUPlayer();
  });

  test('CPU: starts in hunt mode', () => {
    expect(cpu.mode).toBe(CPU_MODES.HUNT);
  });

  test('CPU: switches to target mode after hit', () => {
    cpu.updateStrategy(0, 0, true, false);
    expect(cpu.mode).toBe(CPU_MODES.TARGET);
  });

  test('CPU: adds adjacent targets after hit', () => {
    cpu.updateStrategy(0, 0, true, false);
    expect(cpu.targetQueue.length).toBeGreaterThan(0);
  });

  test('CPU: returns to hunt mode after sunk ship', () => {
    cpu.updateStrategy(0, 0, true, true);
    expect(cpu.mode).toBe(CPU_MODES.HUNT);
    expect(cpu.targetQueue.length).toBe(0);
  });

  test('CPU: makes valid guesses', () => {
    for (let i = 0; i < 100; i++) {
      const guess = cpu.makeGuess();
      expect(guess.row).toBeGreaterThanOrEqual(0);
      expect(guess.row).toBeLessThan(10);
      expect(guess.col).toBeGreaterThanOrEqual(0);
      expect(guess.col).toBeLessThan(10);
    }
  });

  test('CPU: adds adjacent targets correctly', () => {
    cpu.addAdjacentTargets(5, 5);
    const expectedTargets = ['45', '65', '54', '56'];
    expect(cpu.targetQueue).toEqual(expect.arrayContaining(expectedTargets));
  });

  test('CPU: places ships randomly', () => {
    // Ensure placeShips is called and sets the correct number of ships
    cpu.placeShips();
    expect(cpu.ships.length).toBe(NUM_SHIPS);

    // Verify ships are actually placed on the board
    let placedCells = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (cpu.board.getCell(r, c) === BOARD_SYMBOLS.SHIP) {
          placedCells++;
        }
      }
    }
    expect(placedCells).toBe(NUM_SHIPS * SHIP_LENGTH);
  });

  test('CPU: does not shoot at already fired locations', () => {
    // Simulate CPU making a guess
    let guess1 = cpu.makeGuess();
    // Ensure it was added to firedShots
    expect(cpu.firedShots.has(`${guess1.row}${guess1.col}`)).toBe(true);

    // Force the CPU to attempt to guess the same spot again in hunt mode
    // This is a bit tricky to mock randomness, so we'll rely on the internal do-while loop for now
    // and ensure that makeGuess always returns a unique guess

    // Test target mode with an already fired adjacent spot
    cpu.updateStrategy(0, 0, true, false); // Hit at 0,0 - adds 01, 10, -10, 0-1
    // Manually add 01 to firedShots to simulate it being previously shot
    cpu.firedShots.add('01');

    // Make CPU guess - it should skip 01 and go for another target
    let nextGuess = cpu.makeGuess();
    // The next guess should not be 01, and should be one of the other adjacent targets if not fired
    expect(`${nextGuess.row}${nextGuess.col}`).not.toBe('01');
    expect(cpu.firedShots.has(`${nextGuess.row}${nextGuess.col}`)).toBe(true);
  });

  test('CPU: correctly determines horizontal ship direction and targets', () => {
    cpu.updateStrategy(5, 5, true, false); // First hit
    cpu.updateStrategy(5, 6, true, false); // Second hit, horizontal
    expect(cpu.mode).toBe(CPU_MODES.TARGET);
    // Should clear old adjacent targets and add new directional ones
    expect(cpu.targetQueue).toEqual(expect.arrayContaining(['54', '57']));
    expect(cpu.targetQueue.length).toBe(2);
  });

  test('CPU: correctly determines vertical ship direction and targets', () => {
    cpu.updateStrategy(5, 5, true, false); // First hit
    cpu.updateStrategy(6, 5, true, false); // Second hit, vertical
    expect(cpu.mode).toBe(CPU_MODES.TARGET);
    // Should clear old adjacent targets and add new directional ones
    expect(cpu.targetQueue).toEqual(expect.arrayContaining(['45', '75']));
    expect(cpu.targetQueue.length).toBe(2);
  });

  test('CPU: clears target queue and returns to hunt mode after sinking ship', () => {
    cpu.updateStrategy(5, 5, true, false); // Hit 1
    cpu.updateStrategy(5, 6, true, false); // Hit 2 (horizontal)
    cpu.updateStrategy(5, 7, true, true);  // Hit 3, sunk ship
    expect(cpu.mode).toBe(CPU_MODES.HUNT);
    expect(cpu.targetQueue.length).toBe(0);
    expect(cpu.lastHits.length).toBe(0);
  });

  test('CPU: returns to hunt mode if target queue is exhausted after a miss', () => {
    cpu.updateStrategy(0, 0, true, false); // Hit
    expect(cpu.mode).toBe(CPU_MODES.TARGET);
    
    // Simulate consuming all targets without sinking
    const initialQueueLength = cpu.targetQueue.length;
    for(let i = 0; i < initialQueueLength; i++) {
      const target = cpu.targetQueue.shift(); // Remove target from queue
      // Simulate a miss for each target
      cpu.updateStrategy(parseInt(target[0]), parseInt(target[1]), false, false);
    }
    expect(cpu.mode).toBe(CPU_MODES.HUNT);
  });

  test('CPU: addAdjacentTargets does not add out-of-bounds or already fired targets', () => {
    cpu.firedShots.add('00');
    cpu.addAdjacentTargets(0, 0); // Try adding targets around (0,0)
    // Should not add -10, 0-1, 00, 10, 01, etc.
    expect(cpu.targetQueue).not.toContain('-10'); // Out of bounds
    expect(cpu.targetQueue).not.toContain('0-1'); // Out of bounds
    expect(cpu.targetQueue).not.toContain('00');  // Already fired
    
    const validTargets = ['10', '01']; // Assuming these are valid and not fired
    expect(cpu.targetQueue).toEqual(expect.arrayContaining(validTargets));
    // The length might be less if some were already fired, or more if other tests added to it
  });

  test('CPU: addTargetsInDirection does not add out-of-bounds or already fired targets', () => {
    cpu.firedShots.add('54'); // Simulate 5,4 already fired
    cpu.firedShots.add('57'); // Simulate 5,7 already fired
    cpu.updateStrategy(5, 5, true, false); // First hit
    cpu.updateStrategy(5, 6, true, false); // Second hit, horizontal
    
    // Even though 54 and 57 would be in direction, they should be skipped if fired
    expect(cpu.targetQueue).not.toContain('54');
    expect(cpu.targetQueue).not.toContain('57');
    expect(cpu.targetQueue.length).toBe(0); // If all directional targets were fired
  });
});

describe('Human Player input validation', () => {
  let human;
  let rl;

  beforeEach(() => {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    human = new HumanPlayer(rl);
  });

  afterEach(() => {
    rl.close();
  });

  test('Human: validates guess format', () => {
    expect(human.isValidGuess('00')).toBe(true);
    expect(human.isValidGuess('99')).toBe(true);
    expect(human.isValidGuess('0')).toBe(false);
    expect(human.isValidGuess('000')).toBe(false);
    expect(human.isValidGuess('ab')).toBe(false);
    expect(human.isValidGuess('10')).toBe(true);
    expect(human.isValidGuess('01')).toBe(true);
  });

  test('Human: places ships randomly', async () => {
    await human.placeShips();
    expect(human.ships.length).toBe(NUM_SHIPS);
  });
}); 