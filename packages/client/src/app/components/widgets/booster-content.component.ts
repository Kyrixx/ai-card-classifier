import { Component, input, output, signal } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Card } from '../../models/mtg-json';
import { HistoryItem } from '../../models/history-item';
import { MatIcon } from '@angular/material/icon';
import { getCardName, getCardPrice } from '../../models/mtg-json';
import { RarityEnum } from '../../models/rarity.enum';

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
    <div class="flex flex-col min-w-full border border-gray-700 rounded-md overflow-y-auto max-h-12/12">
      <div class="flex flex-col w-full px-1">
        <div class="flex flex-grow w-full justify-around">

        </div>
        @for (item of items(); track $index) {
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
                <span
                  class="flex"
                  [class.text-black]="item.card.rarity === RarityEnum.Common"
                  [class.text-cyan-500]="item.card.rarity === RarityEnum.Uncommon"
                  [class.text-yellow-500]="item.card.rarity === RarityEnum.Rare"
                  [class.text-orange-500]="item.card.rarity === RarityEnum.Mythic"
                >{{ raritySymbols[item.card.rarity] }}&nbsp;</span>
                <span class="flex">{{ item.card.setcode | uppercase }}</span>
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
            @if (canDelete()) {
              <div class="mx-1 cursor-not-allowed hover:bg-red-100 rounded-sm" (click)="deleteItem.emit(item)">❌</div>
            }
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
  protected readonly RarityEnum = RarityEnum;
  protected readonly raritySymbols: Record<RarityEnum, string> = {
    [RarityEnum.Common]: 'C',
    [RarityEnum.Uncommon]: 'U',
    [RarityEnum.Rare]: 'R',
    [RarityEnum.Mythic]: 'M',
  }
  oldItemsCount = 0;
  items = input<HistoryItem[], HistoryItem[]>([], {
    transform: (value: HistoryItem[]): HistoryItem[] => {
      if (this.oldItemsCount !== value.length) {
        this.itemActivated.set(null);
        this.oldItemsCount = value.length;
      }
      return value;
    }
  });
  canDelete = input<boolean>(true);

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
    this.activatedItem.emit(item);
  }

  extractManaValues(input?: Card): string[] {
    if(!input){
      return [];
    }

    if(!input.manacost){
      return ['land'];
    }

    const manaValues: string[] = [];
    const regex = /\{([^\}]+)\}/g;
    const computedInput = input.manacost.split(' // ')[0];
    let match;

    while ((match = regex.exec(computedInput)) !== null) {
      manaValues.push(match[1].replace('/', '').toLowerCase());
    }

    return manaValues;
  }

  getCollectorNumber(card: Card): string {
    let collectorNumberLength = card.number.length;

    return collectorNumberLength === 1 ? `00${card.number}` : collectorNumberLength === 2 ? `0${card.number}` : card.number;
  }
}
