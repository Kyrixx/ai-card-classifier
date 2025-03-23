import { Component, Input } from '@angular/core';
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
          [isActive]="bid === boosterId"
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
  @Input() history: HistoryItem[] = [];
  @Input() boosterId: number = 1;

  getCardForBooster(boosterId: number): HistoryItem[] {
    return this.history.filter(h => h.boosterId === boosterId);
  }

  uniqueBoosterIds(): number[] {
    const boosterIdsFromHistory = Array.from(new Set(this.history.map((h) => h.boosterId)));
    if (this.boosterId > boosterIdsFromHistory.length) {
      boosterIdsFromHistory.push(this.boosterId);
    }
    return boosterIdsFromHistory;
  }
}
