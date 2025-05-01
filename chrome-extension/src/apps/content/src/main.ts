import { bootstrapApplication } from '@angular/platform-browser';
import { ContentAppComponent } from './app/content-app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

console.log('[QOREXAL CONTENT SCRIPT] Content script loaded');

// Global flag to prevent multiple initializations
let initialized = false;

function initializeContentScript() {
  // Prevent multiple initializations
  if (initialized) {
    console.log('[QOREXAL CONTENT SCRIPT] Already initialized, skipping');
    return;
  }
  
  console.log('[QOREXAL CONTENT SCRIPT] Initializing content script');
  initialized = true;
  
  // Remove any existing containers to prevent duplicates
  const existingRoot = document.getElementById('qorexal-content-root');
  if (existingRoot) {
    console.log('[QOREXAL CONTENT SCRIPT] Removing existing root');
    existingRoot.remove();
  }
  
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
  })
  .catch(err => {
    console.error('[QOREXAL CONTENT SCRIPT] Angular bootstrap error:', err);
    initialized = false; // Reset flag on error
  });
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'complete') {
  setTimeout(initializeContentScript, 100); // Small delay to ensure DOM is ready
} else {
  window.addEventListener('load', () => {
    setTimeout(initializeContentScript, 100);
  });
} 