import { Component, input, output } from '@angular/core';
import { BoosterAccordionComponent } from './booster-accordion.component';
import { CdkAccordion } from '@angular/cdk/accordion';
import { HistoryItem } from '../models/history-item';

@Component({
  standalone: true,
  selector: 'app-booster-list',
  template: `
    <cdk-accordion class="w-full">
      @for (bid of uniqueBoosterIds(); track bid) {
        <booster-accordion-item
          [boosterNumber]="bid"
          [items]="getCardForBooster(bid)"
          [isBoosterActive]="bid === boosterId()"
          (activatedItem)="onItemClick.emit($event)"
          (deleteItem)="deleteItem.emit($event)"
        ></booster-accordion-item>
      }
    </cdk-accordion>
  `,
  styles: `
  :host {
    @apply flex flex-col flex-1 max-h-full items-center;
  }
  `,
  imports: [
    BoosterAccordionComponent,
    CdkAccordion,
  ],
})
export class BoosterListComponent {
  history = input<HistoryItem[]>([]);
  boosterId = input(1);
  onItemClick = output<HistoryItem>();
  deleteItem = output<HistoryItem>();

  getCardForBooster(boosterId: number): HistoryItem[] {
    return this.history().filter(h => h.boosterId === boosterId);
  }

  uniqueBoosterIds(): number[] {
    const boosterIdsFromHistory = Array.from(new Set(this.history().map((h) => h.boosterId)));
    if (this.boosterId() > boosterIdsFromHistory.length) {
      boosterIdsFromHistory.push(this.boosterId());
    }
    return boosterIdsFromHistory;
  }
}
