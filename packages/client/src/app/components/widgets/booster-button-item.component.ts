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
        [{{ boosterNumber() }}] {{ items().length }} cartes - {{ getBoosterPrice(items()) }}&nbsp;€
      </div>
    </div>
  `,
  host: {
    'class': 'flex flex-1 rounded-md p-1',
    '[class.bg-green-500]': 'this.getBoosterPrice(items()) > priceThreshold() && !isBoosterActive()',
    '[class.bg-orange-500]': 'this.getBoosterPrice(items()) > priceThreshold()*0.8 && this.getBoosterPrice(items()) < priceThreshold() && !isBoosterActive()',
    '[class.border-1]': 'isBoosterActive()',
  },
  imports: [],
})
export class BoosterButtonItemComponent {
  priceThreshold = input<number>(5.5);
  boosterNumber = input<number>(0);
  items = input<HistoryItem[]>([]);
  isBoosterActive = input<boolean>(false);
  onItemClick = output<HistoryItem>();

  getBoosterPrice(items: HistoryItem[]): string {
    return items.reduce((acc, item) =>
      acc + getCardPrice(item.card), 0).toFixed(2);
  }
}
