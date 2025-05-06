import { Injectable } from "@angular/core";
import $ from "jquery";
import { LLMMessage } from "../types";
import HumanInteractionSimulator from "./stealth";

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

@Injectable({
  providedIn: "root",
})
export class DOMManipulationService {
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

  constructor() {
    // Initialize the human interaction simulator with custom settings
    this.simulator = new HumanInteractionSimulator({
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
    });
  }

  /**
   * Generate a random number between min and max
   */
  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Verifies that all required DOM elements exist in the page
   * @returns True if all elements exist
   * @throws Error if any element is missing
   */
  verifyDOMElements(): boolean {
    const selectors = {
      "Prompt textarea": this.PROMPT_TEXTAREA_SELECTOR,
      // "Submit button": this.SUBMIT_BUTTON_SELECTOR,
      // "Assistant message": this.ASSISTANT_MESSAGE_SELECTOR,
      // "JSON code block": this.JSON_CODE_BLOCK_SELECTOR,
      "New chat button": this.NEW_CHAT_BUTTON_SELECTOR,
    };

    for (const [elementName, selector] of Object.entries(selectors)) {
      const $element = $(selector);
      if ($element.length === 0) {
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

    console.log("All required DOM elements verified");
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
      await this.simulator.simulateThinking({ idleTimeout: this.randomBetween(1000, 3000) });

      // Use simulator to type the prompt with human-like patterns
      await this.simulator.typeText(textareaElement, prompt);

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
    // Find the submit button
    const $submitButton = $(this.SUBMIT_BUTTON_SELECTOR);
    if ($submitButton.length === 0) {
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
    await this.simulator.clickButton(submitButtonElement, {
      clickPattern: 'natural',
      thinkBeforeClick: true,
      turbulence: 0.4
    });

    return true;
  }

  /**
   * Waits for and captures the response text
   */
  async captureText(): Promise<string | null> {
    try {
      for (let attempt = 0; attempt < this.MAX_POLLING_ATTEMPTS; attempt++) {
        // Wait for the polling interval with slight randomization
        const randomizedInterval = this.POLLING_INTERVAL + this.randomBetween(-500, 500);
        await this.simulator.delay(randomizedInterval);

        // Check if there's a completed response (last message from assistant)
        const lastAssistantMessage = $(this.ASSISTANT_MESSAGE_SELECTOR).last();

        // If we found a message and it doesn't have a loading indicator
        if (
          lastAssistantMessage.length > 0 &&
          !lastAssistantMessage.find(this.LOADING_INDICATOR_SELECTOR).length
        ) {
          console.log(`Response found after ${attempt + 1} attempts`);

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

        console.log(`Polling for response: attempt ${attempt + 1}`);
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
        await this.simulator.simulateThinking({ idleTimeout: this.randomBetween(1000, 3000) });

        // Use simulator to click the new chat button
        await this.simulator.clickButton(newChatButton, {
          clickPattern: 'natural',
          thinkBeforeClick: true
        });

        console.log("New chat created successfully");
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
        clickPattern: 'natural',
        thinkBeforeClick: true
      });

      console.log("Search button clicked");
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
        clickPattern: 'natural',
        thinkBeforeClick: true
      });

      console.log("Deep research button clicked");
      return true;
    }
  } 

  /**
   * Run the complete workflow: prompt, capture, process
   */
  async runWorkflow(
    message: LLMMessage
  ): Promise<{ success: boolean; response: string | null }> {
    try {
      // Verify DOM elements before proceeding with workflow
      this.verifyDOMElements();
      await this.reset();

      // Use randomized delays instead of fixed delays
      await this.simulator.randomDelay();

      await this.setSettings(message);
      
      // Randomized delay between setting selection and typing prompt
      await this.simulator.randomDelay();

      await this.injectPrompt(message.prompt);
      
      // Randomized thinking time before submitting prompt
      await this.simulator.simulateThinking({ idleTimeout: this.randomBetween(1000, 3000) });

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

      let responseData = await this.captureText();

      if (responseData && message.deepResearch) {
        // Randomized thinking delay before continuing with fallback prompt
        await this.simulator.simulateThinking({ idleTimeout: this.randomBetween(3000, 7000) });
        
        await this.injectPrompt(message.fallbackPrompt);
        
        // Randomized delay before submitting the fallback prompt
        await this.simulator.simulateThinking({ idleTimeout: this.randomBetween(1000, 2000) });

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

        responseData = await this.captureText();
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
    return this.randomBetween(
      this.MIN_RANDOM_DELAY,
      this.MAX_RANDOM_DELAY
    );
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
    console.error(`ERROR [${errorCode}]: ${message}`, details || {});
    throw new Error(`[${errorCode}] ${message}`);
  }
}
