import { Component, OnInit, NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventTypeEnum, PlatformEnum } from "../../../../types";
import { FloatingPanelComponent } from "./floating-panel.component";

// Static flag to track if message was sent
let readyMessageSent = false;

@Component({
  selector: "app-content-root",
  template: `<app-floating-panel></app-floating-panel>`,
  standalone: true,
  imports: [CommonModule, FloatingPanelComponent],
})
export class ContentAppComponent implements OnInit {
  constructor(private zone: NgZone) {
    console.log("[QOREXAL COMPONENT] ContentAppComponent initializing");
  }

  ngOnInit() {
    console.log("[QOREXAL COMPONENT] ContentAppComponent initialized");
    
    // Wait a bit to make sure everything is settled
    setTimeout(() => {
      this.zone.run(() => {
        this.setupCommunication();
      });
    }, 500);
  }
  
  private setupCommunication() {
    // Notify background script that content script is ready (only once)
    if (!readyMessageSent) {
      try {
        readyMessageSent = true;
        console.log("[QOREXAL COMPONENT] Sending ready message to background");
        chrome.runtime.sendMessage(
          { type: "CONTENT_SCRIPT_READY" },
          (response) => {
            console.log("[QOREXAL COMPONENT] Background acknowledged ready message:", response);
          }
        );
      } catch (err) {
        readyMessageSent = false;
        console.error("[QOREXAL COMPONENT] Failed to send ready message:", err);
      }
    }

    // Set up listener for messages from background script
    try {
      // Remove any existing listeners first
      chrome.runtime.onMessage.removeListener(this.messageHandler);
      
      // Add our listener
      chrome.runtime.onMessage.addListener(this.messageHandler);
      console.log("[QOREXAL COMPONENT] Message listener registered");
    } catch (err) {
      console.error("[QOREXAL COMPONENT] Failed to register message listener:", err);
    }
  }
  
  private messageHandler = (message, sender, sendResponse) => {
    try {
      if (
        message?.type === EventTypeEnum.AICONSOLE &&
        message.platform === PlatformEnum.CHATGPT
      ) {
        console.log("[QOREXAL COMPONENT] Received AICONSOLE message for ChatGPT");
        sendResponse({
          success: true,
          received: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("[QOREXAL COMPONENT] Error processing message:", err);
      sendResponse({ error: true, message: err.message });
    }

    // Return true to indicate we'll send a response asynchronously
    return true;
  };
}
