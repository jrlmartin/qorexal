import { bootstrapApplication } from '@angular/platform-browser';
import { ContentAppComponent } from './app/content-app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Add this line at the VERY beginning to ensure it's logged
console.log('[QOREXAL CONTENT SCRIPT] Initial script execution - file loaded');

// Use this function to initialize everything
function initializeContentScript() {
  console.log('[QOREXAL CONTENT SCRIPT] Initializing content script');
  
  try {
    // Create a container for our Angular app
    const appRoot = document.createElement('div');
    appRoot.id = 'qorexal-content-root';
    document.body.appendChild(appRoot);
    console.log('[QOREXAL CONTENT SCRIPT] Container created and added to body');
    
    // Add app-content-root element inside the container
    appRoot.innerHTML = '<app-content-root></app-content-root>';
    
    // Bootstrap Angular with standalone component
    bootstrapApplication(ContentAppComponent, {
      providers: [
        importProvidersFrom(BrowserModule, BrowserAnimationsModule)
      ]
    })
    .then(ref => {
      console.log('[QOREXAL CONTENT SCRIPT] Angular app bootstrapped successfully');
    })
    .catch(err => {
      console.error('[QOREXAL CONTENT SCRIPT] Angular bootstrap error:', err);
    });
  } catch (error) {
    console.error('[QOREXAL CONTENT SCRIPT] Error during setup:', error);
  }
}

// Start initialization process
try {
  // Check if document is already ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log(`[QOREXAL CONTENT SCRIPT] Document already ${document.readyState}, initializing now`);
    initializeContentScript();
  } else {
    // Wait for DOM to be fully loaded before bootstrapping Angular
    console.log('[QOREXAL CONTENT SCRIPT] Document not ready, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[QOREXAL CONTENT SCRIPT] DOM fully loaded - initializing');
      initializeContentScript();
    });
  }
} catch (error) {
  console.error('[QOREXAL CONTENT SCRIPT] Fatal error in content script:', error);
} 