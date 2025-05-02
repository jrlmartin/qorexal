import { EventTypeEnum, PlatformEnum } from "./types";
import { io } from 'socket.io-client';
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

socket.on('processLLMEvent', (data) => {
  console.log('[QOREXAL BACKGROUND] Received processLLMEvent:', data);
  
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'llmExtEvent',
          payload: data,
        });
      }
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if this is ChatGPT
    if (tab.url.includes('chat.openai.com')) {
      console.log(`[QOREXAL BACKGROUND] ChatGPT detected in tab ${tabId}`);
      chrome.tabs.sendMessage(tabId, {
        type: EventTypeEnum.AICONSOLE,
        platform: PlatformEnum.CHATGPT,
      });
    }
  }
});

// Listen for messages from content script regarding workflow results
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'WORKFLOW_RESULT') {
    console.log('[QOREXAL BACKGROUND] Received WORKFLOW_RESULT:', message.payload);
    // Forward this result to the NestJS server through socket.io
    socket.emit('workflowResult', message.payload);
  }
});