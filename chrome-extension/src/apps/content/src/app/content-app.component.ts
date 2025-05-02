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
  template: `
    <div class="panel-wrapper">
      <div class="panel-header">
        <h3>Qorexal</h3>
      </div>
      <div class="panel-content">
        <button mat-raised-button [color]="isRunning ? 'warn' : 'primary'" (click)="toggleWorkflow()">
          {{ isRunning ? 'Stop Workflow 2' : 'Run Workflow 2' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 300px;
      pointer-events: auto;
    }

    .panel-wrapper {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      border: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .panel-header {
      background-color: #2196F3;
      color: white;
      padding: 10px;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: normal;
    }

    .panel-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .panel-content button {
      margin-bottom: 10px;
      height: 36px;
      min-width: 120px;
    }

    /* Fallback styles in case Material styles aren't loaded */
    .panel-content button:not([class*="mat-"]) {
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
    }

    .panel-content button:not([class*="mat-"]):nth-child(2) {
      background-color: #FF4081;
    }

    .panel-content button:not([class*="mat-"]):nth-child(3) {
      background-color: #F44336;
    }
  `]
})
export class ContentAppComponent implements OnInit, OnDestroy, AfterViewInit {
  private messageListener: ((message: any, sender: any, sendResponse: any) => boolean) | null = null;
  isRunning = false;

  constructor(private domManipulationService: DOMManipulationService) {
    console.log("[QOREXAL COMPONENT] ContentAppComponent constructor");
  }

  ngOnInit() {
    console.log("[QOREXAL COMPONENT] ContentAppComponent initialized");

    // Listen for events from background (triggered by NestJS)
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'NEST_EVENT') {
        console.log('[QOREXAL COMPONENT] Received NEST_EVENT from background:', msg.payload);
        this.domManipulationService.runWorkflow();
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

    // Fetch some data to test communication
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(data => {
        console.log('=================== [QOREXAL COMPONENT] Qorexal UI data:', data);
      })
      .catch(error => {
        console.error('=================== [QOREXAL COMPONENT] Error fetching Qorexal UI data:', error);
      });
  }

  ngAfterViewInit() {
    console.log('[QOREXAL COMPONENT] ContentAppComponent rendered');
    // Signal that we're fully rendered and ready to be displayed
    setTimeout(() => {
      if (window.showQorexalUI) {
        window.showQorexalUI();
      }
    }, 100);
  }

  private setupMessageListener() {
    console.log("[QOREXAL COMPONENT] Setting up message listener");
    
    // Create message handler
    this.messageListener = (message, sender, sendResponse) => {
      try {
        console.log("[QOREXAL COMPONENT] Received message:", message);
        console.log("=============");
        if (message?.type === EventTypeEnum.AICONSOLE && message.platform === PlatformEnum.CHATGPT) {
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

  toggleWorkflow() {
    if (this.isRunning) {
      this.domManipulationService.stopWorkflow();
      this.isRunning = false;
    } else {
      this.isRunning = true;
      this.domManipulationService.runWorkflow();
    }
  }

  ngOnDestroy() {
    // Clean up listeners
    if (this.messageListener) {
      chrome.runtime.onMessage.removeListener(this.messageListener);
      this.messageListener = null;
    }
  }
}