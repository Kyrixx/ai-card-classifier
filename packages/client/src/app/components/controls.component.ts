import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-controls',
  template: `
    <div class="flex w-full items-center">
      <div class="px-4 py-2 text-center flex items-center justify-center w-1/2 whitespace-nowrap">{{ title }} :</div>
      <div class="px-4 py-2 text-center w-1/2">
        <ng-content></ng-content>&nbsp;
        <button (click)="i.emit()" class="px-2 py-1 text-white bg-blue-500 rounded-md mr-2 ml-1 cursor-pointer">+</button>
        <button (click)="d.emit()" class="px-2 py-1 text-white bg-yellow-600 rounded-md cursor-pointer">-</button>
      </div>
    </div>
  `,
  styles: `
    :host {
      @apply flex flex-row justify-center;
    }
  `,
  standalone: true,
})
export class ControlsComponent {
  @Input() title: string | undefined;
  @Output() i = new EventEmitter<void>();
  @Output() d = new EventEmitter<void>();
}
