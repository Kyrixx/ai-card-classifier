import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-core',
  imports: [
    RouterOutlet,
  ],
  standalone: true,
  template: `
    <div class="bg-gray-600 text-white">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class CoreComponent {

}
