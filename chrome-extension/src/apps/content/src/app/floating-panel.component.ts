import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule],
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
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      width: 300px;
      background-color: white;
      color: black;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      border: 2px solid #1976d2;
      padding: 16px;
      border-radius: 8px;
    }
  `]
})
export class FloatingPanelComponent {}