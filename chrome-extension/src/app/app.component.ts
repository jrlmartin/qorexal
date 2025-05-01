import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="content">
      <h1>Qorexal Chrome Extension</h1>
    </div>
  `,
  styles: [`
    .content {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #3f51b5;
    }
  `],
  standalone: false
})
export class AppComponent {
  title = 'Qorexal';
} 