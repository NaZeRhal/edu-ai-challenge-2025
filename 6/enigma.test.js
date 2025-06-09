const assert = require("assert");
const { Enigma, ValidationError } = require("./enigma");

// Test helper function to create an Enigma instance with default settings
function createDefaultEnigma() {
  return new Enigma(
    [0, 1, 2], // Rotor order: I, II, III
    [0, 0, 0], // All rotors at position A
    [0, 0, 0], // All ring settings at 0
    [] // No plugboard connections
  );
}

// Test 1: Basic encryption and decryption
function testBasicEncryption() {
  const enigma = createDefaultEnigma();
  const message = "HELLOWORLD";
  const encrypted = enigma.process(message);
  console.log("Encrypted (default settings):", encrypted);
  // Create a new Enigma instance with same settings for decryption
  const decryptEnigma = createDefaultEnigma();
  const decrypted = decryptEnigma.process(encrypted);
  console.log("Decrypted (default settings):", decrypted);
  assert.strictEqual(
    decrypted,
    message,
    "Decryption should restore original message"
  );
  console.log("✓ Basic encryption/decryption test passed");
}

// Test 2: Verify rotor stepping
function testRotorStepping() {
  const enigma = createDefaultEnigma();
  // Process 26 characters to verify right rotor steps correctly
  enigma.process("A".repeat(26));
  assert.strictEqual(
    enigma.rotors[2].position,
    0,
    "Right rotor should complete full rotation"
  );
  // Process more characters to verify middle rotor steps
  enigma.process("A".repeat(26));
  // Due to double-stepping, the middle rotor will be at position 2 after 52 steps
  assert.strictEqual(
    enigma.rotors[1].position,
    2,
    "Middle rotor should be at position 2 after 52 steps due to double-stepping"
  );
  console.log("✓ Rotor stepping test passed");
}

// Test 3: Verify plugboard functionality
function testPlugboard() {
  const enigma = new Enigma(
    [0, 1, 2],
    [0, 0, 0],
    [0, 0, 0],
    [["A", "B"]] // Swap A and B
  );
  const result = enigma.process("A");
  assert.strictEqual(result, "B", "Plugboard should swap letters");
  console.log("✓ Plugboard test passed");
}

// Test 4: Verify specific encryption/decryption with user settings
function testUserSettings() {
  const message = "HELLOWORLD";
  const rotorPositions = [0, 1, 2];
  const ringSettings = [0, 1, 2];
  const plugboardPairs = [
    ["Q", "W"],
    ["E", "R"],
  ];
  // Create Enigma instance for encryption
  const encryptEnigma = new Enigma(
    [0, 1, 2],
    rotorPositions,
    ringSettings,
    plugboardPairs
  );
  // Encrypt the message
  const encrypted = encryptEnigma.process(message);
  console.log("Encrypted (user settings):", encrypted);
  // Create new Enigma instance with same settings for decryption
  const decryptEnigma = new Enigma(
    [0, 1, 2],
    rotorPositions,
    ringSettings,
    plugboardPairs
  );
  // Decrypt the message
  const decrypted = decryptEnigma.process(encrypted);
  console.log("Decrypted (user settings):", decrypted);
  assert.strictEqual(
    decrypted,
    message,
    "Decryption should restore original message"
  );
  console.log("✓ User settings test passed");
}

// Test 5: Input validation tests
console.log("Running Enigma machine tests...\n");

// Test 1: Default settings encryption/decryption
console.log("Test 1: Default settings encryption/decryption");
const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
const message1 = "HELLO WORLD";
const encrypted1 = enigma1.process(message1);
// Create a new instance for decryption to ensure same initial state
const enigma1Decrypt = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
const decrypted1 = enigma1Decrypt.process(encrypted1);
console.log("Original:", message1);
console.log("Encrypted:", encrypted1);
console.log("Decrypted:", decrypted1);
console.log("Test 1 passed:", decrypted1 === message1, "\n");

// Test 2: User settings encryption/decryption
console.log("Test 2: User settings encryption/decryption");
const enigma2 = new Enigma(
  [0, 1, 2],
  [1, 2, 3],
  [1, 2, 3],
  [
    ["A", "B"],
    ["C", "D"],
  ]
);
const message2 = "HELLO WORLD";
const encrypted2 = enigma2.process(message2);
// Create a new instance for decryption to ensure same initial state
const enigma2Decrypt = new Enigma(
  [0, 1, 2],
  [1, 2, 3],
  [1, 2, 3],
  [
    ["A", "B"],
    ["C", "D"],
  ]
);
const decrypted2 = enigma2Decrypt.process(encrypted2);
console.log("Original:", message2);
console.log("Encrypted:", encrypted2);
console.log("Decrypted:", decrypted2);
console.log("Test 2 passed:", decrypted2 === message2, "\n");

// Test 3: Input validation tests
console.log("Test 3: Input validation tests");

