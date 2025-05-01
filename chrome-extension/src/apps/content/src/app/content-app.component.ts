import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy, NgZone, ApplicationRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventTypeEnum, PlatformEnum } from "../../../../types";
import { FloatingPanelComponent } from "./floating-panel.component";

@Component({
  selector: "app-content-root",
  template: `
    <div class="qorexal-root">
      <app-floating-panel></app-floating-panel>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FloatingPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .qorexal-root {
      position: fixed !important;
      z-index: 999999 !important;
      pointer-events: none !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
    }
    :host {
      display: block !important;
    }
  `]
})
export class ContentAppComponent implements OnInit, AfterViewInit {
  isReady = true; // Always true now since we're showing the panel all the time

  constructor(
    private cdr: ChangeDetectorRef, 
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {
    console.log("[QOREXAL COMPONENT] ContentAppComponent initializing");
  }

  ngAfterViewInit() {
    console.log("[QOREXAL COMPONENT] ContentAppComponent view initialized");
    
    // Start a recurring tick to keep Angular checking for changes
    this.setupRecurringTick();
    
    // Force initial change detection
    this.ngZone.runOutsideAngular(() => {
      // Use a timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        this.ngZone.run(() => {
          console.log("[QOREXAL COMPONENT] Forcing panel visibility in ngAfterViewInit");
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          this.appRef.tick();
        });
      }, 1000);
    });
  }

  private setupRecurringTick() {
    // Periodically trigger change detection to ensure our component stays in the DOM
    this.ngZone.runOutsideAngular(() => {
      const interval = setInterval(() => {
        this.ngZone.run(() => {
          console.log("[QOREXAL COMPONENT] Triggering periodic change detection");
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          this.appRef.tick();
        });
      }, 5000);

      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        clearInterval(interval);
      });
    });
  }

  ngOnInit() {
    try {
      // Notify background script that content script is ready
      try {
        chrome.runtime.sendMessage(
          { type: "CONTENT_SCRIPT_READY" },
          (response) => {
            console.log(
              "[QOREXAL COMPONENT] Background acknowledged ready message:",
              response
            );
            
            // Keep Angular change detection active
            this.ngZone.run(() => {
              this.cdr.markForCheck();
              this.cdr.detectChanges();
              console.log("[QOREXAL COMPONENT] Panel should be visible now");
            });
          }
        );
      } catch (err) {
        console.error("[QOREXAL COMPONENT] Failed to send ready message:", err);
        // Fallback: ensure change detection runs even if message fails
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }

      // Set up listener for messages from background script
      try {
        chrome.runtime.onMessage.addListener(
          (message, sender, sendResponse) => {
            try {
              if (
                message?.type === EventTypeEnum.AICONSOLE &&
                message.platform === PlatformEnum.CHATGPT
              ) {
                console.log(
                  "[QOREXAL COMPONENT] Received AICONSOLE message for ChatGPT"
                );
                this.ngZone.run(() => {
                  this.cdr.markForCheck();
                  this.cdr.detectChanges();
                  console.log("[QOREXAL COMPONENT] Panel visibility refreshed");
                });
                sendResponse({
                  success: true,
                  received: new Date().toISOString(),
                });
              } else {
                console.log("[QOREXAL COMPONENT] Message type not recognized");
              }
            } catch (err) {
              console.error(
                "[QOREXAL COMPONENT] Error processing message:",
                err
              );
              sendResponse({ error: true, message: err.message });
            }

            // Return true to indicate we'll send a response asynchronously
            return true;
          }
        );
        console.log("[QOREXAL COMPONENT] Message listener registered");
      } catch (err) {
        console.error(
          "[QOREXAL COMPONENT] Failed to register message listener:",
          err
        );
      }
    } catch (err) {
      console.error("[QOREXAL COMPONENT] Critical error in ngOnInit:", err);
      // Ensure change detection runs even if initialization fails
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }
}
