import { Injectable } from "@angular/core";
import $ from "jquery";
import { LLMMessage } from "../types";
import HumanInteractionSimulator from "./stealth";
import { HumanInteractionVisualization } from "./visualize";

/**
 * Error codes for DOM manipulation operations
 */
enum DOMErrorCode {
  // DOM element errors (100-199)
  ELEMENT_NOT_FOUND = 100,
  ELEMENT_NOT_INTERACTIVE = 101,

  // Workflow errors (200-299)
  PROMPT_SUBMISSION_FAILED = 200,
  RESPONSE_CAPTURE_FAILED = 201,
  WORKFLOW_EXECUTION_FAILED = 202,
  RESET_FAILED = 203,

  // Polling/timing errors (300-399)
  MAX_POLLING_ATTEMPTS_REACHED = 300,

  // General errors (900-999)
  GENERAL_ERROR = 900,
}

/**
 * Log levels for debugging
 */
enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

@Injectable({
  providedIn: "root",
})
export class DOMManipulationService {
  // Logging configuration
  private debugMode = false;

  // Visualization flag
  private visualizationEnabled = true;

  // Selectors
  private readonly PROMPT_TEXTAREA_SELECTOR = "#prompt-textarea";
  private readonly SUBMIT_BUTTON_SELECTOR = "#composer-submit-button";
  private readonly ASSISTANT_MESSAGE_SELECTOR =
    "[data-message-author-role='assistant']";
  private readonly LOADING_INDICATOR_SELECTOR = ".result-streaming";
  private readonly JSON_CODE_BLOCK_SELECTOR = "div.markdown code.language-json";
  private readonly NEW_CHAT_BUTTON_SELECTOR =
    "[data-testid='create-new-chat-button']";
  private readonly SEARCH_BUTTON_SELECTOR =
    "[data-testid='composer-button-search']";
  private readonly DEEP_RESEARCH_BUTTON_SELECTOR =
    "[data-testid='composer-button-deep-research']";

  // Time and polling configurations
  private readonly MAX_POLLING_ATTEMPTS = 600; // Maximum number of polling attempts
  private readonly POLLING_INTERVAL = 5000; // Polling interval in milliseconds
  private readonly MIN_RANDOM_DELAY = 1000; // 1 second
  private readonly MAX_RANDOM_DELAY = 3000; // 3 seconds

  // Human interaction simulator
  private simulator: HumanInteractionSimulator;
  private visualization: HumanInteractionVisualization | null = null;

  constructor() {
    // Initialize the human interaction simulator with custom settings
    this.simulator = new HumanInteractionSimulator({
      typingSpeed: {
        min: 50, // Minimum ms between keystrokes
        max: 150, // Maximum ms between keystrokes
      },
      typingVariance: {
        wordPause: 200, // Additional pause at word endings (space, period)
        sentencePause: 500, // Additional pause at end of sentences
        errorRate: 0.05, // 5% chance of making a typo
        correctionDelay: 300, // Time before correcting typo
      },
      mouseMovement: {
        useHumanCurve: true, // Use bezier curves for mouse movement
        turbulence: 0.5, // Random turbulence in mouse path (0-1)
        speedVariance: 0.3, // Variance in speed during movement (0-1)
      },
      interactionTiming: {
        minDelay: 500, // Minimum delay between interactions
        maxDelay: 2000, // Maximum delay between interactions
        idleTimeout: 30000, // Time before simulated "idle" behavior
        idleProbability: 0.1, // Probability of triggering idle behavior
      },
    });

    // Initialize visualization if enabled
    if (this.visualizationEnabled) {
      this.initVisualization();
    }
  }

  /**
   * Initialize the human interaction visualization
   */
  private initVisualization(): void {
    // Create visualization with default settings
    this.visualization = new HumanInteractionVisualization(this.simulator, {
      cursorSize: 15,
      trailLength: 50,
      trailColor: "rgba(255, 0, 0, 0.4)",
      cursorColor: "rgba(255, 0, 0, 0.7)",
      showTrail: true,
      fadeTrail: true,
      showSpeed: true,
      trailThickness: 3,
    });

    // Create visualization control panel
    this.createVisualizationControls();
  }

