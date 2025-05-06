/**
 * Adds visualization capability to the HumanInteractionSimulator
 * This extension creates a visual overlay to show simulated mouse movements
 */

interface Point {
  x: number;
  y: number;
}

interface VisualizationOptions {
    cursorSize: number;       // Size of the cursor in pixels
    trailLength: number;      // Number of positions to keep in trail
    trailColor: string;       // Color of the movement trail
    cursorColor: string;      // Color of the cursor
    showTrail: boolean;       // Whether to show movement trail
    showSpeed: boolean;       // Whether to show speed indicator
    fadeTrail: boolean;       // Whether trail points should fade out
    trailThickness: number;   // Thickness of trail line in pixels
  }
  
  
  export class HumanInteractionVisualization {
    private simulator: any;
    private overlay: HTMLDivElement;
    private cursor: HTMLDivElement;
    private trail: Point[] = [];
    public options: VisualizationOptions;
    public speedIndicator: HTMLDivElement | null = null;
    private trailElements: HTMLDivElement[] = [];
    
    constructor(simulator: any, options: Partial<VisualizationOptions> = {}) {
      this.simulator = simulator;
      
      // Default options
      this.options = {
        cursorSize: 20,
        trailLength: 50,
        trailColor: 'rgba(255, 0, 0, 0.5)',
        cursorColor: 'rgba(255, 0, 0, 0.7)',
        showTrail: true,
        showSpeed: true,
        fadeTrail: true,
        trailThickness: 3,
        ...options
      };
      
      // Create overlay
      this.overlay = document.createElement('div');
      this.overlay.style.position = 'fixed';
      this.overlay.style.top = '0';
      this.overlay.style.left = '0';
      this.overlay.style.width = '100%';
      this.overlay.style.height = '100%';
      this.overlay.style.pointerEvents = 'none'; // Don't interfere with page interaction
      this.overlay.style.zIndex = '9999';
      
      // Create cursor element
      this.cursor = document.createElement('div');
      this.cursor.style.position = 'absolute';
      this.cursor.style.width = `${this.options.cursorSize}px`;
      this.cursor.style.height = `${this.options.cursorSize}px`;
      this.cursor.style.borderRadius = '50%';
      this.cursor.style.backgroundColor = this.options.cursorColor;
      this.cursor.style.transform = 'translate(-50%, -50%)';
      this.cursor.style.transition = 'background-color 0.2s';
      
      // Add cursor to overlay
      this.overlay.appendChild(this.cursor);
      
      // Create speed indicator if enabled
      if (this.options.showSpeed) {
        this.speedIndicator = document.createElement('div');
        this.speedIndicator.style.position = 'absolute';
        this.speedIndicator.style.top = '10px';
        this.speedIndicator.style.right = '10px';
        this.speedIndicator.style.padding = '5px 10px';
        this.speedIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.speedIndicator.style.color = 'white';
        this.speedIndicator.style.fontFamily = 'Arial, sans-serif';
        this.speedIndicator.style.fontSize = '14px';
        this.speedIndicator.style.borderRadius = '3px';
        this.overlay.appendChild(this.speedIndicator);
      }
      
      // Add overlay to document
      document.body.appendChild(this.overlay);
      
      // Extend the original moveMouseTo method to visualize movements
      this.extendMoveMouseTo();
      
      // Extend the click method to visualize clicks
      this.extendClick();
    }
    
    // Override the simulator's moveMouseTo method to visualize mouse movements
    private extendMoveMouseTo(): void {
      const originalMoveMouseTo = this.simulator.moveMouseTo;
      
      this.simulator.moveMouseTo = async (
        target: Point | HTMLElement, 
        options: Partial<any> = {}
      ) => {
        // Store the original lastPosition update functionality
        const originalLastPositionSetter = Object.getOwnPropertyDescriptor(
          this.simulator.state.mouseState, 
          'lastPosition'
        );
        
        // Override the lastPosition setter to update visualization
        Object.defineProperty(this.simulator.state.mouseState, 'lastPosition', {
          get: function() { 
            return this._lastPosition || { x: 0, y: 0 }; 
          },
          set: (newPos: Point) => {
            // Update the internal value
            this.simulator.state.mouseState._lastPosition = newPos;
            
            // Update visualization
            this.updateCursorPosition(newPos);
            
            // Update trail
            if (this.options.showTrail) {
              this.addTrailPoint(newPos);
            }
          }
        });
        
        // Call the original method
        await originalMoveMouseTo.call(this.simulator, target, options);
        
        // Restore original property descriptor if it existed
        if (originalLastPositionSetter) {
          Object.defineProperty(
            this.simulator.state.mouseState, 
            'lastPosition', 
            originalLastPositionSetter
          );
        }
      };
    }
    
    // Extend the click method to visualize clicks
    private extendClick(): void {
      const originalClick = this.simulator.click;
      
      this.simulator.click = async (
        element: HTMLElement | null = null, 
        options: any = {}
      ) => {
        // Show click animation
        this.showClickEffect();
        
        // Call the original method
        return originalClick.call(this.simulator, element, options);
      };
    }
    
    // Update cursor position in the visualization
    private updateCursorPosition(position: Point): void {
      this.cursor.style.left = `${position.x}px`;
      this.cursor.style.top = `${position.y}px`;
      
      // Update speed indicator if enabled
      if (this.options.showSpeed && this.speedIndicator) {
        const speed = this.calculateCurrentSpeed();
        this.speedIndicator.textContent = `Speed: ${speed.toFixed(1)} px/s`;
      }
    }
    
    // Calculate current mouse movement speed
    private calculateCurrentSpeed(): number {
      if (this.trail.length < 2) return 0;
      
      const lastPoint = this.trail[this.trail.length - 1];
      const prevPoint = this.trail[this.trail.length - 2];
      
      // Simple distance calculation
      const distance = Math.sqrt(
        Math.pow(lastPoint.x - prevPoint.x, 2) + 
        Math.pow(lastPoint.y - prevPoint.y, 2)
      );
      
      // Assuming movement happens at around 60fps for visualization
      return distance * 60;
    }
    
    // Show click effect animation
    private showClickEffect(): void {
      // Change cursor color temporarily
      const originalColor = this.cursor.style.backgroundColor;
      this.cursor.style.backgroundColor = 'rgba(0, 255, 0, 0.9)';
      
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.left = this.cursor.style.left;
      ripple.style.top = this.cursor.style.top;
      ripple.style.width = `${this.options.cursorSize}px`;
      ripple.style.height = `${this.options.cursorSize}px`;
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'transparent';
      ripple.style.border = '2px solid rgba(0, 255, 0, 0.9)';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.animation = 'ripple 0.5s ease-out forwards';
      
      // Add ripple animation style if not already present
      if (!document.getElementById('ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
          @keyframes ripple {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2.5);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      this.overlay.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
        this.cursor.style.backgroundColor = originalColor;
      }, 500);
    }
    
    // Add a point to the movement trail
    private addTrailPoint(position: Point): void {
      // Add to trail array
      this.trail.push({ ...position });
      
      // Limit trail length
      if (this.trail.length > this.options.trailLength) {
        this.trail.shift();
      }
      
      // Create visual trail element
      const trailPoint = document.createElement('div');
      trailPoint.style.position = 'absolute';
      trailPoint.style.left = `${position.x}px`;
      trailPoint.style.top = `${position.y}px`;
      trailPoint.style.width = `${this.options.trailThickness}px`;
      trailPoint.style.height = `${this.options.trailThickness}px`;
      trailPoint.style.borderRadius = '50%';
      trailPoint.style.backgroundColor = this.options.trailColor;
      trailPoint.style.transform = 'translate(-50%, -50%)';
      
      this.overlay.appendChild(trailPoint);
      this.trailElements.push(trailPoint);
      
      // Manage trail element lifecycle
      if (this.options.fadeTrail) {
        // Add fade out effect
        setTimeout(() => {
          trailPoint.style.opacity = '0';
          trailPoint.style.transition = 'opacity 0.5s ease-out';
        }, 100);
      }
      
      // Remove excess trail elements
      if (this.trailElements.length > this.options.trailLength) {
        const removedElement = this.trailElements.shift();
        if (removedElement) {
          removedElement.remove();
        }
      }
      
      // Connect trail segments with lines
      if (this.trail.length >= 2) {
        this.drawTrailLine(
          this.trail[this.trail.length - 2],
          this.trail[this.trail.length - 1]
        );
      }
    }
    
    // Draw a line segment between two trail points
    private drawTrailLine(point1: Point, point2: Point): void {
      // Calculate line length and angle
      const dx = point2.x - point1.x;
      const dy = point2.y - point1.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      // Create line element
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.left = `${point1.x}px`;
      line.style.top = `${point1.y}px`;
      line.style.width = `${length}px`;
      line.style.height = `${this.options.trailThickness}px`;
      line.style.backgroundColor = this.options.trailColor;
      line.style.transformOrigin = '0 50%';
      line.style.transform = `rotate(${angle}deg)`;
      
      this.overlay.appendChild(line);
      this.trailElements.push(line);
      
      // Apply fade out effect if enabled
      if (this.options.fadeTrail) {
        setTimeout(() => {
          line.style.opacity = '0';
          line.style.transition = 'opacity 0.8s ease-out';
        }, 100);
      }
    }
    
    // Clear all trail elements
    public clearTrail(): void {
      this.trailElements.forEach(element => element.remove());
      this.trailElements = [];
      this.trail = [];
    }
    
    // Remove the visualization
    public remove(): void {
      this.overlay.remove();
      
      // Restore original methods
      if (this.simulator._originalMoveMouseTo) {
        this.simulator.moveMouseTo = this.simulator._originalMoveMouseTo;
      }
      
      if (this.simulator._originalClick) {
        this.simulator.click = this.simulator._originalClick;
      }
    }
  }