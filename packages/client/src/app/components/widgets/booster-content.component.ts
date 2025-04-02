import { Component, input, output, signal } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Card } from '../../models/scryfall';
import { HistoryItem } from '../../models/history-item';
import { MatIcon } from '@angular/material/icon';
import { getCardName, getCardPrice } from '../../models/mtg-json';

@Component({
  selector: 'booster-content',
  imports: [
    CdkAccordionModule,
    NgIf,
    NgClass,
    UpperCasePipe,
    MatIcon,
  ],
  standalone: true,
  template: `
    <div class="flex flex-col min-w-full border border-gray-700 rounded-md">
      <button
        class="flex flex-col justify-start w-full px-2"
      >
        <div class="flex w-full">
          <div class="flex w-full justify-around">
            <div class="flex justify-start flex-grow">
              <p class="mx-3">Booster n°{{ boosterNumber() }} - {{ items().length }} cartes</p>
            </div>
            <div class="flex flex-grow justify-end">
              {{ getBoosterPrice(items()) }}&nbsp;€
            </div>
          </div>
        </div>
      </button>

      <div class="flex flex-col w-full px-1">
        @for (item of items(); track item.date) {
          <div class="flex flex-grow w-full justify-around">
            <div
              class="flex flex-grow justify-around cursor-pointer"
              (click)="onItemClick(item)"
              [class.bg-purple-500]="isSelected(item)"
            >
              <div class="flex justify-start flex-grow">
                @for (mana of extractManaValues(item.card); track $index) {
                  <span
                    class="ms ms-cost ms-shadow"
                    [ngClass]="'ms-' + mana.toLowerCase()"
                  ></span>
                }
                <span
                  class="mx-1"
                  [class.italic]="item.isDoublon"
                >{{ getCardName(item.card) }}</span>
                <mat-icon *ngIf="item.isDoublon" class="small-icon">content_copy</mat-icon>
              </div>
              <div class="flex justify-end info">
                <span class="flex">{{ item.card.setCode | uppercase }}</span>
                <span class="mx-1">{{ getCollectorNumber(item.card) }}</span>
                <span
                  class="mx-1"
                  [class.text-red-500]="getCardPrice(item.card) >= 10"
                  [class.font-bold]="getCardPrice(item.card) >= 10"
                  [class.underline]="getCardPrice(item.card) >= 10"
                  [class.text-blue-500]="getCardPrice(item.card) >= 5"
                  [class.text-green-500]="getCardPrice(item.card) >= 1"
                >{{ getCardPrice(item.card).toFixed(2) }}€</span>
              </div>
            </div>
            <div class="mx-1 cursor-not-allowed" (click)="deleteItem.emit(item)">❌</div>
          </div>
        }
        <div class="flex justify-center" *ngIf="items().length === 0">Vide</div>

      </div>


    </div>
  `,
  styles: `
    .selected {
      background-color: red;
    }

    .small-icon.material-icons {
      font-size: 12px !important; /* Adjust the size as needed */
    }

    .small-icon {
      .mat-icon {
        width: 12px;
        height: 12px;
      }
    }
  `,
})
export class BoosterContentComponent {
  protected readonly getCardName = getCardName;
  protected readonly getCardPrice = getCardPrice;
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
  activatedItem = output<HistoryItem>();
  deleteItem = output<HistoryItem>();

  protected itemActivated = signal<HistoryItem | null>(
    this.items().sort((a: HistoryItem, b: HistoryItem) => b.date - a.date)[0],
  );

  constructor() {}

  isSelected(item: HistoryItem) {
    return this.itemActivated()?.date === item.date;
  }

  onItemClick(item: HistoryItem) {
    this.itemActivated.set(item);
    console.log('item activated', item);
    this.activatedItem.emit(item);
  }

  extractManaValues(input?: Card): string[] {
    if(!input){
      return [];
    }

    if(!input.manaCost){
      return ['land'];
    }

    const manaValues: string[] = [];
    const regex = /\{([^\}]+)\}/g;
    const computedInput = input.manaCost.split(' // ')[0];
    let match;

    while ((match = regex.exec(computedInput)) !== null) {
      manaValues.push(match[1]);
    }

    return manaValues;
  }

  getCollectorNumber(card: Card): string {
    let collectorNumberLength = card.number.length;

    return collectorNumberLength === 1 ? `00${card.number}` : collectorNumberLength === 2 ? `0${card.number}` : card.number;
  }

  getBoosterPrice(items: HistoryItem[]): string {
    return items.reduce((acc, item) => {
      return acc + getCardPrice(item.card);
    }, 0).toFixed(2);
  }
}
