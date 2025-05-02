import { EventTypeEnum, PlatformEnum } from "./types";
import { io } from 'socket.io-client';

console.log('[QOREXAL BACKGROUND] Background script initialized');

console.log('[QOREXAL BACKGROUND] Starting socket.io connection');
const socket = io('http://localhost:3000', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('[QOREXAL BACKGROUND] socket.io connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('[QOREXAL BACKGROUND] Socket.io connection error:', error.message);
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log(`[QOREXAL BACKGROUND] Reconnection attempt ${attemptNumber}`);
});

socket.on('qorexalEvent', (data) => {
  console.log('[QOREXAL BACKGROUND] Received qorexalEvent:', data);
  
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'NEST_EVENT',
          payload: data,
        });
      }
    }
  });
});

// Listen for content script ready messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'CONTENT_SCRIPT_READY' && sender.tab?.id) {
    console.log('[QOREXAL BACKGROUND] Content script ready in tab', sender.tab.id);
    
    // Immediately respond to the content script
    sendResponse({ success: true });
    
    // Determine which platform we're on
    let platform = PlatformEnum.CHATGPT;
    if (sender.tab.url) {
      if (sender.tab.url.includes("chat.openai.com")) {
        platform = PlatformEnum.CHATGPT;
      }
      // Add other platform detection as needed
    }
    
    // Tell the content script to show the panel
    chrome.tabs.sendMessage(sender.tab.id, {
      type: EventTypeEnum.AICONSOLE,
      platform,
    });
  }
  
  return true;
});

// Monitor tab updates to inject content script when needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Check if this is a supported platform
    if (tab.url.includes("chat.openai.com")) {
      console.log(`[QOREXAL BACKGROUND] ChatGPT detected in tab ${tabId}`);
      
      // Send a message to show the panel (content script should be loaded by manifest)
      chrome.tabs.sendMessage(tabId, {
        type: EventTypeEnum.AICONSOLE,
        platform: PlatformEnum.CHATGPT,
      }, (response) => {
        // If content script responds, panel should show
        if (response) {
          console.log('[QOREXAL BACKGROUND] Panel is displayed');
        }
      });
    }
  }
});