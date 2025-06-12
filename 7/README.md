# 🎮 Sea Battle Game

A modern implementation of the classic Sea Battle (Battleship) game in JavaScript. This version features a clean, object-oriented architecture, comprehensive testing, and an improved user experience.

## 🚀 Features

- Classic Sea Battle gameplay
- Intelligent CPU opponent with advanced hunt/target strategy (finishes ships in straight lines, avoids re-shooting)
- Clean console-based interface
- Comprehensive test coverage
- Modern JavaScript implementation
- Object-oriented design

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## 🎯 How to Play

1. Start the game:
```bash
npm start
```

2. Game Rules:
   - The game is played on a 10x10 grid
   - Each player has 3 ships of length 3
   - Ships are placed randomly at the start
   - Players take turns guessing coordinates
   - First to sink all opponent's ships wins

3. Making a Move:
   - Enter coordinates as two digits (e.g., "34")
   - First digit is row (0-9)
   - Second digit is column (0-9)
   - Example: "34" targets row 3, column 4

4. Game Symbols:
   - `~` : Water (untouched)
   - `S` : Ship (hidden from opponent)
   - `X` : Hit
   - `O` : Miss

## 🧪 Testing

Run the test suite:
```bash
npm test
```

View test coverage:
```bash
npm run test:coverage
```

### Test Coverage Highlights
- All core game logic is covered by tests
- Adjacency rules for ship placement are enforced and tested
- Player logic, CPU strategy, and input validation are comprehensively tested
- All tests pass (36 total tests)
- Coverage is high: Statements (94.11%), Branches (92.43%), Functions (83.33%), Lines (94.36%)
- CPU targeting logic explicitly avoids already-fired locations.

## 📁 Project Structure

```
src/
├── game/           # Core game logic
│   ├── Board.js    # Game board management
│   ├── Game.js     # Main game flow
│   └── Ship.js     # Ship management
├── players/        # Player implementations
│   ├── Player.js   # Base player class
│   ├── HumanPlayer.js
│   └── CPUPlayer.js
├── utils/          # Utilities
│   └── constants.js
└── index.js        # Entry point
```

## 🎯 Game Strategy

### CPU Opponent
The CPU uses a sophisticated two-mode strategy:
1. **Hunt Mode**: Random targeting to find ships.
2. **Target Mode**: Once a ship is hit, the CPU systematically targets adjacent cells. After two hits on the same ship, it intelligently determines the ship's direction (horizontal or vertical) and prioritizes targeting cells along that straight line until the ship is sunk. It also avoids shooting at locations it has already fired upon.

### Tips for Players
1. Start with a systematic search pattern.
2. Once you hit a ship, target adjacent cells.
3. Keep track of your guesses.
4. Use the board display to plan your strategy.

## 🛠️ Development

### Code Style
- ESLint for code linting
- Prettier for code formatting
- Modern JavaScript (ES6+) features

### Testing
- Jest for testing framework
- High test coverage (over 94% lines coverage)
- Unit tests for all core components

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🎯 Future Improvements

- [ ] Add TypeScript support
- [ ] Implement web interface
- [ ] Add multiplayer support
- [ ] Further enhance CPU strategy (e.g., more complex pattern recognition)
- [ ] Add difficulty levels
- [ ] Implement save/load functionality

## 📊 Project Status

- ✅ Core game functionality
- ✅ Testing infrastructure
- ✅ Code quality tools
- ✅ Documentation
- ✅ Improved CPU strategy
- 🔄 Remaining future enhancements

---

*Happy gaming! 🎮* 