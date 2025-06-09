/**
 * Enigma Machine Implementation
 * A JavaScript implementation of the historical Enigma machine cipher device.
 *
 * @module enigma
 */

const readline = require("readline");

// Constants
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ROTORS = [
  { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" }, // Rotor I
  { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" }, // Rotor II
  { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" }, // Rotor III
];
const REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT";

// Custom error classes
class EnigmaError extends Error {
  constructor(message) {
    super(message);
    this.name = "EnigmaError";
  }
}

class ValidationError extends EnigmaError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Helper function to handle modulo operations with negative numbers
 * @param {number} n - The number to perform modulo on
 * @param {number} m - The modulo value
 * @returns {number} The result of the modulo operation
 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Validates and processes plugboard pairs
 * @param {string} plugStr - String containing plugboard pairs
 * @returns {Array<Array<string>>} Array of validated plugboard pairs
 * @throws {ValidationError} If plugboard pairs are invalid
 */
function validatePlugboardPairs(plugStr) {
  if (!plugStr.trim()) return [];

  // Check for proper format (pairs of letters separated by spaces)
  if (!/^([A-Z]{2}\s*)+$/.test(plugStr.trim().toUpperCase())) {
    throw new ValidationError(
      "Please enter pairs of letters separated by spaces (e.g. AB CD)"
    );
  }

  const pairs =
    plugStr
      .toUpperCase()
      .match(/([A-Z]{2})/g)
      ?.map((pair) => [pair[0], pair[1]]) || [];

  // Validate pairs
  const usedLetters = new Set();
  for (const [a, b] of pairs) {
    if (a === b) {
      throw new ValidationError(
        `Invalid plugboard pair: ${a}${b} - cannot connect a letter to itself`
      );
    }
    if (usedLetters.has(a) || usedLetters.has(b)) {
      const letter = usedLetters.has(a) ? a : b;
      throw new ValidationError(
        `Invalid plugboard pair: letter ${letter} is already used in another pair`
      );
    }
    usedLetters.add(a);
    usedLetters.add(b);
  }

  return pairs;
}

/**
 * Validates and processes rotor positions
 * @param {string} posStr - String containing rotor positions
 * @returns {Array<number>} Array of validated rotor positions
 * @throws {ValidationError} If rotor positions are invalid
 */
function validateRotorPositions(posStr) {
  // First check if input is empty
  if (!posStr.trim()) {
    throw new ValidationError(
      "Please enter three rotor positions (e.g. 0 0 0)"
    );
  }

  // Check for proper format (three space-separated numbers)
  if (!/^\d+\s+\d+\s+\d+$/.test(posStr.trim())) {
    throw new ValidationError(
      "Please enter exactly three numbers separated by spaces (e.g. 0 0 0)"
    );
  }

  const positions = posStr.split(" ").map(Number);

  // Check if values are in range
  const outOfRange = positions
    .map((pos, i) =>
      pos < 0 || pos > 25 ? `position ${i + 1} (${pos})` : null
    )
    .filter(Boolean);
  if (outOfRange.length > 0) {
    throw new ValidationError(
      `Invalid rotor positions: ${outOfRange.join(
        ", "
      )} must be between 0 and 25`
    );
  }

  return positions;
}

/**
 * Validates and processes ring settings
 * @param {string} ringStr - String containing ring settings
 * @returns {Array<number>} Array of validated ring settings
 * @throws {ValidationError} If ring settings are invalid
 */
function validateRingSettings(ringStr) {
  // First check if input is empty
  if (!ringStr.trim()) {
    throw new ValidationError("Please enter three ring settings (e.g. 0 0 0)");
  }

  // Check for proper format (three space-separated numbers)
  if (!/^\d+\s+\d+\s+\d+$/.test(ringStr.trim())) {
    throw new ValidationError(
      "Please enter exactly three numbers separated by spaces (e.g. 0 0 0)"
    );
  }

  const settings = ringStr.split(" ").map(Number);

  // Check if values are in range
  const outOfRange = settings
    .map((setting, i) =>
      setting < 0 || setting > 25 ? `setting ${i + 1} (${setting})` : null
    )
    .filter(Boolean);
  if (outOfRange.length > 0) {
    throw new ValidationError(
      `Invalid ring settings: ${outOfRange.join(", ")} must be between 0 and 25`
    );
  }

  return settings;
}

/**
 * Applies plugboard swaps to a character
 * @param {string} c - Character to swap
 * @param {Array<Array<string>>} pairs - Array of plugboard pairs
 * @returns {string} Swapped character
 */
function plugboardSwap(c, pairs) {
  for (const [a, b] of pairs) {
    if (c === a) return b;
    if (c === b) return a;
  }
  return c;
}

/**
 * Represents a single rotor in the Enigma machine
 */
class Rotor {
  /**
   * Creates a new Rotor instance
   * @param {string} wiring - The rotor's wiring configuration
   * @param {string} notch - The notch position
   * @param {number} ringSetting - The ring setting (0-25)
   * @param {number} position - The initial position (0-25)
   */
  constructor(wiring, notch, ringSetting = 0, position = 0) {
    this.wiring = wiring;
    this.notch = notch;
    this.ringSetting = ringSetting;
    this.position = position;
  }

  /**
   * Steps the rotor one position
   */
  step() {
    this.position = mod(this.position + 1, 26);
  }

  /**
   * Checks if the rotor is at its notch position
   * @returns {boolean} True if at notch position
   */
  atNotch() {
    return alphabet[this.position] === this.notch;
  }

  /**
   * Processes a character through the rotor in the forward direction
   * @param {string} c - Character to process
   * @returns {string} Processed character
   */
  forward(c) {
    const input = mod(
      alphabet.indexOf(c) + this.position - this.ringSetting,
      26
    );
    const wired = this.wiring[input];
    const output = mod(
      alphabet.indexOf(wired) - this.position + this.ringSetting,
      26
    );
    return alphabet[output];
  }

  /**
   * Processes a character through the rotor in the backward direction
   * @param {string} c - Character to process
   * @returns {string} Processed character
   */
  backward(c) {
    const input = mod(
      alphabet.indexOf(c) + this.position - this.ringSetting,
      26
    );
    const wired = this.wiring.indexOf(alphabet[input]);
    const output = mod(wired - this.position + this.ringSetting, 26);
    return alphabet[output];
  }
}

/**
 * Represents the complete Enigma machine
 */
class Enigma {
  /**
   * Creates a new Enigma machine instance
   * @param {Array<number>} rotorIDs - Array of rotor IDs to use
   * @param {Array<number>} rotorPositions - Initial positions of rotors
   * @param {Array<number>} ringSettings - Ring settings for rotors
   * @param {Array<Array<string>>} plugboardPairs - Plugboard letter pairs
   */
  constructor(rotorIDs, rotorPositions, ringSettings, plugboardPairs) {
    this.rotors = rotorIDs.map(
      (id, i) =>
        new Rotor(
          ROTORS[id].wiring,
          ROTORS[id].notch,
          ringSettings[i],
          rotorPositions[i]
        )
    );
    this.plugboardPairs = plugboardPairs;
  }

  /**
   * Steps the rotors according to the Enigma's double-stepping mechanism
   */
  stepRotors() {
    const [left, middle, right] = this.rotors;
    if (middle.atNotch()) left.step();
    if (right.atNotch() || middle.atNotch()) middle.step();
    right.step();
  }

  /**
   * Processes a single character through the Enigma machine
   * @param {string} c - Character to process
   * @returns {string} Processed character
   */
  encryptChar(c) {
    if (!alphabet.includes(c)) return c;
    this.stepRotors();
    c = plugboardSwap(c, this.plugboardPairs);
    for (let i = this.rotors.length - 1; i >= 0; i--) {
      c = this.rotors[i].forward(c);
    }
    c = REFLECTOR[alphabet.indexOf(c)];
    for (let i = 0; i < this.rotors.length; i++) {
      c = this.rotors[i].backward(c);
    }
    c = plugboardSwap(c, this.plugboardPairs);
    return c;
  }

  /**
   * Processes a text message through the Enigma machine
   * @param {string} text - Text to process
   * @returns {string} Processed text
   */
  process(text) {
    return text
      .toUpperCase()
      .split("")
      .map((c) => this.encryptChar(c))
      .join("");
  }
}

/**
 * Prompts the user for Enigma machine configuration and processes a message
 */
function promptEnigma() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let message, rotorPositions, ringSettings, plugPairs;

  rl.question("Enter message: ", (msg) => {
    message = msg;
    rl.question("Rotor positions (e.g. 0 0 0): ", (posStr) => {
      try {
        rotorPositions = validateRotorPositions(posStr);
        rl.question("Ring settings (e.g. 0 0 0): ", (ringStr) => {
          try {
            ringSettings = validateRingSettings(ringStr);
            rl.question("Plugboard pairs (e.g. AB CD): ", (plugStr) => {
              try {
                plugPairs = validatePlugboardPairs(plugStr);
                // Create Enigma instance only after all validations pass
                const enigma = new Enigma(
                  [0, 1, 2],
                  rotorPositions,
                  ringSettings,
                  plugPairs
                );
                const result = enigma.process(message);
                console.log("Output:", result);
              } catch (error) {
                console.error("Error:", error.message);
              } finally {
                rl.close();
              }
            });
          } catch (error) {
            console.error("Error:", error.message);
            rl.close();
          }
        });
      } catch (error) {
        console.error("Error:", error.message);
        rl.close();
      }
    });
  });
}

if (require.main === module) {
  promptEnigma();
}

module.exports = { Enigma, EnigmaError, ValidationError };
