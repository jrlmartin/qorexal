import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { DOMManipulationService } from "src/services/DOMManipulation.service";
import { EventTypeEnum, PlatformEnum } from "../../../../types";

// Declare the window interfaces to avoid TypeScript errors
declare global {
  interface Window {
    qorexalReady: boolean;
    showQorexalUI: () => void;
  }
}

@Component({
  selector: "app-content-root",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./content-app.component.html",
  styleUrls: ["./content-app.component.scss"],
})
export class ContentAppComponent implements OnInit, OnDestroy, AfterViewInit {
  private messageListener:
    | ((message: any, sender: any, sendResponse: any) => boolean)
    | null = null;
  isRunning = false;
  errorMessage: string | null = null;

  constructor(private domManipulationService: DOMManipulationService) {}

  ngOnInit() {
    // Listen for events from background (triggered by NestJS)
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === "llmExtEvent") {
        console.log(
          "[QOREXAL COMPONENT] Received llmExtEvent from background:",
          msg.payload
        );

        this.domManipulationService
          .runWorkflow(msg.payload)
          .then((result) => {
            console.log("[QOREXAL COMPONENT] Result from runWorkflow:", result);
            this.errorMessage = null; // Clear any previous errors on success

            // Send final result to background script
            chrome.runtime.sendMessage({
              type: "WORKFLOW_RESULT",
              payload: result,
            });
          })
          .catch((error) => {
            console.error("[QOREXAL COMPONENT] Error in runWorkflow:", error);
            // Set error message to be displayed in the component
            this.errorMessage =
              typeof error === "string"
                ? error
                : error.message
                ? error.message
                : "Unknown error occurred";
          });
      }
      return false;
    });

    // Set up a watcher to listen for messages only after UI is visible
    const setupInterval = setInterval(() => {
      if (window.qorexalReady) {
        clearInterval(setupInterval);
        this.setupMessageListener();
      }
    }, 100);

    // Cleanup interval after a timeout to prevent leaks
    setTimeout(() => {
      clearInterval(setupInterval);
    }, 5000);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (window.showQorexalUI) {
        window.showQorexalUI();
      }
    }, 100);
  }

  private setupMessageListener() {
    // Create message handler
    this.messageListener = (message, sender, sendResponse) => {
      try {
        if (
          message?.type === EventTypeEnum.AICONSOLE &&
          message.platform === PlatformEnum.CHATGPT
        ) {
          sendResponse({ success: true });
        }
      } catch (err) {
        sendResponse({ error: true, message: err.message });
      }

      return true; // Keep channel open for async response
    };

    // Add listener
    chrome.runtime.onMessage.addListener(this.messageListener);
  }

  ngOnDestroy() {
    // Clean up listeners
    if (this.messageListener) {
      chrome.runtime.onMessage.removeListener(this.messageListener);
      this.messageListener = null;
    }
  }
}
