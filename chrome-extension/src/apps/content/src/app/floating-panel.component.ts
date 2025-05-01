import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule],
  selector: 'app-floating-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="floating-panel">
      <mat-card-title>Floating Panel</mat-card-title>
      <mat-card-content>
        This is a floating panel powered by Angular Material.
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
    }
    .floating-panel {
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 999999;
      width: 300px;
      background-color: white;
      color: black;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      border: 2px solid #1976d2;
      pointer-events: auto;
    }
  `]
})
export class FloatingPanelComponent implements OnInit, AfterViewInit {
  private backupPanelElement: HTMLElement | null = null;
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit() {
    console.log('[QOREXAL COMPONENT] FloatingPanelComponent initialized');
    // Add persistent element to document body to ensure the component stays visible
    const styleElement = document.createElement('style');
    styleElement.id = 'qorexal-persistent-styles';
    styleElement.textContent = `
      #qorexal-content-root {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        pointer-events: none;
      }
      #qorexal-content-root * {
        pointer-events: auto;
      }
      #qorexal-backup-panel {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 9999999;
        width: 300px;
        background-color: white;
        color: black;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        border: 2px solid #ff0000;
        pointer-events: auto;
        padding: 16px;
        font-family: Arial, sans-serif;
      }
    `;
    if (!document.getElementById('qorexal-persistent-styles')) {
      document.head.appendChild(styleElement);
    }
    
    // Create a backup panel
    this.createBackupPanel();
    
    // Setup periodic check to ensure our component stays visible
    this.setupVisibilityCheck();
  }
  
  ngAfterViewInit() {
    console.log('[QOREXAL COMPONENT] FloatingPanelComponent view initialized');
  }
  
  private createBackupPanel() {
    // Remove any existing backup panel
    const existingPanel = document.getElementById('qorexal-backup-panel');
    if (existingPanel) {
      existingPanel.remove();
    }
    
    // Create backup panel
    const backupPanel = document.createElement('div');
    backupPanel.id = 'qorexal-backup-panel';
    backupPanel.innerHTML = `
      <h3>Floating Panel (Backup)</h3>
      <p>This is a floating panel (backup version).</p>
    `;
    
    // Don't add it immediately - we'll only show this if the Angular component disappears
    this.backupPanelElement = backupPanel;
  }
  
  private setupVisibilityCheck() {
    // Check every second if our component is still visible
    const intervalId = setInterval(() => {
      // Check if the original panel is still in the DOM and visible
      const originalPanel = this.elementRef.nativeElement.querySelector('.floating-panel');
      const isOriginalVisible = originalPanel && 
                                window.getComputedStyle(originalPanel).display !== 'none' &&
                                document.body.contains(originalPanel);
                                
      console.log('[QOREXAL COMPONENT] Panel visibility check - original visible:', isOriginalVisible);
      
      // If original is not visible, show the backup
      if (!isOriginalVisible && this.backupPanelElement && !document.getElementById('qorexal-backup-panel')) {
        console.log('[QOREXAL COMPONENT] Original panel not visible, showing backup');
        document.body.appendChild(this.backupPanelElement);
      }
    }, 2000);
    
    // Cleanup the interval when the component is destroyed
    window.addEventListener('beforeunload', () => {
      clearInterval(intervalId);
    });
  }
}