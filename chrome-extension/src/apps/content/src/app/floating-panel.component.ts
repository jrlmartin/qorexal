import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-floating-panel',
  template: `
    <div class="floating-panel">
      <h3>Floating Panel</h3>
      <p>This is a floating panel.</p>
    </div>
  `,
  styles: [`
    .floating-panel {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999999;
      width: 300px;
      background-color: white;
      color: black;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      border: 2px solid #1976d2;
      padding: 16px;
      border-radius: 8px;
      transform: translateZ(0);
      will-change: transform;
    }
  `]
})
export class FloatingPanelComponent implements OnInit {
  ngOnInit() {
    console.log('[QOREXAL FLOATING PANEL] Panel initialized');
  }
}