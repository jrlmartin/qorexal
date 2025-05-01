import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DOMManipulationService } from '../../../../../services/DOMManipulation.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  selector: 'app-floating-panel',
  templateUrl: './floating-panel.component.html',
  styleUrls: ['./floating-panel.component.scss']
})
export class FloatingPanelComponent implements OnInit, AfterViewInit {
  isRunning = false;

  constructor(private domManipulationService: DOMManipulationService) {}

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
    this.isRunning = true;
    this.domManipulationService.runWorkflow();
  }

  captureText() {
    this.domManipulationService.captureText();
  }

  processData() {
    //this.domManipulationService.processData();
  }

  toggleWorkflow() {
    if (this.isRunning) {
      this.domManipulationService.stopWorkflow();
      this.isRunning = false;
    } else {
      this.isRunning = true;
      this.domManipulationService.runWorkflow();
    }
  }
}   