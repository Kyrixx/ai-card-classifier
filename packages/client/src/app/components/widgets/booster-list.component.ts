import { Component, input, output } from '@angular/core';
import { BoosterContentComponent } from './booster-content.component';
import { HistoryItem } from '../../models/history-item';
import { CdkListbox, CdkOption } from '@angular/cdk/listbox';
import { BoosterButtonItemComponent } from './booster-button-item.component';

@Component({
  standalone: true,
  selector: 'app-booster-list',
  template: `
    <div class="flex flex-col w-full max-h-[795px]">
      <ul
        cdkListbox
        cdkListboxOrientation="horizontal"
        class="flex justify-start w-full flex-wrap"
      >
        @for (bid of uniqueBoosterIds(); track $index) {
          <li
            [cdkOption]="bid"
            class="
            booster-item
            flex
            grow-0
            basis-1/4
            rounded-md
            cursor-pointer
            m-2
"
            [class.bg-blue-500]="bid === boosterId()"
            (click)="onBoosterClick.emit(bid)"
          >
            <app-booster-button-item
              [boosterNumber]="bid"
              [items]="getCardForBooster(bid)"
              [isBoosterActive]="bid === boosterId()"
            ></app-booster-button-item>
          </li>
        }
      </ul>

      <booster-content
        class="mt-5"
        [items]="getCardForBooster(boosterId())"
        [boosterNumber]="boosterId()"
        (activatedItem)="onCardClick.emit($event)"
        (deleteItem)="deleteItem.emit($event)"
      ></booster-content>
    </div>
  `,
  host: {'class': 'flex flex-col flex-1 max-h-full items-center mx-2'},
  imports: [
    CdkListbox,
    CdkOption,
    BoosterButtonItemComponent,
    BoosterContentComponent,
  ],
  styles: `

  `,
})
export class BoosterListComponent {
  history = input<HistoryItem[]>([]);
  boosterId = input(1);
  onCardClick = output<HistoryItem>();
  onBoosterClick = output<number>();
  deleteItem = output<HistoryItem>();

  getCardForBooster(boosterId: number): HistoryItem[] {
    return this.history().filter(h => h.boosterId === boosterId);
  }

  uniqueBoosterIds(): number[] {
    const boosterIdsFromHistory = Array.from(new Set(this.history().map((h) => h.boosterId)));
    if (this.boosterId() > boosterIdsFromHistory.length) {
      boosterIdsFromHistory.push(this.boosterId());
    }
    return [...new Set(boosterIdsFromHistory)];
  }
}
