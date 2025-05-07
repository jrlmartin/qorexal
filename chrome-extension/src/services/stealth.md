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

  // Paste large text into an input
await simulator.copyPasteText(
  document.getElementById('large-text-field'),
  'Your very large text content here...',
  {
    thinkingTime: 1500,   // Longer thinking time for complex text
    errorProbability: 0.1 // Slightly lower error rate
  }
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












Yes, websites can detect some Chrome extensions in certain circumstances, though it's not always reliable or comprehensive.

Here are the main ways websites might detect Chrome extensions:

1. **DOM modifications** - Many extensions modify the webpage structure by adding elements or changing existing ones. Websites can scan for these telltale changes.

2. **Resource detection** - Extensions often inject scripts, CSS files, or images. Websites can check for the presence of these resources.

3. **Browser fingerprinting** - Extensions can alter your browser's "fingerprint" (a collection of browser characteristics), which websites might detect.

4. **Behavior analysis** - Some extensions create distinctive behavioral patterns, like specific API calls or timing differences that can be measured.

5. **Content blocking detection** - Websites can set "bait" elements that ad blockers or similar extensions would typically hide, then check if they're visible.

However, detection is not perfect. Extensions that operate in isolated contexts or don't modify webpages directly are harder to detect. Also, some privacy-focused extensions are specifically designed to avoid detection.

For users concerned about privacy, there are "anti-fingerprinting" tools and extensions designed to minimize detectability, though no solution is foolproof.

---

Let me expand on those two important points about extension detectability:

## Extensions in Isolated Contexts

Extensions that operate in isolated contexts are harder to detect because:

- **Background scripts**: Some extensions primarily operate through background scripts that run independently of webpage content. These scripts can perform actions like data synchronization or API calls without touching the DOM structure of websites.

- **Content script limitations**: Extensions can be configured to inject content scripts only on specific domains or under certain conditions, making them invisible on other websites.

- **Chrome's Manifest V3**: The newer extension framework restricts how extensions can interact with webpages, forcing more extensions to use isolated contexts, which incidentally makes them harder for websites to detect.

- **Service workers**: Extensions using service workers operate in a separate thread from the main webpage, reducing their detectability footprint.

## Extensions That Avoid Modifying Webpages

Some extensions avoid detection by:

- **Passive monitoring**: Rather than actively changing content, they might only observe user behavior or network traffic without leaving detectable traces.

- **API interception**: Instead of modifying the DOM, they might intercept and modify API calls or responses before the webpage processes them.

- **Browser storage operations**: Extensions that only read/write to browser storage without affecting webpage rendering are nearly impossible for websites to detect.

## Privacy-Focused Extensions Designed for Stealth

Privacy-focused extensions employ specific techniques to avoid detection:

- **Randomized element identifiers**: They use randomly generated IDs and class names that change with each browser session to prevent pattern recognition.

- **Timing obfuscation**: They introduce random delays in their operations to prevent websites from measuring consistent timing patterns.

- **Fingerprint normalization**: Rather than adding unique characteristics, these extensions attempt to make your browser look like everyone else's, blending into the crowd.

- **API spoofing**: Some override browser APIs that websites use for fingerprinting, returning standard values instead of your actual configuration.

- **Deep browser integration**: The most sophisticated privacy extensions operate at lower levels of the browser architecture where websites have no visibility.

Even with these techniques, it's worth noting that determined websites employing advanced detection methods may still identify some extensions, especially if they're specifically looking for them. The cat-and-mouse game between privacy tools and tracking technologies continues to evolve.

---


# Using Advanced Browser APIs and Event Cloning for Click Simulation

## Chrome DevTools Protocol (CDP) Approach

The Chrome DevTools Protocol provides a way to interact with the browser at a much lower level than standard DOM APIs:

```javascript
// Extension background script with appropriate permissions
chrome.debugger.attach({tabId: activeTabId}, '1.3', function() {
  // Simulate mouse movement first (more realistic)
  chrome.debugger.sendCommand({tabId: activeTabId}, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 100, 
    y: 200
  });
  
  // Mouse down event
  chrome.debugger.sendCommand({tabId: activeTabId}, 'Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: 100,
    y: 200,
    button: 'left',
    clickCount: 1
  });
  
  // Mouse up event
  chrome.debugger.sendCommand({tabId: activeTabId}, 'Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: 100,
    y: 200,
    button: 'left',
    clickCount: 1
  });
});
```

The CDP approach works because:
- It bypasses the JavaScript event system entirely
- It operates at the browser engine level
- The events appear more authentic since they're generated through official browser channels
- Websites have limited ability to detect these low-level operations

## Event Property Cloning Technique

To clone properties from real events:

```javascript
// First, capture properties from genuine user interactions
let lastRealClickProperties = null;

document.addEventListener('click', function(e) {
  if (e.isTrusted) {
    // Store properties from this genuine click
    lastRealClickProperties = {
      screenX: e.screenX,
      screenY: e.screenY,
      clientX: e.clientX,
      clientY: e.clientY,
      button: e.button,
      buttons: e.buttons,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      detail: e.detail,
      // etc.
    };
  }
}, true);

// Later, create a simulated click using the captured properties
function createRealisticClick(element) {
  if (!lastRealClickProperties) return false;
  
  // Create the full sequence of events with cloned properties
  const mouseoverEvent = new MouseEvent('mouseover', lastRealClickProperties);
  const mousedownEvent = new MouseEvent('mousedown', lastRealClickProperties);
  const mouseupEvent = new MouseEvent('mouseup', lastRealClickProperties);
  const clickEvent = new MouseEvent('click', lastRealClickProperties);
  
  // Dispatch in proper sequence with realistic timing
  element.dispatchEvent(mouseoverEvent);
  setTimeout(() => {
    element.dispatchEvent(mousedownEvent);
    setTimeout(() => {
      element.dispatchEvent(mouseupEvent);
      element.dispatchEvent(clickEvent);
    }, 50 + Math.random() * 30); // Random delay between down and up
  }, 20 + Math.random() * 10); // Random delay between over and down
}
```

While these methods are sophisticated, they aren't foolproof. The most effective approaches combine both techniques along with realistic timing patterns and mouse movement trajectories to create the most convincing simulations.