import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventTypeEnum, PlatformEnum } from "../../../../types";
import { FloatingPanelComponent } from "./floating-panel/floating-panel.component";

// Declare the window interfaces to avoid TypeScript errors
declare global {
  interface Window {
    qorexalReady: boolean;
    showQorexalUI: () => void;
  }
}

@Component({
  selector: "app-content-root",
  template: `<app-floating-panel></app-floating-panel>`,
  standalone: true,
  imports: [CommonModule, FloatingPanelComponent],
})
export class ContentAppComponent implements OnInit, OnDestroy {
  private messageListener: ((message: any, sender: any, sendResponse: any) => boolean) | null = null;
  
  constructor() {
    console.log("[QOREXAL COMPONENT] ContentAppComponent constructor");
  }

  ngOnInit() {
    console.log("[QOREXAL COMPONENT] ContentAppComponent initialized");
    
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
  
  private setupMessageListener() {
    console.log("[QOREXAL COMPONENT] Setting up message listener");
    
    // Create message handler
    this.messageListener = (message, sender, sendResponse) => {
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
