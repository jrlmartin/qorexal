import { EventTypeEnum, PlatformEnum } from "./types";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    let platform: PlatformEnum | null = null;

    // Check for LinkedIn
    if (tab.url.includes("chatgpt.com")) {
      platform = PlatformEnum.CHATGPT;
    }

    if (platform) {
      chrome.tabs.sendMessage(tabId, {
        type: EventTypeEnum.AICONSOLE,
        platform,
      });
    }
  }
});