  /**
   * Create UI controls for the visualization
   */
  private createVisualizationControls(): void {
    if (!this.visualization) return;

    // Create control panel container
    const controlPanel = document.createElement("div");
    controlPanel.style.position = "fixed";
    controlPanel.style.bottom = "20px";
    controlPanel.style.right = "20px";
    controlPanel.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    controlPanel.style.padding = "10px";
    controlPanel.style.borderRadius = "5px";
    controlPanel.style.zIndex = "10000";
    controlPanel.style.color = "white";
    controlPanel.style.fontFamily = "Arial, sans-serif";
    controlPanel.style.fontSize = "12px";

    // Add title
    const title = document.createElement("div");
    title.textContent = "Visualization Controls";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";
    controlPanel.appendChild(title);

    // Show/hide visualization button
    const toggleButton = document.createElement("button");
    toggleButton.textContent = this.visualizationEnabled
      ? "Hide Cursor"
      : "Show Cursor";
    toggleButton.style.backgroundColor = "#4a90e2";
    toggleButton.style.color = "white";
    toggleButton.style.border = "none";
    toggleButton.style.padding = "5px 10px";
    toggleButton.style.borderRadius = "3px";
    toggleButton.style.marginBottom = "8px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.display = "block";
    toggleButton.style.width = "100%";
    toggleButton.addEventListener("click", () => {
      this.toggleVisualization();
      toggleButton.textContent = this.visualizationEnabled
        ? "Hide Cursor"
        : "Show Cursor";
    });
    controlPanel.appendChild(toggleButton);

    // Show trail checkbox
    const showTrailLabel = this.createCheckboxControl(
      "Show Trail",
      this.visualization.options.showTrail,
      (checked) => {
        if (this.visualization) {
          this.visualization.options.showTrail = checked;
          if (!checked) {
            this.visualization.clearTrail();
          }
        }
      }
    );
    controlPanel.appendChild(showTrailLabel);

    // Fade trail checkbox
    const fadeTrailLabel = this.createCheckboxControl(
      "Fade Trail",
      this.visualization.options.fadeTrail,
      (checked) => {
        if (this.visualization) {
          this.visualization.options.fadeTrail = checked;
        }
      }
    );
    controlPanel.appendChild(fadeTrailLabel);

    // Show speed checkbox
    const showSpeedLabel = this.createCheckboxControl(
      "Show Speed",
      this.visualization.options.showSpeed,
      (checked) => {
        if (this.visualization && this.visualization.speedIndicator) {
          this.visualization.options.showSpeed = checked;
          this.visualization.speedIndicator.style.display = checked
            ? "block"
            : "none";
        }
      }
    );
    controlPanel.appendChild(showSpeedLabel);

    // Clear trail button
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear Trail";
    clearButton.style.backgroundColor = "#4a90e2";
    clearButton.style.color = "white";
    clearButton.style.border = "none";
    clearButton.style.padding = "5px 10px";
    clearButton.style.borderRadius = "3px";
    clearButton.style.marginTop = "8px";
    clearButton.style.cursor = "pointer";
    clearButton.style.display = "block";
    clearButton.style.width = "100%";
    clearButton.addEventListener("click", () => {
      if (this.visualization) {
        this.visualization.clearTrail();
      }
    });
    controlPanel.appendChild(clearButton);

    // Add the control panel to the document
    document.body.appendChild(controlPanel);
  }

  /**
   * Create a checkbox control with label
   */
  private createCheckboxControl(
    labelText: string,
    initialValue: boolean,
    onChange: (checked: boolean) => void
  ): HTMLLabelElement {
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.marginBottom = "5px";
    label.style.cursor = "pointer";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = initialValue;
    checkbox.style.marginRight = "5px";
    checkbox.addEventListener("change", () => onChange(checkbox.checked));

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(labelText));

