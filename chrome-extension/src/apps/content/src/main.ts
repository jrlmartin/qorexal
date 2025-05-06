import { bootstrapApplication } from '@angular/platform-browser';
import { ContentAppComponent } from './app/content-app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
 
// Add type declarations for global variables
declare global {
  interface Window {
    qorexalReady: boolean;
    showQorexalUI: () => void;
    qorexalDebug: boolean;
  }
}

// Global variable to track initialization state
let isInitialized = false;

// Create a global variable for UI initialization
window.qorexalReady = false;
window.qorexalDebug = false; // Debug flag - set to true to enable logging

/**
 * Utility function for logging that only outputs when debug flag is enabled
 */
function qorexalLog(...args: any[]): void {
  if (window.qorexalDebug) {
    console.log('[QOREXAL CONTENT SCRIPT]', ...args);
  }
}

function initContentScript() {
  // Only initialize once
  if (isInitialized) {
    qorexalLog('Already initialized');
    return;
  }
  
  qorexalLog('Beginning initialization');
  
  // Create container (initially hidden)
  const container = document.createElement('div');
  container.id = 'qorexal-root';
  container.style.cssText = `
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 100px;
    z-index: 2147483647;
    opacity: 0;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    transition: opacity 0.3s ease-in-out;
  `;
  document.body.appendChild(container);
  
  // Create the Angular component placeholder
  const angularRoot = document.createElement('app-content-root');
  container.appendChild(angularRoot);
  
  // Bootstrap Angular
  bootstrapApplication(ContentAppComponent, {
    providers: [
      importProvidersFrom(BrowserModule)
    ]
  })
  .then(() => {
    qorexalLog('Angular bootstrapped successfully');
    
    // Add a global method that components can call when they're fully rendered
    window.showQorexalUI = function() {
      if (window.qorexalReady) return; // Only do this once
      
      qorexalLog('UI now visible');
      window.qorexalReady = true;
      
      // Show the UI with a fade-in effect
      container.style.visibility = 'visible';
      
      // Use a separate timeout for opacity to create a smooth transition
      setTimeout(() => {
        container.style.opacity = '1';
      }, 50);
      
      // Notify background that we're ready (after UI is visible)
      setTimeout(() => {
        try {
          chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_READY" });
          qorexalLog('Sent ready message to background');
        } catch (err) {
          console.error('[QOREXAL CONTENT SCRIPT] Failed to send ready message:', err);
        }
      }, 200);
    };
    
    // Set a fallback timer in case the component doesn't call showQorexalUI
    setTimeout(() => {
      if (!window.qorexalReady) {
        qorexalLog('Using fallback timer to show UI');
        window.showQorexalUI();
      }
    }, 500);
    
    isInitialized = true;
  })
  .catch(err => {
    console.error('[QOREXAL CONTENT SCRIPT] Angular bootstrap error:', err);
    // Clean up on error
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });
}

// Wait for DOM to be fully loaded
if (document.readyState === 'complete') {
  // Wait briefly to ensure page is settled
  setTimeout(initContentScript, 300);
} else {
  window.addEventListener('load', () => {
    setTimeout(initContentScript, 300);
  });
} 