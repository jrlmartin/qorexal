import { bootstrapApplication } from '@angular/platform-browser';
import { ContentAppComponent } from './app/content-app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

console.log('[QOREXAL CONTENT SCRIPT] Content script loaded');

function initializeContentScript() {
  console.log('[QOREXAL CONTENT SCRIPT] Initializing content script');
  
  // Create a container for our Angular app
  const appRoot = document.createElement('div');
  appRoot.id = 'qorexal-content-root';
  document.body.appendChild(appRoot);
  
  // Add app-content-root element inside the container
  appRoot.innerHTML = '<app-content-root></app-content-root>';
  
  // Bootstrap Angular with only ContentAppComponent
  bootstrapApplication(ContentAppComponent, {
    providers: [
      importProvidersFrom(BrowserModule)
    ]
  })
  .then(() => {
    console.log('[QOREXAL CONTENT SCRIPT] Angular app bootstrapped successfully');
    
    // Notify background that we're ready
    chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_READY" });
  })
  .catch(err => {
    console.error('[QOREXAL CONTENT SCRIPT] Angular bootstrap error:', err);
  });
}

// Initialize when document is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeContentScript();
} else {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} 