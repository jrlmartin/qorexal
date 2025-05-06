# Human Interaction Simulator

A TypeScript/JavaScript library that helps simulate natural human-like interactions with web interfaces by randomizing mouse movements, typing patterns, and interaction timing.

## Features

- **Natural Typing Patterns**: Simulates human typing with variable speed, occasional typos, and corrections
- **Randomized Mouse Movements**: Uses bezier curves and variable speed to create natural mouse movements
- **Realistic Click Patterns**: Varies click locations and timing to avoid repetitive patterns
- **Thinking Behavior**: Simulates human "thinking time" between actions
- **Form Filling**: Extract text from elements and type it into inputs with human-like behavior
- **Button Interactions**: Find and click buttons with natural movements and timing

## Installation

```bash
npm install human-interaction-simulator
```

## Basic Usage

### Import the Library

```typescript
import HumanInteractionSimulator from 'human-interaction-simulator';
```

### Create a Simulator Instance

```typescript
// Basic initialization with default settings
const simulator = new HumanInteractionSimulator();

// Or with custom configuration
const simulator = new HumanInteractionSimulator({
  typingSpeed: {
    min: 80,  // Minimum ms between keystrokes
    max: 200  // Maximum ms between keystrokes
  },
  typingVariance: {
    errorRate: 0.08  // 8% chance of typo
  },
  mouseMovement: {
    turbulence: 0.6  // More random mouse paths
  }
});
```

### Basic Interactions

```typescript
// Type text with human-like patterns (including random typos and corrections)
await simulator.typeText(document.getElementById('search-input'), 'Your search term here');

// Add realistic delays between interactions
await simulator.randomDelay();

// Move mouse with human-like curves and variable speed
await simulator.moveMouseTo({x: 300, y: 200});

// Simulate thinking/idle time
await simulator.simulateThinking();

// Click on an element
await simulator.click(document.getElementById('submit-button'));
```

## Advanced Usage

### Randomized Interactions with the Same Element

This is particularly useful to avoid detection of automated behavior by adding variety to interactions:

```typescript
// Interact with an element multiple times with different patterns each time
await simulator.randomInteractWithElement('#login-button', 5, {
  includeHovers: true,  // Mix hover behaviors with clicks
  includeClicks: true,  // Include actual clicks
  hoverDuration: [500, 3000],  // Random hover times between 500-3000ms
  thinkingPauses: true  // Add thinking pauses between interactions
});
```

### Extracting Data from Page Elements and Filling Forms

```typescript
// Extract text from a div and type it into an input field
await simulator.extractAndTypeText(
  '#source-div', 
  '#target-input',
  { maxLength: 100 }
);

// Batch extract and type from multiple sources to targets
await simulator.batchExtractAndType([
  { source: '#name-div', target: '#name-input' },
  { source: '#email-div', target: '#email-input' },
  { source: '#address-div', target: '#address-input', options: { maxLength: 150 } }
]);

// Find divs by content pattern and fill corresponding inputs
await simulator.findDivsAndFillInputs([
  {
    divPattern: 'Account ID:',
    inputSelector: '#account-id',
    transform: text => text.replace('Account ID:', '').trim()
  },
  {
    // You can also use regular expressions
    divPattern: /Order #(\d+)/,
    inputSelector: '#order-number',
    transform: text => {
      const match = text.match(/Order #(\d+)/);
      return match ? match[1] : '';
    }
  }
]);
```

### Button Interactions

```typescript
// Click a button with natural movement
await simulator.clickButton('#submit-button', { 
  clickPattern: 'natural',  // 'natural', 'center', or 'random'
  thinkBeforeClick: true    // Add thinking time before clicking
});

// Find and click a button by its text content
await simulator.clickButtonByText('Submit', { 
  thinkBeforeClick: true 
});
```

## Complete Example

Here's a complete example showing how to fill out a form with human-like behavior:

```typescript
async function fillLoginForm() {
  const simulator = new HumanInteractionSimulator();
  
  // Navigate to the login form
  await simulator.moveMouseTo(document.getElementById('login-link'));
  await simulator.click();
  
  // Add thinking time (like a human would)
  await simulator.simulateThinking();
  
  // Type username with natural typing patterns
  await simulator.typeText(
    document.getElementById('username-field'), 
    'john.doe@example.com'
  );
  
  // Small delay between fields
  await simulator.delay(simulator.getRandomBetween(300, 1200));
  
  // Type password
  await simulator.typeText(
    document.getElementById('password-field'), 
    'SecurePassword123'
  );
  
  // Think before clicking login
  await simulator.simulateThinking();
  
  // Click login button with natural movement
  await simulator.clickButtonByText('Log In');
}

// Run the example
fillLoginForm().catch(console.error);
```

## API Reference

### Constructor Options

```typescript
interface SimulatorConfig {
  typingSpeed: {
    min: number;  // Minimum ms between keystrokes
    max: number;  // Maximum ms between keystrokes
  };
  typingVariance: {
    wordPause: number;       // Additional pause at word endings
    sentencePause: number;   // Additional pause at end of sentences
    errorRate: number;       // Chance of making a typo
    correctionDelay: number; // Time before correcting typo
  };
  mouseMovement: {
    useHumanCurve: boolean;  // Use bezier curves for mouse movement
    turbulence: number;      // Random turbulence in mouse path (0-1)
    speedVariance: number;   // Variance in speed during movement (0-1)
  };
  interactionTiming: {
    minDelay: number;        // Minimum delay between interactions
    maxDelay: number;        // Maximum delay between interactions
    idleTimeout: number;     // Time before simulated "idle" behavior
    idleProbability: number; // Probability of triggering idle behavior
  };
}
```

### Main Methods

| Method | Description |
|--------|-------------|
| `typeText(element, text, options?)` | Types text into an element with human-like patterns |
| `moveMouseTo(target, options?)` | Moves mouse to target coordinates or element with natural movement |
| `click(element?, options?)` | Simulates clicking at current position or on an element |
| `randomInteractWithElement(element, interactions?, options?)` | Interacts with an element multiple times with varied patterns |
| `delay(ms)` | Creates a simple delay |
| `randomDelay()` | Generates a random delay within configured parameters |
| `simulateThinking(options?)` | Simulates a period of user inactivity/thinking |
| `extractAndTypeText(sourceDiv, targetInput, options?)` | Extracts text from div and types into input |
| `batchExtractAndType(mappings, options?)` | Extracts text from multiple divs to multiple inputs |
| `clickButton(button, options?)` | Finds and clicks a button with natural movement |
| `clickButtonByText(buttonText, options?)` | Finds a button by text content and clicks it |
| `findDivsAndFillInputs(patterns, options?)` | Finds divs by content pattern and fills corresponding inputs |

## Notes and Best Practices

1. **Avoid Too Much Randomness**: While randomness helps avoid detection, too much can make interactions unpredictable. Tune the parameters based on your needs.

2. **Add Thinking Time**: Real users pause to read content and think. Always include `simulateThinking()` calls between major interactions.

3. **Mix Interaction Types**: Combine clicks, hovers, and movements to create more natural behavior patterns.

4. **Customize for Your Use Case**: Adjust typing speed, error rates, and movement patterns to match your target audience's behavior.

5. **Use Element Selectors**: When possible, pass element selectors as strings instead of direct DOM elements for cleaner code.

6. **Ethical Usage**: Use this library responsibly for legitimate testing and automation purposes only.

## License

MIT