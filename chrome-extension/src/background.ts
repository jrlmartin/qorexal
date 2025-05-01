chrome.runtime.onInstalled.addListener(() => {
  console.log('Minimal Angular extension installed!');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});