    return label;
  }

  /**
   * Generate a random number between min and max
   */
  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Log a message to the console if debug mode is enabled
   * @param message The message to log
   * @param level The log level (debug, info, warn, error)
   * @param details Optional details to include in the log
   */
  private log(
    message: string,
    level: LogLevel = LogLevel.DEBUG,
    details?: any
  ): void {
    if (!this.debugMode) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.log(`${prefix} ${message}`, details || "");
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ${message}`, details || "");
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ${message}`, details || "");
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} ${message}`, details || "");
        break;
    }
  }

  /**
   * Enable or disable debug logging
   * @param enable Whether to enable debug logging
   */
  public setDebugMode(enable: boolean): void {
    this.debugMode = enable;
    this.log(`Debug mode ${enable ? "enabled" : "disabled"}`, LogLevel.INFO);
  }

  /**
   * Verifies that all required DOM elements exist in the page
   * @returns True if all elements exist
   * @throws Error if any element is missing
   */
  verifyDOMElements(): boolean {
    this.log("Verifying DOM elements");
    const selectors = {
      "Prompt textarea": this.PROMPT_TEXTAREA_SELECTOR,
      // "Submit button": this.SUBMIT_BUTTON_SELECTOR,
      // "Assistant message": this.ASSISTANT_MESSAGE_SELECTOR,
      // "JSON code block": this.JSON_CODE_BLOCK_SELECTOR,
      "New chat button": this.NEW_CHAT_BUTTON_SELECTOR,
    };

    let allElementsFound = true;

    for (const [elementName, selector] of Object.entries(selectors)) {
      const $element = $(selector);
      const found = $element.length > 0;
      this.log(
        `Checking for ${elementName} (${selector}): ${
          found ? "FOUND" : "NOT FOUND"
        }`
      );

      if (!found) {
        allElementsFound = false;
        this.log(
          `Required DOM element not found: ${elementName} with selector ${selector}`,
          LogLevel.ERROR
        );
        // Only throw error for critical elements like submit button and text area
        if (
          elementName === "Prompt textarea" ||
          elementName === "Submit button"
        ) {
          this.handleError(
            `Required DOM element not found: ${elementName}`,
            DOMErrorCode.ELEMENT_NOT_FOUND,
            {
              selector,
              page: window.location.href,
            }
          );
        }
      }
    }

    this.log(
      "All required DOM elements verified:",
      LogLevel.INFO,
      allElementsFound
    );
    return true;
  }

  /**
   * Injects a prompt into the textarea and submits it
   */
  async injectPrompt(prompt: string): Promise<boolean> {
    try {
      // Find the prompt textarea
      const $textarea = $(this.PROMPT_TEXTAREA_SELECTOR);
      if ($textarea.length === 0) {
        this.handleError(
          "Prompt textarea not found",
          DOMErrorCode.ELEMENT_NOT_FOUND,
          { selector: this.PROMPT_TEXTAREA_SELECTOR }
        );
      }

      // Get the DOM element from jQuery object
      const textareaElement = $textarea[0] as HTMLInputElement;

      // Add human-like thinking delay before typing
      await this.simulator.simulateThinking({
        idleTimeout: this.randomBetween(1000, 3000),
      });

      // Paste large text into an input
      await this.simulator.copyPasteText(textareaElement, prompt, {
        thinkingTime: 1500, // Longer thinking time for complex text
        errorProbability: 0.1, // Slightly lower error rate
      });

      return true;
    } catch (error) {
      this.handleError(
        "Error in runPrompt",
        DOMErrorCode.PROMPT_SUBMISSION_FAILED,
        { error }
      );
      return false;
    }
  }

  async runPrompt() {
    this.log(
      "runPrompt started - looking for submit button with selector:",
      LogLevel.DEBUG,
      this.SUBMIT_BUTTON_SELECTOR
    );

    // Find the submit button
    let $submitButton = $(this.SUBMIT_BUTTON_SELECTOR);

    // Log detailed info about current DOM state
    this.log("Submit button found?", LogLevel.DEBUG, $submitButton.length > 0);
    this.log("Page URL:", LogLevel.DEBUG, window.location.href);

    // If the primary selector fails, try alternative selectors that might work
    if ($submitButton.length === 0) {
      this.log(
        "Primary submit button selector failed, trying fallbacks",
        LogLevel.INFO
      );

      // Common alternative selectors for submit buttons
      const fallbackSelectors = [
        "button[data-testid='submit']",
        "button[type='submit']",
        "button.submit-btn",
        "button:contains('Send')",
        "button:contains('Submit')",
        "button.send-button",
        "button.primary-action",
        "[aria-label='Send message']",
        "[data-testid='send-button']",
      ];

      for (const selector of fallbackSelectors) {
        const $fallbackButton = $(selector);
        this.log(
          `Trying fallback selector: ${selector} - Found: ${
            $fallbackButton.length > 0
          }`,
          LogLevel.DEBUG
        );

        if ($fallbackButton.length > 0) {
          this.log(
            `Found working fallback selector: ${selector}`,
            LogLevel.INFO
          );
          $submitButton = $fallbackButton;
          break;
        }
      }
    }

    // Log details about nearby elements to help debug selector issues
    this.log(
      "Parent container HTML:",
      LogLevel.DEBUG,
      $submitButton.parent().html()
    );

    // List all buttons on the page to help find the right selector
    const allButtons = $("button");
    this.log("Total buttons found on page:", LogLevel.DEBUG, allButtons.length);
    this.log(
      "Button elements:",
      LogLevel.DEBUG,
      Array.from(allButtons).map((el) => ({
        id: el.id,
        class: el.className,
        text: $(el).text().trim().substring(0, 20),
        visible: $(el).is(":visible"),
        attributes: Array.from(el.attributes)
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(", "),
      }))
    );

    if ($submitButton.length === 0) {
      this.log(
        "Submit button not found. DOM structure may have changed.",
        LogLevel.ERROR
      );

      // Capture a snapshot of form elements to help identify the correct selector
      this.log("Form elements:", LogLevel.DEBUG, $("form").html());
      this.log(
        "Text input elements:",
        LogLevel.DEBUG,
        $("input[type='text'], textarea").length
      );

      this.handleError(
        "Submit button not found",
        DOMErrorCode.ELEMENT_NOT_FOUND,
        { selector: this.SUBMIT_BUTTON_SELECTOR }
      );
    }

    // Get the DOM element from jQuery object
    const submitButtonElement = $submitButton[0] as HTMLElement;

    // Add a human-like pause before clicking
    await this.simulator.delay(this.randomBetween(300, 1000));

    // Use simulator to click the button with natural movement
    this.log("About to click submit button", LogLevel.INFO);
    try {
      await this.simulator.clickButton(submitButtonElement, {
        clickPattern: "natural",
        thinkBeforeClick: true,
        turbulence: 0.4,
      });
      this.log("Submit button clicked successfully", LogLevel.INFO);
      return true;
    } catch (error) {
      this.log("Error clicking submit button:", LogLevel.ERROR, error);
      this.handleError(
        "Error clicking submit button",
        DOMErrorCode.ELEMENT_NOT_INTERACTIVE,
        { error, buttonElement: submitButtonElement }
      );
      return false;
    }
  }

  /**
   * Waits for and captures the response text
   */
  async captureText(): Promise<string | null> {
    try {
      for (let attempt = 0; attempt < this.MAX_POLLING_ATTEMPTS; attempt++) {
        // Wait for the polling interval with slight randomization
        const randomizedInterval =
          this.POLLING_INTERVAL + this.randomBetween(-500, 500);
        await this.simulator.delay(randomizedInterval);

        // Check if there's a completed response (last message from assistant)
        const lastAssistantMessage = $(this.ASSISTANT_MESSAGE_SELECTOR).last();

        // If we found a message and it doesn't have a loading indicator
        if (
          lastAssistantMessage.length > 0 &&
          !lastAssistantMessage.find(this.LOADING_INDICATOR_SELECTOR).length
        ) {
          this.log(
            `Response found after ${attempt + 1} attempts`,
            LogLevel.INFO
          );

          // Simulate human reading time - longer for more content
          const contentLength = lastAssistantMessage.text().length;
          const readingTime = Math.min(contentLength * 5, 5000); // ~5ms per character, max 5 seconds
          await this.simulator.simulateThinking({ idleTimeout: readingTime });

          // Look for code blocks (in case of JSON formatting)
          const jsonText = $(this.JSON_CODE_BLOCK_SELECTOR).text();

          // If it looks like JSON, just return the raw text
          if (
            jsonText.trim().startsWith("{") &&
            jsonText.trim().endsWith("}")
          ) {
            return jsonText;
          }

          return jsonText;
        }

        this.log(`Polling for response: attempt ${attempt + 1}`, LogLevel.INFO);
      }

      this.handleError(
        "Max polling attempts reached without finding a response",
        DOMErrorCode.MAX_POLLING_ATTEMPTS_REACHED,
        {
          maxAttempts: this.MAX_POLLING_ATTEMPTS,
          pollingInterval: this.POLLING_INTERVAL,
        }
      );
      return null;
    } catch (error) {
      this.handleError(
        "Error in captureText",
        DOMErrorCode.RESPONSE_CAPTURE_FAILED,
        { error }
      );
      return null;
    }
  }

  /**
   * Creates a new chat
   */
  async reset(): Promise<boolean> {
    try {
      const newChatButton = document.querySelector(
        this.NEW_CHAT_BUTTON_SELECTOR
      ) as HTMLElement;

      if (newChatButton) {
        // Simulate human thinking before starting a new chat
        await this.simulator.simulateThinking({
          idleTimeout: this.randomBetween(1000, 3000),
        });

        // Use simulator to click the new chat button
        await this.simulator.clickButton(newChatButton, {
          clickPattern: "natural",
          thinkBeforeClick: true,
        });

        this.log("New chat created successfully", LogLevel.INFO);
        return true;
      } else {
        this.handleError(
          "New chat button not found",
          DOMErrorCode.ELEMENT_NOT_FOUND,
          {
            selector: this.NEW_CHAT_BUTTON_SELECTOR,
            buttonFound: !!newChatButton,
          }
        );
        return false;
      }
    } catch (error) {
      this.handleError("Error in reset", DOMErrorCode.RESET_FAILED, { error });
      return false;
    }
  }

  private async setSettings(message: LLMMessage) {
    const { deepResearch, search, model } = message;

    // Add random delay before changing settings
    await this.simulator.randomDelay();

    // If search is enabled, click the search button
    if (search) {
      const $searchButton = $(this.SEARCH_BUTTON_SELECTOR);
      if ($searchButton.length === 0) {
        this.handleError(
          "Search button not found",
          DOMErrorCode.ELEMENT_NOT_FOUND,
          { selector: this.SEARCH_BUTTON_SELECTOR }
        );
      }

      // Get the DOM element from jQuery object
      const searchButtonElement = $searchButton[0] as HTMLElement;

      // Use simulator to click the button with natural movement
      await this.simulator.clickButton(searchButtonElement, {
        clickPattern: "natural",
        thinkBeforeClick: true,
      });

      this.log("Search button clicked", LogLevel.INFO);
    } else if (deepResearch) {
      // If deepResearch is enabled, click the deep research button
      const $deepResearchButton = $(this.DEEP_RESEARCH_BUTTON_SELECTOR);
      if ($deepResearchButton.length === 0) {
        this.handleError(
          "Deep research button not found",
          DOMErrorCode.ELEMENT_NOT_FOUND,
          { selector: this.DEEP_RESEARCH_BUTTON_SELECTOR }
        );
      }

      // Get the DOM element from jQuery object
      const deepResearchButtonElement = $deepResearchButton[0] as HTMLElement;

      // Use simulator to click the button with natural movement
      await this.simulator.clickButton(deepResearchButtonElement, {
        clickPattern: "natural",
        thinkBeforeClick: true,
      });

      this.log("Deep research button clicked", LogLevel.INFO);
      return true;
    }
  }

  /**
   * Run the complete workflow: prompt, capture, process
   */
  async runWorkflow(
    message: LLMMessage
  ): Promise<{ success: boolean; response: string | null }> {
    this.log(
      "runWorkflow started with message:",
      LogLevel.INFO,
      JSON.stringify(message, null, 2)
    );
    try {
      // Verify DOM elements before proceeding with workflow
      this.verifyDOMElements();
      await this.reset();

      // Use randomized delays instead of fixed delays
      await this.simulator.randomDelay();

      // await this.setSettings(message);

      // Randomized delay between setting selection and typing prompt
      await this.simulator.randomDelay();

      this.log("About to inject prompt", LogLevel.INFO);
      const injectionResult = await this.injectPrompt(message.prompt);

      if (!injectionResult) {
        this.handleError(
          "Failed to inject prompt",
          DOMErrorCode.PROMPT_SUBMISSION_FAILED,
          {
            step: "injectPrompt",
            workflow: "runWorkflow",
          }
        );
        return { success: false, response: null };
      }

      // Randomized thinking time before submitting prompt
      await this.simulator.simulateThinking({
        idleTimeout: this.randomBetween(1000, 3000),
      });

      this.log("About to call runPrompt", LogLevel.INFO);
      const promptSuccess = await this.runPrompt();
      this.log("runPrompt result:", LogLevel.INFO, promptSuccess);

      if (!promptSuccess) {
        this.handleError(
          "Failed to submit prompt",
          DOMErrorCode.PROMPT_SUBMISSION_FAILED,
          {
            step: "runPrompt",
            workflow: "runWorkflow",
          }
        );
        return { success: false, response: null };
      }

      await this.simulator.simulateThinking({
        idleTimeout: this.randomBetween(1000, 3000),
      });

      await this.simulator.simulateThinking({
        idleTimeout: this.randomBetween(2000, 4000),
      });

      // // Find the copy button element
      // const copyButtonSelector =
      //   "button.flex.gap-1.items-center[aria-label='Copy']";
      // const $copyButton = $(copyButtonSelector);

      // this.log("Copy button:", LogLevel.DEBUG, { button: $copyButton, selector: copyButtonSelector });

      // if (!$copyButton) {
      //   this.log("Copy button not found", LogLevel.INFO);
      //   // Proceed without clicking the copy button
      // } else {
      //   this.log("About to click copy button", LogLevel.INFO);
      //   const submitButtonElement = $copyButton[0] as HTMLElement;
      //   await this.simulator.clickButton(submitButtonElement, {
      //     clickPattern: "natural",
      //     thinkBeforeClick: true,
      //     turbulence: 0.4,
      //   });
      //   this.log("Copy button clicked", LogLevel.INFO);
      // }

      let responseData = await this.captureText();

      if (!responseData && message.deepResearch) {
        // Randomized thinking delay before continuing with fallback prompt
        await this.simulator.simulateThinking({
          idleTimeout: this.randomBetween(3000, 7000),
        });

        const fallbackInjectionResult = await this.injectPrompt(
          message.fallbackPrompt
        );

        if (!fallbackInjectionResult) {
          this.handleError(
            "Failed to inject fallback prompt",
            DOMErrorCode.PROMPT_SUBMISSION_FAILED,
            {
              step: "injectPrompt (fallback)",
              workflow: "runWorkflow",
            }
          );
          return { success: false, response: null };
        }

        // Randomized delay before submitting the fallback prompt
        await this.simulator.simulateThinking({
          idleTimeout: this.randomBetween(1000, 2000),
        });

        const promptSuccess = await this.runPrompt();

        if (!promptSuccess) {
          this.handleError(
            "Failed to submit prompt",
            DOMErrorCode.PROMPT_SUBMISSION_FAILED,
            {
              step: "runPrompt",
              workflow: "runWorkflow",
            }
          );
          return { success: false, response: null };
        }

        await this.simulator.simulateThinking({
          idleTimeout: this.randomBetween(2000, 4000),
        });

        //   // Find the copy button element
        //   const copyButtonSelector =
        //     "button.flex.gap-1.items-center[aria-label='Copy']";
        //   const $copyButton = $(copyButtonSelector);

        //   if ($copyButton.length === 0) {
        //     this.log("Copy button not found", LogLevel.INFO);
        //     // Proceed without clicking the copy button
        //   } else {
        //     this.log("About to click copy button", LogLevel.INFO);
        //     const submitButtonElement = $copyButton[0] as HTMLElement;
        //     await this.simulator.clickButton(submitButtonElement, {
        //       clickPattern: "natural",
        //       thinkBeforeClick: true,
        //       turbulence: 0.4,
        //     });
        //     responseData = await this.captureText();
        //     this.log("Copy button clicked", LogLevel.INFO);
        //   }
      }

      if (!responseData) {
        this.handleError(
          "Failed to capture response",
          DOMErrorCode.RESPONSE_CAPTURE_FAILED,
          {
            step: "captureText",
            workflow: "runWorkflow",
          }
        );
      } else {
        return { success: true, response: responseData };
      }
    } catch (error) {
      this.handleError(
        "Error in workflow execution",
        DOMErrorCode.WORKFLOW_EXECUTION_FAILED,
        { error }
      );
      return { success: false, response: null };
    }
  }

  /**
   * Helper method to create a delay (using simulator's delay method)
   */
  private delay(ms: number): Promise<void> {
    return this.simulator.delay(ms);
  }

  /**
   * Generates a random delay between MIN_RANDOM_DELAY and MAX_RANDOM_DELAY
   */
  private getRandomDelay(): number {
    return this.randomBetween(this.MIN_RANDOM_DELAY, this.MAX_RANDOM_DELAY);
  }

  /**
   * Handles errors with detailed debugging information
   * @param message Error message
   * @param errorCode Error code from DOMErrorCode enum
   * @param details Optional object with debugging details
   */
  private handleError(
    message: string,
    errorCode: DOMErrorCode,
    details?: Record<string, any>
  ): never {
    // Add more context for debuggability
    const debugInfo = {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      htmlState: {
        promptTextareaExists: $(this.PROMPT_TEXTAREA_SELECTOR).length > 0,
        submitButtonExists: $(this.SUBMIT_BUTTON_SELECTOR).length > 0,
        newChatButtonExists: $(this.NEW_CHAT_BUTTON_SELECTOR).length > 0,
      },
      selector: details?.selector || "N/A",
      ...details,
    };

    this.log(`ERROR [${errorCode}]: ${message}`, LogLevel.ERROR, debugInfo);
    throw new Error(`[${errorCode}] ${message}`);
  }

  /**
   * Toggle visualization cursor on or off
   * @param enable Whether to enable the visualization
   * @returns The new state of the visualization
   */
  public toggleVisualization(enable?: boolean): boolean {
    // If a value is provided, use it; otherwise toggle the current value
    this.visualizationEnabled =
      enable !== undefined ? enable : !this.visualizationEnabled;

    this.log(
      `Visualization ${this.visualizationEnabled ? "enabled" : "disabled"}`,
      LogLevel.INFO
    );

    if (this.visualizationEnabled) {
      // Initialize visualization if it doesn't exist
      if (!this.visualization) {
        this.initVisualization();
      } else {
        // Show existing visualization
        this.visualization.show();
      }
    } else if (this.visualization) {
      // Hide visualization if it exists
      this.visualization.hide();
    }

    return this.visualizationEnabled;
  }
}
