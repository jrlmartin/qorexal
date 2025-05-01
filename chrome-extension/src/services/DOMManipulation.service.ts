import { Injectable } from "@angular/core";
import $ from "jquery";

@Injectable({
  providedIn: "root",
})
export class DOMManipulationService {
  // Selectors
  private readonly PROMPT_TEXTAREA_SELECTOR = "#prompt-textarea";
  private readonly SUBMIT_BUTTON_SELECTOR = "#composer-submit-button";
  private readonly ASSISTANT_MESSAGE_SELECTOR = "[data-message-author-role='assistant']";
  private readonly LOADING_INDICATOR_SELECTOR = ".result-streaming";
  private readonly JSON_CODE_BLOCK_SELECTOR = "div.markdown code.language-json";
  private readonly NEW_CHAT_BUTTON_SELECTOR = "[data-testid='create-new-chat-button']";

  // Prompt text
  private readonly PROMPT_TEXT =
    "how did nvidia do today at the end of the day? Respond in JSON format.";

  // Time and polling configurations
  private readonly MAX_POLLING_ATTEMPTS = 600; // Maximum number of polling attempts
  private readonly POLLING_INTERVAL = 5000; // Polling interval in milliseconds
  private readonly MIN_RANDOM_DELAY = 1000; // 1 second
  private readonly MAX_RANDOM_DELAY = 3000; // 3 seconds
  private readonly WORKFLOW_LOOP_DELAY = 5000; // 5 seconds

  // Workflow control
  private isWorkflowRunning = false;

  constructor() {}

  /**
   * Injects a prompt into the textarea and submits it
   */
  async runPrompt(): Promise<boolean> {
    try {
      // Find the prompt textarea
      const $textarea = $(this.PROMPT_TEXTAREA_SELECTOR);
      if ($textarea.length === 0) {
        throw new Error("Prompt textarea not found");
      }

      // Set the prompt text
      $textarea.text(this.PROMPT_TEXT);
      $textarea.trigger("input");

      // Add random delay between MIN_RANDOM_DELAY and MAX_RANDOM_DELAY
      const randomDelay =
        this.MIN_RANDOM_DELAY +
        Math.random() * (this.MAX_RANDOM_DELAY - this.MIN_RANDOM_DELAY);
      await this.delay(randomDelay);

      // Find and click the submit button
      const $submitButton = $(this.SUBMIT_BUTTON_SELECTOR);
      if ($submitButton.length === 0) {
        throw new Error("Submit button not found");
      }

      $submitButton.click();

      console.log("Prompt submitted successfully");
      return true;
    } catch (error) {
      console.error("Error in runPrompt:", error);
      return false;
    }
  }

  /**
   * Waits for and captures the response text
   */
  async captureText(): Promise<string | null> {
    try {
      // Wait for the response to load
      const responseContent = await this.pollForResponse();

      if (!responseContent) {
        throw new Error(
          "Failed to capture response after maximum polling attempts"
        );
      }

      // If it looks like JSON, just return the raw text
      if (
        responseContent.trim().startsWith("{") &&
        responseContent.trim().endsWith("}")
      ) {
        return responseContent;
      }

      return responseContent;
    } catch (error) {
      console.error("Error in captureText:", error);
      return null;
    }
  }

  /**
   * Polls for response until it's available or max attempts reached
   */
  private async pollForResponse(): Promise<string | null> {
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

        // Look for code blocks first (in case of JSON formatting)
        const jsonText = $(this.JSON_CODE_BLOCK_SELECTOR).text();

        // Otherwise get the text content
        return jsonText;
      }

      console.log(`Polling for response: attempt ${attempt + 1}`);
    }

    console.error("Max polling attempts reached without finding a response");
    return null;
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
        console.log(
          "New chat button not found. It may not be loaded yet or the selector is incorrect."
        );
        return false;
      }
    } catch (error) {
      console.error("Error in reset:", error);
      return false;
    }
  }

  /**
   * Run the complete workflow: prompt, capture, process
   */
  async runWorkflow(): Promise<{ success: boolean }> {
    // Set flag to indicate workflow is running
    this.isWorkflowRunning = true;

    // Run the workflow in a loop with a delay between iterations
    while (this.isWorkflowRunning) {
      const promptSuccess = await this.runPrompt();
      if (!promptSuccess) {
        console.error("Failed to submit prompt");
        continue;
      }

      const responseData = await this.captureText();
      if (!responseData) {
        console.error("Failed to capture response");
      } else {
        // Do something with the captured response
        console.log(responseData);
      }

      await this.reset();

      // Wait before the next iteration
      await this.delay(this.WORKFLOW_LOOP_DELAY);
    }

    return { success: true };
  }

  /**
   * Stop the workflow loop
   */
  stopWorkflow(): void {
    this.isWorkflowRunning = false;
    console.log("Workflow loop stopped");
  }

  /**
   * Helper method to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
