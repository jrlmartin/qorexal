import { Injectable } from "@angular/core";
import $ from "jquery";

@Injectable({
  providedIn: "root",
})
export class DOMManipulationService {
  private readonly MAX_POLLING_ATTEMPTS = 600; // Maximum number of polling attempts
  private readonly POLLING_INTERVAL = 5000; // Polling interval in milliseconds

  constructor() {}

  /**
   * Injects a prompt into the textarea and submits it
   */
  async runPrompt(): Promise<any> {
    try {
      // Find the prompt textarea
      const $textarea = $("#prompt-textarea");
      if ($textarea.length === 0) {
        throw new Error("Prompt textarea not found");
      }

      // Set the prompt text
      $textarea.text("how did nvidia do today at the end of the day? Respond in JSON format.");
      $textarea.trigger("input");

      // Add random delay between 1-3 seconds to simulate human behavior
      const randomDelay = 1000 + Math.random() * 2000;
      await this.delay(randomDelay);

      // Find and click the submit button
      const $submitButton = $("#composer-submit-button");
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
  async captureText(): Promise<any> {
    try {
      // Wait for the response to load
      const responseContent = await this.pollForResponse();
      
      if (!responseContent) {
        throw new Error("Failed to capture response after maximum polling attempts");
      }
      
      // Try to parse as JSON if it looks like JSON
      if (responseContent.trim().startsWith('{') && responseContent.trim().endsWith('}')) {
        try {
          return JSON.parse(responseContent);
        } catch (e) {
          console.log("Response is not valid JSON, returning raw text");
          return responseContent;
        }
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
      const $lastMessage = $("[data-message-author-role='assistant']").last();
      
      // If we found a message and it doesn't have a loading indicator
      if ($lastMessage.length > 0 && !$lastMessage.find(".result-streaming").length) {
        console.log(`Response found after ${attempt + 1} attempts`);
        
        // Look for code blocks first (in case of JSON formatting)
        const jsonText = $("div.markdown code.language-json").text();
        
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
  async processData(): Promise<any> {
    return true;
    try {
      const newChatButton = document.querySelector(
        '[data-testid="create-new-chat-button"]'
      );

      if (newChatButton && 'click' in newChatButton) {
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
      console.error("Error in processData:", error);
      return false;
    }
  }

  /**
   * Run the complete workflow: prompt, capture, process
   */
  async runWorkflow(): Promise<any> {
    const promptSuccess = await this.runPrompt();
    if (!promptSuccess) {
      return { success: false, error: "Failed to submit prompt" };
    }
    
    const responseData = await this.captureText();
    if (!responseData) {
      return { success: false, error: "Failed to capture response" };
    }

    console.log(responseData);
    
    return {
      success: true,
      data: responseData
    };
  }

  /**
   * Helper method to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}