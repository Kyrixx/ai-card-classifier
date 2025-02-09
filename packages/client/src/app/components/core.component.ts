import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-core',
  imports: [
    RouterOutlet,
  ],
  standalone: true,
  template: `
    <div class="bg-green-100 min-w-[1920px] min-h-[1080px] max-w-[1920px] max-h-[1080px]">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class CoreComponent {

}
