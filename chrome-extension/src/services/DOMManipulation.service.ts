import { Injectable } from "@angular/core";
import $ from "jquery";
import { LLMMessage } from "../types";
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

  constructor() {}

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

      // Set the prompt text
      $textarea.text(prompt);
      $textarea.trigger("input");

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
    // Find and click the submit button
    const $submitButton = $(this.SUBMIT_BUTTON_SELECTOR);
    if ($submitButton.length === 0) {
      this.handleError(
        "Submit button not found",
        DOMErrorCode.ELEMENT_NOT_FOUND,
        { selector: this.SUBMIT_BUTTON_SELECTOR }
      );
    }

    $submitButton.click();

    return true;
  }

  /**
   * Waits for and captures the response text
   */
  async captureText(): Promise<string | null> {
    try {
      for (let attempt = 0; attempt < this.MAX_POLLING_ATTEMPTS; attempt++) {
        // Wait for the polling interval
        await this.delay(this.POLLING_INTERVAL);

        // Check if there's a completed response (last message from assistant)
        const $lastMessage = $(this.ASSISTANT_MESSAGE_SELECTOR).last();

        // If we found a message and it doesn't have a loading indicator
        if (
          $lastMessage.length > 0 &&
          !$lastMessage.find(this.LOADING_INDICATOR_SELECTOR).length
        ) {
          console.log(`Response found after ${attempt + 1} attempts`);

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
      );

      if (newChatButton && "click" in newChatButton) {
        (newChatButton as HTMLElement).click();
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

      $searchButton.click();
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

      $deepResearchButton.click();
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

      await this.delay(this.getRandomDelay());

      await this.setSettings(message);
      await this.delay(2000);

      await this.injectPrompt(message.prompt);
      await this.delay(this.getRandomDelay());

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
        await this.delay(this.getRandomDelay());
        await this.injectPrompt(message.fallbackPrompt);
        await this.delay(this.getRandomDelay());

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
   * Helper method to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generates a random delay between MIN_RANDOM_DELAY and MAX_RANDOM_DELAY
   */
  private getRandomDelay(): number {
    return (
      this.MIN_RANDOM_DELAY +
      Math.random() * (this.MAX_RANDOM_DELAY - this.MIN_RANDOM_DELAY)
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
