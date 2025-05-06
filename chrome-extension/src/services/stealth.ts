/**
 * Human Interaction Simulator (TypeScript)
 * 
 * This library helps disguise automated interactions by:
 * 1. Randomizing input patterns
 * 2. Creating human-like timing between interactions
 * 3. Simulating natural typing behavior
 * 4. Adding variability to mouse movements
 * 5. Extracting text from div elements and injecting into textboxes
 * 6. Clicking buttons with natural timing and movement
 */

// Type definitions
interface Point {
    x: number;
    y: number;
  }
  
  interface TypingSpeedConfig {
    min: number;  // Minimum ms between keystrokes
    max: number;  // Maximum ms between keystrokes
  }
  
  interface TypingVarianceConfig {
    wordPause: number;       // Additional pause at word endings (space, period)
    sentencePause: number;   // Additional pause at end of sentences
    errorRate: number;       // Chance of making a typo
    correctionDelay: number; // Time before correcting typo
  }
  
  interface MouseMovementConfig {
    useHumanCurve: boolean;  // Use bezier curves for mouse movement
    turbulence: number;      // Random turbulence in mouse path (0-1)
    speedVariance: number;   // Variance in speed during movement (0-1)
    addJitter?: boolean;     // Add random jitter to target position
    jitterAmount?: number;   // Amount of jitter to add
    indirectPath?: boolean;  // Take an indirect path to target
    microJitter?: boolean;   // Add small jitters during movement
  }
  
  interface InteractionTimingConfig {
    minDelay: number;        // Minimum delay between interactions
    maxDelay: number;        // Maximum delay between interactions
    idleTimeout: number;     // Time before simulated "idle" behavior
    idleProbability: number; // Probability of triggering idle behavior
  }
  
  interface SimulatorConfig {
    typingSpeed: TypingSpeedConfig;
    typingVariance: TypingVarianceConfig;
    mouseMovement: MouseMovementConfig;
    interactionTiming: InteractionTimingConfig;
  }
  
  interface TypingSession {
    active: boolean;
    lastTypedChar: string | null;
    typingSpeed: number;
  }
  
  interface MouseState {
    lastPosition: Point;
    currentSpeed: number;
  }
  
  interface SimulatorState {
    lastInteractionTime: number;
    typingSession: TypingSession;
    mouseState: MouseState;
    _randomSeed?: number;
  }
  
  interface ClickOptions {
    doubleClick?: boolean;
    rightClick?: boolean;
    clickCount?: number;
  }
  
  interface RandomInteractOptions {
    includeHovers?: boolean;
    includeClicks?: boolean;
    hoverDuration?: [number, number];
    thinkingPauses?: boolean;
  }
  
  interface ExtractAndTypeOptions {
    maxLength?: number;
    transform?: (text: string) => string;
    min?: number;
    max?: number;
    wordPause?: number;
    sentencePause?: number;
    errorRate?: number;
    correctionDelay?: number;
  }
  
  interface MappingItem {
    source: string | HTMLElement;
    target: string | HTMLElement;
    options?: ExtractAndTypeOptions;
  }
  
  interface PatternItem {
    divPattern: string | RegExp | ((div: HTMLElement) => boolean);
    inputSelector: string;
    transform?: (text: string) => string;
    options?: ExtractAndTypeOptions;
  }
  
  class HumanInteractionSimulator {
    private config: SimulatorConfig;
    private state: SimulatorState;
    private random: () => number;
  
    constructor(options: Partial<SimulatorConfig> = {}) {
      // Default configuration
      this.config = {
        typingSpeed: {
          min: 50,  // Minimum ms between keystrokes
          max: 150, // Maximum ms between keystrokes
        },
        typingVariance: {
          wordPause: 200,       // Additional pause at word endings (space, period)
          sentencePause: 500,   // Additional pause at end of sentences
          errorRate: 0.05,      // 5% chance of making a typo
          correctionDelay: 300, // Time before correcting typo
        },
        mouseMovement: {
          useHumanCurve: true,  // Use bezier curves for mouse movement
          turbulence: 0.5,      // Random turbulence in mouse path (0-1)
          speedVariance: 0.3,   // Variance in speed during movement (0-1)
        },
        interactionTiming: {
          minDelay: 500,        // Minimum delay between interactions
          maxDelay: 2000,       // Maximum delay between interactions
          idleTimeout: 30000,   // Time before simulated "idle" behavior
          idleProbability: 0.1, // Probability of triggering idle behavior
        },
        ...options
      };
      
      // Track state between calls
      this.state = {
        lastInteractionTime: Date.now(),
        typingSession: {
          active: false,
          lastTypedChar: null,
          typingSpeed: 0,
        },
        mouseState: {
          lastPosition: { x: 0, y: 0 },
          currentSpeed: 0,
        }
      };
      
      // Initialize random seed
      this.random = this.initRandom();
    }
    
    /**
     * Initialize a seeded random number generator for repeatable but
     * non-uniform randomization
     */
    private initRandom(): () => number {
      // Simple random seed using current time + random variance
      const seed = Date.now() + Math.floor(Math.random() * 1000);
      
      // Seedable random number generator implementation
      return () => {
        // Using a simple LCG (Linear Congruential Generator)
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        
        // Update seed
        this.state._randomSeed = (a * (this.state._randomSeed || seed) + c) % m;
        
        // Return normalized result (0-1)
        return this.state._randomSeed / m;
      };
    }
    
    /**
     * Get a random number between min and max
     */
    private getRandomBetween(min: number, max: number): number {
      return min + this.random() * (max - min);
    }
    
    /**
     * Simulate typing into an input element with human-like patterns
     * @param element - The DOM element to type into
     * @param text - The text to type
     * @param options - Optional configuration for this typing session
     * @returns Promise that resolves when typing is complete
     */
    async typeText(
      element: HTMLElement | HTMLInputElement, 
      text: string, 
      options: Partial<TypingSpeedConfig & TypingVarianceConfig> = {}
    ): Promise<void> {
      const config = { 
        ...this.config.typingSpeed, 
        ...this.config.typingVariance, 
        ...options 
      };
      
      let currentIndex = 0;
      this.state.typingSession.active = true;
      
      return new Promise<void>((resolve) => {
        const typeNextChar = async (): Promise<void> => {
          if (currentIndex >= text.length) {
            this.state.typingSession.active = false;
            resolve();
            return;
          }
          
          // Get the next character
          const char = text[currentIndex];
          
          // Check if we should simulate a typo
          const makeTypo = this.random() < config.errorRate;
          
          if (makeTypo) {
            // Simulate a typo by typing an adjacent key
            const typoChar = this.getAdjacentKey(char);
            
            // Update input value with the typo
            await this.simulateTypingChar(element, typoChar);
            
            // Wait before "noticing" the error
            await this.delay(config.correctionDelay);
            
            // Erase the typo
            await this.simulateBackspace(element);
            
            // Type the correct character after a delay
            await this.delay(this.getRandomBetween(100, 300));
            await this.simulateTypingChar(element, char);
          } else {
            // Type the correct character
            await this.simulateTypingChar(element, char);
          }
          
          // Calculate delay before next character
          let delay = this.getRandomBetween(config.min, config.max);
          
          // Add extra delay for special characters
          if (char === ' ') {
            delay += this.getRandomBetween(0, config.wordPause);
          } else if (char === '.' || char === '!' || char === '?') {
            delay += this.getRandomBetween(config.wordPause, config.sentencePause);
          }
          
          // Record state
          this.state.typingSession.lastTypedChar = char;
          this.state.lastInteractionTime = Date.now();
          
          // Schedule the next character
          currentIndex++;
          setTimeout(typeNextChar, delay);
        };
        
        // Start typing
        typeNextChar();
      });
    }
    
    /**
     * Simulate typing a single character
     */
    private async simulateTypingChar(
      element: HTMLElement | HTMLInputElement, 
      char: string
    ): Promise<void> {
      // You would integrate with automation library here
      // Example implementation: manually update input value
      if (element && 'value' in element) {
        (element as HTMLInputElement).value += char;
        
        // Dispatch events
        this.dispatchInputEvent(element);
      }
      
      // If working with a more complex automation tool, you would
      // convert this to the appropriate API call for typing
    }
    
    /**
     * Simulate backspace key
     */
    private async simulateBackspace(
      element: HTMLElement | HTMLInputElement
    ): Promise<void> {
      // Example implementation: manually update input value
      if (element && 'value' in element) {
        const inputElement = element as HTMLInputElement;
        inputElement.value = inputElement.value.slice(0, -1);
        
        // Dispatch events
        this.dispatchInputEvent(element);
      }
    }
    
    /**
     * Dispatch appropriate events for input changes
     */
    private dispatchInputEvent(element: HTMLElement): void {
      const event = new Event('input', { bubbles: true });
      element.dispatchEvent(event);
      
      // Also dispatch change event for some form elements
      if (element.tagName === 'SELECT' || 
          (element.tagName === 'INPUT' && 
           ((element as HTMLInputElement).type === 'checkbox' || 
            (element as HTMLInputElement).type === 'radio'))) {
        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);
      }
    }
    
    /**
     * Return an adjacent key to simulate a typo
     */
    private getAdjacentKey(char: string): string {
      // Simplified QWERTY keyboard layout
      const keyboardLayout: Record<string, string[]> = {
        'q': ['w', '1', 'a'],
        'w': ['q', 'e', '2', 's', 'a'],
        'e': ['w', 'r', '3', 'd', 's'],
        'r': ['e', 't', '4', 'f', 'd'],
        't': ['r', 'y', '5', 'g', 'f'],
        'y': ['t', 'u', '6', 'h', 'g'],
        'u': ['y', 'i', '7', 'j', 'h'],
        'i': ['u', 'o', '8', 'k', 'j'],
        'o': ['i', 'p', '9', 'l', 'k'],
        'p': ['o', '0', '[', 'l'],
        'a': ['q', 'w', 's', 'z'],
        's': ['a', 'w', 'e', 'd', 'x', 'z'],
        'd': ['s', 'e', 'r', 'f', 'c', 'x'],
        'f': ['d', 'r', 't', 'g', 'v', 'c'],
        'g': ['f', 't', 'y', 'h', 'b', 'v'],
        'h': ['g', 'y', 'u', 'j', 'n', 'b'],
        'j': ['h', 'u', 'i', 'k', 'm', 'n'],
        'k': ['j', 'i', 'o', 'l', ',', 'm'],
        'l': ['k', 'o', 'p', ';', '.', ','],
        'z': ['a', 's', 'x'],
        'x': ['z', 's', 'd', 'c'],
        'c': ['x', 'd', 'f', 'v'],
        'v': ['c', 'f', 'g', 'b'],
        'b': ['v', 'g', 'h', 'n'],
        'n': ['b', 'h', 'j', 'm'],
        'm': ['n', 'j', 'k', ','],
        ',': ['m', 'k', 'l', '.'],
        '.': [',', 'l', '/'],
        '/': ['.', ';', "'"],
        '1': ['q', '2'],
        '2': ['1', 'q', 'w', '3'],
        '3': ['2', 'w', 'e', '4'],
        '4': ['3', 'e', 'r', '5'],
        '5': ['4', 'r', 't', '6'],
        '6': ['5', 't', 'y', '7'],
        '7': ['6', 'y', 'u', '8'],
        '8': ['7', 'u', 'i', '9'],
        '9': ['8', 'i', 'o', '0'],
        '0': ['9', 'o', 'p', '-'],
        ' ': ['c', 'v', 'b', 'n', 'm', ',', '.']
      };
      
      const lowerChar = char.toLowerCase();
      if (keyboardLayout[lowerChar]) {
        const adjacentKeys = keyboardLayout[lowerChar];
        const randomKey = adjacentKeys[Math.floor(this.random() * adjacentKeys.length)];
        
        // Preserve case
        if (char === char.toUpperCase()) {
          return randomKey.toUpperCase();
        }
        return randomKey;
      }
      
      // If not found in layout, just return a random letter
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      return alphabet[Math.floor(this.random() * alphabet.length)];
    }
    
    /**
     * Simulate mouse movements with greater randomization
     * @param target - Target coordinates {x, y} or element
     * @param options - Options for this specific movement
     */
    async moveMouseTo(
      target: Point | HTMLElement, 
      options: Partial<MouseMovementConfig> = {}
    ): Promise<void> {
      const config = { ...this.config.mouseMovement, ...options };
      
      // Convert element to coordinates if needed
      let targetCoords: Point;
      if ((target as HTMLElement).getBoundingClientRect) {
        const element = target as HTMLElement;
        const rect = element.getBoundingClientRect();
        targetCoords = {
          x: rect.left + this.getRandomBetween(5, rect.width - 5),
          y: rect.top + this.getRandomBetween(5, rect.height - 5)
        };
      } else {
        targetCoords = target as Point;
      }
      
      const start = { ...this.state.mouseState.lastPosition };
      
      // Add random jitter to the target position
      if (config.addJitter) {
        const jitterAmount = config.jitterAmount || 10;
        targetCoords = {
          x: targetCoords.x + this.getRandomBetween(-jitterAmount, jitterAmount),
          y: targetCoords.y + this.getRandomBetween(-jitterAmount, jitterAmount)
        };
      }
      
      // Generate indirect path - make some mouse movements before heading to the target
      if (config.indirectPath) {
        const detourPoints: Point[] = [];
        const numDetours = Math.floor(this.getRandomBetween(1, 3));
        
        for (let i = 0; i < numDetours; i++) {
          // Create a random detour point
          const detourDistance = Math.sqrt(
            Math.pow(targetCoords.x - start.x, 2) + 
            Math.pow(targetCoords.y - start.y, 2)
          ) * 0.5;
          
          detourPoints.push({
            x: start.x + (targetCoords.x - start.x) * this.random() + 
               this.getRandomBetween(-detourDistance, detourDistance),
            y: start.y + (targetCoords.y - start.y) * this.random() + 
               this.getRandomBetween(-detourDistance, detourDistance)
          });
        }
        
        // Move through detour points before heading to target
        for (const point of detourPoints) {
          await this._moveMouseToPoint(start, point, config);
          start.x = point.x;
          start.y = point.y;
        }
      }
      
      // Final movement to actual target
      return this._moveMouseToPoint(start, targetCoords, config);
    }
    
    /**
     * Internal helper for mouse movement implementation
     * @private
     */
    private async _moveMouseToPoint(
      start: Point, 
      target: Point, 
      config: MouseMovementConfig
    ): Promise<void> {
      // Generate control points for bezier curve if human-like movement is enabled
      const controlPoints: Point[] = [];
      if (config.useHumanCurve) {
        // Create a curved path using 2 control points for a cubic bezier
        const distance = Math.sqrt(
          Math.pow(target.x - start.x, 2) + 
          Math.pow(target.y - start.y, 2)
        );
        
        // Add some randomness to the control points
        const turbulence = distance * config.turbulence;
        
        // First control point
        controlPoints.push({
          x: start.x + (target.x - start.x) * 0.3 + this.getRandomBetween(-turbulence, turbulence),
          y: start.y + (target.y - start.y) * 0.1 + this.getRandomBetween(-turbulence, turbulence)
        });
        
        // Second control point
        controlPoints.push({
          x: start.x + (target.x - start.x) * 0.7 + this.getRandomBetween(-turbulence, turbulence),
          y: start.y + (target.y - start.y) * 0.9 + this.getRandomBetween(-turbulence, turbulence)
        });
      }
      
      // Calculate the number of steps based on distance
      const distance = Math.sqrt(
        Math.pow(target.x - start.x, 2) + 
        Math.pow(target.y - start.y, 2)
      );
      
      // More steps for longer distances, but with some variability
      const baseSteps = Math.min(Math.max(Math.floor(distance / 10), 5), 100);
      const steps = Math.floor(baseSteps * (1 + this.getRandomBetween(-0.2, 0.2)));
      
      // This is where you would call your automation library's moveMouseTo function
      // or manually implement the mouse movement logic
      return new Promise<void>((resolve) => {
        let currentStep = 0;
        
        const moveStep = () => {
          if (currentStep >= steps) {
            // Update state
            this.state.mouseState.lastPosition = { ...target };
            this.state.lastInteractionTime = Date.now();
            resolve();
            return;
          }
          
          // Calculate progress (0 to 1)
          const t = currentStep / steps;
          
          // Calculate next position
          let nextX: number, nextY: number;
          
          if (config.useHumanCurve && controlPoints.length === 2) {
            // Use cubic bezier curve for human-like movement
            nextX = this.cubicBezier(t, start.x, controlPoints[0].x, controlPoints[1].x, target.x);
            nextY = this.cubicBezier(t, start.y, controlPoints[0].y, controlPoints[1].y, target.y);
          } else {
            // Use linear interpolation
            nextX = start.x + (target.x - start.x) * t;
            nextY = start.y + (target.y - start.y) * t;
          }
          
          // Add micro-jitter during movement
          if (config.microJitter) {
            const jitterAmount = 2 * (1 - Math.abs(t - 0.5)); // Most jitter in the middle of movement
            nextX += this.getRandomBetween(-jitterAmount, jitterAmount);
            nextY += this.getRandomBetween(-jitterAmount, jitterAmount);
          }
          
          // Here you would update the mouse position using your automation library
          // For example: automationLib.setMousePosition(nextX, nextY);
          
          // Calculate delay before next step - this varies the speed
          // Start slow, accelerate, then decelerate as we approach the target
          let progress = t < 0.5 ? 2 * t : 2 * (1 - t);
          
          // Add some randomness to the speed
          let variance = 1 + this.getRandomBetween(-config.speedVariance, config.speedVariance);
          let delay = 5 + 15 * (1 - progress) * variance;
          
          // Schedule next step
          currentStep++;
          setTimeout(moveStep, delay);
        };
        
        // Start movement
        moveStep();
      });
    }
    
    /**
     * Calculate point on cubic bezier curve
     */
    private cubicBezier(
      t: number, 
      p0: number, 
      p1: number, 
      p2: number, 
      p3: number
    ): number {
      const oneMinusT = 1 - t;
      return Math.pow(oneMinusT, 3) * p0 + 
             3 * Math.pow(oneMinusT, 2) * t * p1 + 
             3 * oneMinusT * Math.pow(t, 2) * p2 + 
             Math.pow(t, 3) * p3;
    }
    
    /**
     * Simulate clicking at the current mouse position or on an element
     * with randomized behavior
     * @param element - Optional element to click on
     * @param options - Click options
     */
    async click(
      element: HTMLElement | null = null, 
      options: ClickOptions = {}
    ): Promise<void> {
      const config = {
        doubleClick: false,
        rightClick: false,
        clickCount: 1,
        ...options
      };
      
      // If element is provided, move to a random position on it first
      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Multiple random positions on the element
        for (let i = 0; i < config.clickCount; i++) {
          // Generate a completely new random position within the element for each click
          const targetPosition = {
            x: rect.left + this.getRandomBetween(3, rect.width - 3),
            y: rect.top + this.getRandomBetween(3, rect.height - 3)
          };
          
          // Movement options for this specific click
          const moveOptions = {
            useHumanCurve: true,
            turbulence: this.getRandomBetween(0.3, 0.7),
            addJitter: true,
            microJitter: true,
            // Sometimes take an indirect path to the element
            indirectPath: this.random() < 0.3
          };
          
          // Move to the random position
          await this.moveMouseTo(targetPosition, moveOptions);
          
          // Random delay before clicking
          await this.delay(this.getRandomBetween(50, 350));
          
          // Here you would call your automation library's click function
          // For example: automationLib.click(config.rightClick ? 'right' : 'left');
          
          // Random delay between clicks if multiple
          if (i < config.clickCount - 1) {
            await this.delay(this.getRandomBetween(100, 400));
          }
        }
      } else {
        // Just click at current position
        // Here you would call your automation library's click function
        // For example: automationLib.click(config.rightClick ? 'right' : 'left');
      }
      
      // Update last interaction time
      this.state.lastInteractionTime = Date.now();
      
      // Add a slight delay after clicking
      return this.delay(this.getRandomBetween(50, 150));
    }
    
    /**
     * Interact with the same element multiple times with random patterns
     * @param element - The element or selector to interact with
     * @param interactions - Number of separate interactions to perform
     * @param options - Options for the interactions
     */
    async randomInteractWithElement(
      element: HTMLElement | string, 
      interactions: number = 3, 
      options: RandomInteractOptions = {}
    ): Promise<void> {
      // Resolve element from selector if string was provided
      const targetElement = typeof element === 'string'
        ? document.querySelector(element) as HTMLElement
        : element;
        
      if (!targetElement) {
        console.error('Target element not found');
        return;
      }
      
      const config = {
        includeHovers: true,     // Include hover movements without clicks
        includeClicks: true,     // Include actual clicks
        hoverDuration: [300, 2000] as [number, number], // Min/max hover duration
        thinkingPauses: true,    // Add thinking pauses between actions
        ...options
      };
      
      for (let i = 0; i < interactions; i++) {
        // Random thinking pause between interactions
        if (config.thinkingPauses && i > 0) {
          await this.simulateThinking({
            idleTimeout: this.getRandomBetween(500, 3000)
          });
        }
        
        // Decide whether to just hover or click
        const shouldClick = config.includeClicks && (
          !config.includeHovers || this.random() > 0.3
        );
        
        // Get element bounds
        const rect = targetElement.getBoundingClientRect();
        
        // Generate a random position on the element
        const randomPosition = {
          x: rect.left + this.getRandomBetween(5, rect.width - 5),
          y: rect.top + this.getRandomBetween(5, rect.height - 5)
        };
        
        // Use different movement patterns for variety
        const moveOptions = {
          useHumanCurve: true,
          turbulence: this.getRandomBetween(0.2, 0.8),
          // Sometimes take a very indirect path
          indirectPath: this.random() < 0.4,
          // Add micro jitter during movement
          microJitter: this.random() < 0.7,
          // Random speed variance
          speedVariance: this.getRandomBetween(0.2, 0.5)
        };
        
        // Move to the random position
        await this.moveMouseTo(randomPosition, moveOptions);
        
        if (shouldClick) {
          // Random delay before clicking
          await this.delay(this.getRandomBetween(50, 400));
          
          // Click with various patterns
          const clickOptions = {
            // Occasionally do a double-click
            doubleClick: this.random() < 0.1,
            // Very rarely do a right-click
            rightClick: this.random() < 0.05,
            // Sometimes do multiple separate clicks
            clickCount: this.random() < 0.2 ? Math.floor(this.getRandomBetween(2, 4)) : 1
          };
          
          await this.click(targetElement, clickOptions);
        } else {
          // Just hover for a random duration
          const hoverTime = this.getRandomBetween(
            config.hoverDuration[0], 
            config.hoverDuration[1]
          );
          await this.delay(hoverTime);
          
          // Occasionally do small mouse movements while hovering
          if (this.random() < 0.6) {
            const jitterCount = Math.floor(this.getRandomBetween(2, 5));
            for (let j = 0; j < jitterCount; j++) {
              // Small movement within the element
              const jitterPosition = {
                x: randomPosition.x + this.getRandomBetween(-10, 10),
                y: randomPosition.y + this.getRandomBetween(-10, 10)
              };
              
              // Keep within element bounds
              jitterPosition.x = Math.max(rect.left + 3, Math.min(rect.right - 3, jitterPosition.x));
              jitterPosition.y = Math.max(rect.top + 3, Math.min(rect.bottom - 3, jitterPosition.y));
              
              await this.moveMouseTo(jitterPosition, {
                useHumanCurve: true,
                turbulence: 0.3,
                microJitter: true
              });
              
              await this.delay(this.getRandomBetween(100, 300));
            }
          }
        }
      }
    }
    
    /**
     * Generate a random delay within the configured interaction timing parameters
     */
    async randomDelay(): Promise<void> {
      const { minDelay, maxDelay } = this.config.interactionTiming;
      return this.delay(this.getRandomBetween(minDelay, maxDelay));
    }
    
    /**
     * Helper to create a delay
     */
    async delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Simulate a period of user inactivity/thinking
     */
    async simulateThinking(options: Partial<InteractionTimingConfig> = {}): Promise<void> {
      const config = { ...this.config.interactionTiming, ...options };
      const thinkingTime = this.getRandomBetween(1000, config.idleTimeout / 2);
      
      // Small movements to simulate the user is still there but thinking
      const smallMovementInterval = setInterval(() => {
        // Small mouse jitter
        const currentPos = this.state.mouseState.lastPosition;
        const jitterAmount = 2;
        
        // New position with tiny movement
        const newPos = {
          x: currentPos.x + this.getRandomBetween(-jitterAmount, jitterAmount),
          y: currentPos.y + this.getRandomBetween(-jitterAmount, jitterAmount)
        };
        
        // Here you would update the mouse position using your automation library
        // For example: automationLib.setMousePosition(newPos.x, newPos.y);
        
        this.state.mouseState.lastPosition = newPos;
      }, 500);
      
      // Wait for the thinking time
      await this.delay(thinkingTime);
      
      // Stop the small movements
      clearInterval(smallMovementInterval);
    }
    
    /**
     * Extract text content from a div element and inject it into an input element
     * with human-like typing behavior
     * @param sourceDiv - The div element or selector to extract text from
     * @param targetInput - The input element or selector to type into
     * @param options - Options for the operation
     */
    async extractAndTypeText(
      sourceDiv: HTMLElement | string, 
      targetInput: HTMLElement | string, 
      options: ExtractAndTypeOptions = {}
    ): Promise<void> {
      // Resolve elements from selectors if strings were provided
      const divElement = typeof sourceDiv === 'string' 
        ? document.querySelector(sourceDiv) as HTMLElement
        : sourceDiv;
        
      const inputElement = typeof targetInput === 'string'
        ? document.querySelector(targetInput) as HTMLElement
        : targetInput;
        
      if (!divElement) {
        console.error('Source div element not found');
        return;
      }
      
      if (!inputElement) {
        console.error('Target input element not found');
        return;
      }
      
      // Extract text from the div
      let textContent = divElement.textContent?.trim() || '';
      
      // Optionally process the text (e.g., truncate, transform)
      if (options.maxLength && textContent.length > options.maxLength) {
        textContent = textContent.substring(0, options.maxLength);
      }
      
      if (options.transform && typeof options.transform === 'function') {
        textContent = options.transform(textContent);
      }
      
      // First move mouse to the input field
      const rect = inputElement.getBoundingClientRect();
      const targetPoint = {
        x: rect.left + this.getRandomBetween(5, rect.width - 5),
        y: rect.top + this.getRandomBetween(5, rect.height - 5)
      };
      
      await this.moveMouseTo(targetPoint);
      
      // Click the input field
      await this.click();
      
      // Add a small thinking delay before typing
      await this.delay(this.getRandomBetween(300, 800));
      
      // Extract only typing-related options
      const typingOptions: Partial<TypingSpeedConfig & TypingVarianceConfig> = {
        min: options.min,
        max: options.max,
        wordPause: options.wordPause,
        sentencePause: options.sentencePause,
        errorRate: options.errorRate,
        correctionDelay: options.correctionDelay
      };
      
      // Type the text
      return this.typeText(inputElement, textContent, typingOptions);
    }
    
    /**
     * Extract text from multiple div elements and inject into corresponding inputs
     * @param mappings - Array of {source, target} mappings
     * @param options - Options for all operations
     */
    async batchExtractAndType(
      mappings: MappingItem[], 
      options: ExtractAndTypeOptions = {}
    ): Promise<void> {
      for (const mapping of mappings) {
        // Add some thinking time between fields
        if (mappings.indexOf(mapping) > 0) {
          await this.simulateThinking({
            idleTimeout: this.getRandomBetween(1000, 3000)
          });
        }
        
        await this.extractAndTypeText(
          mapping.source, 
          mapping.target, 
          { ...options, ...mapping.options }
        );
      }
    }
    
    /**
     * Find and click a button element
     * @param button - The button element or selector
     * @param options - Options for the operation
     */
    async clickButton(
      button: HTMLElement | string, 
      options: { 
        clickPattern?: 'center' | 'random' | 'natural',
        thinkBeforeClick?: boolean,
        turbulence?: number
      } = {}
    ): Promise<void> {
      // Resolve element from selector if string was provided
      const buttonElement = typeof button === 'string'
        ? document.querySelector(button) as HTMLElement
        : button;
        
      if (!buttonElement) {
        console.error('Button element not found');
        return;
      }
      
      // Get button dimensions and position
      const rect = buttonElement.getBoundingClientRect();
      
      // Different click patterns based on options
      let targetPoint: Point;
      
      if (options.clickPattern === 'center') {
        // Click in the center of the button
        targetPoint = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      } else if (options.clickPattern === 'random') {
        // Click at a random point within the button
        targetPoint = {
          x: rect.left + this.getRandomBetween(5, rect.width - 5),
          y: rect.top + this.getRandomBetween(5, rect.height - 5)
        };
      } else if (options.clickPattern === 'natural') {
        // Click with a bias toward the center (more natural)
        // Using triangular distribution which has higher probability in the middle
        const triangularRandom = () => {
          const r1 = this.random();
          const r2 = this.random();
          return (r1 + r2) / 2;
        };
        
        targetPoint = {
          x: rect.left + 5 + triangularRandom() * (rect.width - 10),
          y: rect.top + 5 + triangularRandom() * (rect.height - 10)
        };
      } else {
        // Default to natural pattern
        const triangularRandom = () => {
          const r1 = this.random();
          const r2 = this.random();
          return (r1 + r2) / 2;
        };
        
        targetPoint = {
          x: rect.left + 5 + triangularRandom() * (rect.width - 10),
          y: rect.top + 5 + triangularRandom() * (rect.height - 10)
        };
      }
      
      // First, add some thinking time before clicking (if enabled)
      if (options.thinkBeforeClick !== false) {
        await this.delay(this.getRandomBetween(300, 1200));
      }
      
      // Move mouse to the button
      await this.moveMouseTo(targetPoint, {
        useHumanCurve: true,
        turbulence: options.turbulence || 0.4
      });
      
      // Small delay before clicking
      await this.delay(this.getRandomBetween(50, 350));
      
      // Perform the click
      return this.click();
    }
    
    /**
     * Find and click a button by its text content
     * @param buttonText - The text content to search for
     * @param options - Options for the operation
     */
    async clickButtonByText(
      buttonText: string, 
      options: { 
        thinkBeforeClick?: boolean,
        clickPattern?: 'center' | 'random' | 'natural',
        turbulence?: number
      } = {}
    ): Promise<void> {
      // Find all elements that might be buttons
      const potentialButtons = Array.from(document.querySelectorAll(
        'button, input[type="button"], input[type="submit"], a.btn, .button, [role="button"]'
      )) as HTMLElement[];
      
      // Find the first element that contains the given text
      const matchingButton = potentialButtons.find(element => {
        const elementText = element.textContent || 
                           (element as HTMLInputElement).value || '';
        return elementText.trim().includes(buttonText);
      });
      
      if (!matchingButton) {
        console.error(`No button found with text: ${buttonText}`);
        return;
      }
      
      return this.clickButton(matchingButton, options);
    }
    
    /**
     * Find divs by text content pattern and extract data to corresponding input fields
     * @param patterns - Array of {divPattern, inputSelector, transform} objects
     */
    async findDivsAndFillInputs(
      patterns: PatternItem[], 
      options: ExtractAndTypeOptions = {}
    ): Promise<void> {
      for (const pattern of patterns) {
        // Find all divs in the document
        const allDivs = Array.from(document.querySelectorAll('div')) as HTMLElement[];
        
        // Find the first div that matches the pattern
        let matchingDiv: HTMLElement | undefined;
        
        if (typeof pattern.divPattern === 'string') {
          // Simple string matching
          matchingDiv = allDivs.find(div => 
            div.textContent?.includes(pattern.divPattern as string)
          );
        } else if (pattern.divPattern instanceof RegExp) {
          // Regular expression matching
          matchingDiv = allDivs.find(div => 
            pattern.divPattern instanceof RegExp &&
            div.textContent !== null &&
            (pattern.divPattern as RegExp).test(div.textContent)
          );
        } else if (typeof pattern.divPattern === 'function') {
          // Custom matching function
          matchingDiv = allDivs.find(div => 
            (pattern.divPattern as (div: HTMLElement) => boolean)(div)
          );
        }
        
        if (matchingDiv && pattern.inputSelector) {
          const inputElement = document.querySelector(pattern.inputSelector) as HTMLElement;
          
          if (inputElement) {
            // Add some thinking time between fields
            if (patterns.indexOf(pattern) > 0) {
              await this.simulateThinking({
                idleTimeout: this.getRandomBetween(1000, 3000)
              });
            }
            
            await this.extractAndTypeText(
              matchingDiv,
              inputElement,
              {
                transform: pattern.transform,
                ...options,
                ...pattern.options
              }
            );
          }
        }
      }
    }
  }
  
  // Extended example of randomized interactions with the same element
  async function randomInteractionExample() {
    // Create the simulator
    const simulator = new HumanInteractionSimulator({
      // More extreme variations for demonstration
      mouseMovement: {
        useHumanCurve: true,
        turbulence: 0.6,
        speedVariance: 0.5,
      }
    });
    
    // Find the search box
    const searchBox = document.querySelector('#search-input') as HTMLInputElement;
    
    // Multiple random interactions with the same element
    await simulator.randomInteractWithElement(searchBox, 5, {
      includeHovers: true,
      includeClicks: true,
      hoverDuration: [500, 3000]
    });
    
    // Type some text with human-like patterns
    await simulator.typeText(searchBox, 'Natural interaction patterns');
    
    // Find a button to interact with
    const button = document.querySelector('#submit-button') as HTMLElement;
    
    // Multiple random interactions with the button
    await simulator.randomInteractWithElement(button, 3, {
      includeHovers: true,
      includeClicks: true
    });
  }
  
  // Export the main class
  export default HumanInteractionSimulator;