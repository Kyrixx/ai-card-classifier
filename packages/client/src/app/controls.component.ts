import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-controls',
  template: `
    <button (click)="i.emit()" class="px-2 py-1 text-white bg-blue-500 rounded-md mr-2 ml-1 cursor-pointer">+</button>
    <button (click)="d.emit()" class="px-2 py-1 text-white bg-yellow-600 rounded-md cursor-pointer">-</button>
  `,
  standalone: true,
})
export class ControlsComponent {
  @Output() i = new EventEmitter<void>();
  @Output() d = new EventEmitter<void>();
}
