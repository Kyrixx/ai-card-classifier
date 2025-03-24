import { Component, input, output, signal } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Card } from '../models/scryfall';
import { HistoryItem } from '../models/history-item';

@Component({
  selector: 'booster-accordion-item',
  imports: [
    CdkAccordionModule,
    NgIf,
    NgClass,
    UpperCasePipe,
  ],
  standalone: true,
  template: `
    <cdk-accordion-item #accordionItem="cdkAccordionItem"
                        class="flex flex-col min-w-full border border-gray-700 rounded-md"
                        expanded="true">
      <button
        (click)="accordionItem.toggle()"
        class="flex flex-col justify-start w-full px-2"
      >
        <div class="flex w-full">
          <div class="flex w-full justify-around">
            <div class="flex justify-start flex-grow">
              <span *ngIf="isBoosterActive()">✅</span>
              <p class="mx-3">Booster n°{{ boosterNumber() }} - {{ items().length }} cartes</p>
            </div>
            <div class="flex flex-grow justify-end">
              {{ getBoosterPrice(items()) }}&nbsp;€
            </div>
          </div>
        </div>
      </button>

      @if (accordionItem.expanded) {
        <div class="flex flex-col w-full px-1">
          @for (item of items(); track item.date) {
            <div class="flex flex-grow w-full justify-around">
              <div
                class="flex flex-grow justify-around cursor-pointer"
                (click)="onItemClick(item)"
                [class.selected]="isSelected(item)"
              >
                <div class="flex justify-start flex-grow">
                  @for (mana of extractManaValues(item.card.mana_cost); track $index) {
                    <span
                      class="ms ms-cost ms-shadow"
                      [ngClass]="'ms-' + mana.toLowerCase()"
                    ></span>
                  }
                  <span class="mx-1">{{ getCardName(item.card) }}</span>
                </div>
                <div class="flex justify-end flex-grow">
                  <span>{{ item.card.set | uppercase }}</span>
                  <span class="mx-1">{{ item.card.collector_number }}</span>
                  <span class="mx-1">{{ getCardPrice(item.card) }}</span>
                </div>
              </div>
              <div class="mx-1 cursor-not-allowed" (click)="deleteItem.emit(item)">❌</div>
            </div>
          }
          <div class="flex justify-center" *ngIf="items().length === 0">Vide</div>

        </div>

      }
    </cdk-accordion-item>
  `,
  styles: `
    .selected {
      background-color: red;
    }
  `,
})
export class BoosterAccordionComponent {
  oldItemsCount = 0;
  items = input<HistoryItem[], HistoryItem[]>([], {
    transform: (value: HistoryItem[]): HistoryItem[] => {
      if (this.oldItemsCount !== value.length) {
        this.itemActivated.set(null);
        this.oldItemsCount = value.length;
      }
      return value.sort((a, b) => a.date - b.date)
    }
  });

  boosterNumber = input(1);
  isBoosterActive = input(true);
  activatedItem = output<HistoryItem>();
  deleteItem = output<HistoryItem>();

  protected itemActivated = signal<HistoryItem | null>(
    this.items().sort((a: HistoryItem, b: HistoryItem) => b.date - a.date)[0],
  );

  constructor() {

  }

  isSelected(item: HistoryItem) {
    return this.itemActivated()?.date === item.date;
  }

  onItemClick(item: HistoryItem) {
    console.log('item clicked', item);
    this.itemActivated.set(item);
    this.activatedItem.emit(item);
  }

  extractManaValues(input: string): string[] {
    const manaValues: string[] = [];
    const regex = /\{([^\}]+)\}/g;
    const computedInput = input.split(' // ')[0];
    let match;

    while ((match = regex.exec(computedInput)) !== null) {
      manaValues.push(match[1]);
    }

    return manaValues;
  }

  getCardName(card: Card): string {
    return card.printed_name?.length > 0 ? card.printed_name : card.name;
  }

  getCardPrice(card: Card): string {
    if(card.prices.eur?.length > 0) {
      return `${card.prices.eur}€`;
    }

    if(card.prices.usd?.length > 0) {
      return `${card.prices.eur}$`;
    }
    return 'N/A';
  }

  getBoosterPrice(items: HistoryItem[]): string {
    return items.reduce((acc, item) => {
      let cardPrice = 0.0;
      if(item.card.prices.eur?.length > 0) {
        cardPrice = parseFloat(item.card.prices.eur);
      } else if(item.card.prices.usd?.length > 0) {
        cardPrice = parseFloat(item.card.prices.usd);
      }
      return acc + cardPrice;
    }, 0).toFixed(2);
  }
}