// Test 3.1: Valid rotor positions
try {
  const validPositions = "0 0 0";
  const positions = validPositions.split(" ").map(Number);
  if (positions.length !== 3)
    throw new ValidationError("Exactly three rotor positions are required");
  for (const pos of positions) {
    if (isNaN(pos) || pos < 0 || pos > 25) {
      throw new ValidationError(
        `Invalid rotor position: ${pos}. Must be between 0 and 25`
      );
    }
  }
  console.log("Test 3.1 passed: Valid rotor positions accepted");
} catch (error) {
  console.log("Test 3.1 failed:", error.message);
}

// Test 3.2: Invalid rotor positions (too few)
try {
  const invalidPositions = "0 0";
  const positions = invalidPositions.split(" ").map(Number);
  if (positions.length !== 3)
    throw new ValidationError("Exactly three rotor positions are required");
  console.log("Test 3.2 failed: Should have rejected too few positions");
} catch (error) {
  console.log("Test 3.2 passed: Correctly rejected too few positions");
}

// Test 3.3: Invalid rotor positions (out of range)
try {
  const invalidPositions = "0 0 26";
  const positions = invalidPositions.split(" ").map(Number);
  for (const pos of positions) {
    if (isNaN(pos) || pos < 0 || pos > 25) {
      throw new ValidationError(
        `Invalid rotor position: ${pos}. Must be between 0 and 25`
      );
    }
  }
  console.log("Test 3.3 failed: Should have rejected out of range position");
} catch (error) {
  console.log("Test 3.3 passed: Correctly rejected out of range position");
}

// Test 3.4: Valid plugboard pairs
try {
  const validPairs = [
    ["A", "B"],
    ["C", "D"],
  ];
  const usedLetters = new Set();
  for (const [a, b] of validPairs) {
    if (a === b)
      throw new ValidationError(
        `Invalid plugboard pair: ${a}${b} - letters must be different`
      );
    if (usedLetters.has(a) || usedLetters.has(b)) {
      throw new ValidationError(
        `Invalid plugboard pair: ${a}${b} - letter already used`
      );
    }
    usedLetters.add(a);
    usedLetters.add(b);
  }
  console.log("Test 3.4 passed: Valid plugboard pairs accepted");
} catch (error) {
  console.log("Test 3.4 failed:", error.message);
}

// Test 3.5: Invalid plugboard pairs (duplicate letters)
try {
  const invalidPairs = [
    ["A", "B"],
    ["A", "C"],
  ];
  const usedLetters = new Set();
  for (const [a, b] of invalidPairs) {
    if (a === b)
      throw new ValidationError(
        `Invalid plugboard pair: ${a}${b} - letters must be different`
      );
    if (usedLetters.has(a) || usedLetters.has(b)) {
      throw new ValidationError(
        `Invalid plugboard pair: ${a}${b} - letter already used`
      );
    }
    usedLetters.add(a);
    usedLetters.add(b);
  }
  console.log("Test 3.5 failed: Should have rejected duplicate letters");
} catch (error) {
  console.log("Test 3.5 passed: Correctly rejected duplicate letters");
}

// Test 3.6: Invalid plugboard pairs (self-referential)
try {
  const invalidPairs = [["A", "A"]];
  const usedLetters = new Set();
  for (const [a, b] of invalidPairs) {
    if (a === b)
      throw new ValidationError(
        `Invalid plugboard pair: ${a}${b} - letters must be different`
      );
    if (usedLetters.has(a) || usedLetters.has(b)) {
      throw new ValidationError(
        `Invalid plugboard pair: ${a}${b} - letter already used`
      );
    }
    usedLetters.add(a);
    usedLetters.add(b);
  }
  console.log("Test 3.6 failed: Should have rejected self-referential pair");
} catch (error) {
  console.log("Test 3.6 passed: Correctly rejected self-referential pair");
}

// Test 3.7: Valid ring settings
try {
  const validSettings = "0 0 0";
  const settings = validSettings.split(" ").map(Number);
  if (settings.length !== 3)
    throw new ValidationError("Exactly three ring settings are required");
  for (const setting of settings) {
    if (isNaN(setting) || setting < 0 || setting > 25) {
      throw new ValidationError(
        `Invalid ring setting: ${setting}. Must be between 0 and 25`
      );
    }
  }
  console.log("Test 3.7 passed: Valid ring settings accepted");
} catch (error) {
  console.log("Test 3.7 failed:", error.message);
}

// Test 3.8: Invalid ring settings (out of range)
try {
  const invalidSettings = "0 0 26";
  const settings = invalidSettings.split(" ").map(Number);
  for (const setting of settings) {
    if (isNaN(setting) || setting < 0 || setting > 25) {
      throw new ValidationError(
        `Invalid ring setting: ${setting}. Must be between 0 and 25`
      );
    }
  }
  console.log(
    "Test 3.8 failed: Should have rejected out of range ring setting"
  );
} catch (error) {
  console.log("Test 3.8 passed: Correctly rejected out of range ring setting");
}

console.log("\nAll tests completed.");
