import { EventTypeEnum, PlatformEnum } from "./types";

console.log('[QOREXAL BACKGROUND] Background script initialized');

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
