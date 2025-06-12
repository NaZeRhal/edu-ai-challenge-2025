import readline from 'readline';
import { Game } from './game/Game.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\nLet's play Sea Battle!");
const game = new Game(rl);
game.play().catch(error => {
  console.error('An error occurred:', error);
  rl.close();
}); 