import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-floating-panel',
  template: `
    <div class="panel-wrapper">
      <div class="panel-header">
        <h3>Qorexal</h3>
      </div>
      <div class="panel-content">
        <p>This is a floating panel</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 300px;
      pointer-events: auto;
    }
    
    .panel-wrapper {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }
    
    .panel-header {
      background: #1976d2;
      color: white;
      padding: 8px 16px;
    }
    
    .panel-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: normal;
    }
    
    .panel-content {
      padding: 16px;
    }
  `]
})
export class FloatingPanelComponent implements OnInit, AfterViewInit {
  ngOnInit() {
    console.log('[QOREXAL PANEL] Floating panel initialized');
  }
  
  ngAfterViewInit() {
    console.log('[QOREXAL PANEL] Floating panel rendered');
    
    // Signal that we're fully rendered and ready to be displayed
    setTimeout(() => {
      if (window.showQorexalUI) {
        window.showQorexalUI();
      }
    }, 100);
  }
}