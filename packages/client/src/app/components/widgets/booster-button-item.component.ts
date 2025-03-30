import { Component, input, output } from '@angular/core';
import { HistoryItem } from '../../models/history-item';
import { NgIf } from '@angular/common';
import { CdkOption } from '@angular/cdk/listbox';
import { getCardPrice } from '../../models/mtg-json';

@Component({
  standalone: true,
  selector: 'app-booster-button-item',
  template: `
    <div class="flex flex-col w-full items-center">
      <div class="flex">
        Booster n°{{ boosterNumber() }}
      </div>
      <div class="flex">
        {{ items().length }} cartes - {{ getBoosterPrice(items()) }}&nbsp;€
      </div>
    </div>
  `,
  host: { 'class': 'flex flex-1 basis-1/4 border border-gray-700 rounded-md' },
  imports: [],
})
export class BoosterButtonItemComponent {
  boosterNumber = input<number>(0);
  items = input<HistoryItem[]>([]);
  isBoosterActive = input<boolean>(false);
  onItemClick = output<HistoryItem>();

  getBoosterPrice(items: HistoryItem[]): string {
    return items.reduce((acc, item) =>
      acc + getCardPrice(item.card), 0).toFixed(2);
  }
}
