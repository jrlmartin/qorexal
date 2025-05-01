import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  selector: 'app-floating-panel',
  templateUrl: './floating-panel.component.html',
  styleUrls: ['./floating-panel.component.scss']
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

  injectText() {
    console.log('[QOREXAL PANEL] Injecting text');
    // Implement text injection logic here
  }

  captureText() {
    console.log('[QOREXAL PANEL] Capturing text');
    // Implement text capture logic here
  }

  processData() {
    console.log('[QOREXAL PANEL] Processing data');
    // Implement data processing logic here
  }
}  