import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventTypeEnum, PlatformEnum } from "../../../../types";
import { FloatingPanelComponent } from "./floating-panel.component";

@Component({
  selector: "app-content-root",
  template: `<app-floating-panel></app-floating-panel>`,
  standalone: true,
  imports: [CommonModule, FloatingPanelComponent],
})
export class ContentAppComponent implements OnInit {
  constructor() {
    console.log("[QOREXAL COMPONENT] ContentAppComponent constructor");
  }

  ngOnInit() {
    console.log("[QOREXAL COMPONENT] ContentAppComponent initialized");
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(this.handleBackgroundMessages);
  }
  
  private handleBackgroundMessages = (message, sender, sendResponse) => {
    try {
      console.log("[QOREXAL COMPONENT] Received message:", message);
      
      if (message?.type === EventTypeEnum.AICONSOLE && 
          message.platform === PlatformEnum.CHATGPT) {
        console.log("[QOREXAL COMPONENT] Received AICONSOLE message for ChatGPT");
        sendResponse({ success: true });
      }
    } catch (err) {
      console.error("[QOREXAL COMPONENT] Error handling message:", err);
      sendResponse({ error: true, message: err.message });
    }
    
    return true; // Keep channel open for async response
  };
  
  ngOnDestroy() {
    // Clean up listeners
    chrome.runtime.onMessage.removeListener(this.handleBackgroundMessages);
  }
}
