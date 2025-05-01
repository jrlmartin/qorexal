import { EventTypeEnum, PlatformEnum } from "./types";

console.log('[QOREXAL BACKGROUND] Background script initialized');

// Track which tabs have content scripts ready
const tabsReady = new Set<number>();

// Listen for content script ready messages
chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('[QOREXAL BACKGROUND] Message received:', message, 'from:', sender);
  
  if (message?.type === 'CONTENT_SCRIPT_READY' && sender.tab?.id) {
    console.log('[QOREXAL BACKGROUND] Content script reported ready in tab', sender.tab.id);
    tabsReady.add(sender.tab.id);
    
    // Send a message immediately when content script reports ready
    sendMessageToContentScript(sender.tab.id, PlatformEnum.CHATGPT);
  }
  return true;
});

// Debug listener for all tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`[QOREXAL BACKGROUND] Tab ${tabId} updated:`, changeInfo);
  
  if (changeInfo.status === "complete" && tab.url) {
    console.log(`[QOREXAL BACKGROUND] Tab ${tabId} complete. URL:`, tab.url);
    
    let platform: PlatformEnum | null = null;

    // Check for matching platform
    if (tab.url.includes("chat.openai.com")) {
      platform = PlatformEnum.CHATGPT;
      console.log(`[QOREXAL BACKGROUND] Detected ChatGPT in tab ${tabId}`);
    }

    if (platform) {
      // Wait longer before trying to send messages to ensure Angular has time to bootstrap
      setTimeout(() => {
        console.log(`[QOREXAL BACKGROUND] Attempting first message to tab ${tabId}`);
        sendMessageToContentScript(tabId, platform);
        
        // Try again after another delay
        setTimeout(() => {
          console.log(`[QOREXAL BACKGROUND] Attempting second message to tab ${tabId}`);
          sendMessageToContentScript(tabId, platform);
        }, 5000);
      }, 3000);
    }
  }
});

function sendMessageToContentScript(tabId: number, platform: PlatformEnum) {
  console.log(`[QOREXAL BACKGROUND] Sending message to content script in tab ${tabId}`);
  
  try {
    chrome.tabs.sendMessage(tabId, {
      type: EventTypeEnum.AICONSOLE,
      platform,
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log(`[QOREXAL BACKGROUND] Message failed: ${chrome.runtime.lastError.message}`);
      } else if (response) {
        console.log('[QOREXAL BACKGROUND] Content script responded:', response);
      } else {
        console.log('[QOREXAL BACKGROUND] Message sent but no response received');
      }
    });
  } catch (error) {
    console.error('[QOREXAL BACKGROUND] Error sending message:', error);
  }
}
