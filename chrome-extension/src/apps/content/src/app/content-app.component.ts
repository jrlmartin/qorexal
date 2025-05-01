import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventTypeEnum, PlatformEnum } from '../../../../types';

@Component({
  selector: 'app-content-root',
  template: `<p>Hello from the Content Script!</p>`,
  standalone: true,
  imports: [CommonModule]
})
export class ContentAppComponent implements OnInit {
  ngOnInit() {
    try {
      console.log("[QOREXAL COMPONENT] Content component initialized");
      
      // Notify background script that content script is ready
      try {
        chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' }, (response) => {
          console.log('[QOREXAL COMPONENT] Background acknowledged ready message:', response);
        });
        console.log("[QOREXAL COMPONENT] Ready message sent to background");
      } catch (err) {
        console.error("[QOREXAL COMPONENT] Failed to send ready message:", err);
      }
      
      // Set up listener for messages from background script
      try {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
          console.log("[QOREXAL COMPONENT] Message received:", message, "from:", sender);
          
          try {
            if (message?.type === EventTypeEnum.AICONSOLE && message.platform === PlatformEnum.CHATGPT) {
              console.log("[QOREXAL COMPONENT] Received AICONSOLE message for ChatGPT");
              alert("Qorexal says hi from chat.openai.com!");
              // Send a response back to acknowledge receipt
              sendResponse({ success: true, received: new Date().toISOString() });
            } else {
              console.log("[QOREXAL COMPONENT] Message type not recognized");
            }
          } catch (err) {
            console.error("[QOREXAL COMPONENT] Error processing message:", err);
            sendResponse({ error: true, message: err.message });
          }
          
          // Return true to indicate we'll send a response asynchronously
          return true;
        });
        console.log("[QOREXAL COMPONENT] Message listener registered");
      } catch (err) {
        console.error("[QOREXAL COMPONENT] Failed to register message listener:", err);
      }
    } catch (err) {
      console.error("[QOREXAL COMPONENT] Critical error in ngOnInit:", err);
    }
  }
}  