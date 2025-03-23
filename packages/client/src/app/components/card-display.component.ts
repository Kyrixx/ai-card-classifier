import { Component, Input } from '@angular/core';
import { NgIf, UpperCasePipe } from '@angular/common';
import { Loading } from '../models/loading.enum';
import { Card } from '../models/scryfall';

@Component({
  standalone: true,
  selector: 'app-card-display',
  template: `
    <section class="flex flex-col items-center min-h-auto">
      <img *ngIf="card !== null" class="justify-center min-h-75" [src]="getCardImage(card)" [width]="width"
           [height]="width*1.31"
           alt="Card" />
      <div *ngIf="card === null"
           class="w-75 h-98 rounded-xl bg-blue-700 flex items-center justify-center border-1 border-gray-400">
        {{ LoadingLabels[loadingState] }}
      </div>
      <div *ngIf="card" class="flex flex-row justify-evenly min-w-full">
        <p>Set : {{ card.set | uppercase }}</p>
        <p class="align-center">Prix : {{ getCardPrice(card) }}</p>
      </div>
    </section>
  `,
  imports: [
    NgIf,
    UpperCasePipe,
  ],
  styles: `
    :host {
      @apply flex flex-col items-center min-h-auto;
    }
  `,
})
export class CardDisplayComponent {
  @Input() card: Card | null = null;
  @Input() loadingState: Loading = Loading.Initial;

  protected readonly width = 300;
  readonly LoadingLabels: Record<Loading, string> = {
    [Loading.Initial]: 'Waiting for request...',
    [Loading.Clicked]: 'Detection requested',
    [Loading.Requested]: 'Request received',
    [Loading.WaitingAI]: 'Waiting for AI response',
    [Loading.AIFinished]: 'Card detected',
    [Loading.WaitingScryfall]: 'Waiting for Scryfall response',
    [Loading.Finished]: 'Card Information retrieved',
    [Loading.Error]: 'No card detected',
  };

  getCardImage(card: Card): string {
    return card.image_uris?.large.length > 0 ? card.image_uris.large : card.image_uris.png;
  }

  getCardPrice(card: Card): string {
    return card.prices.eur?.length > 0 ? `${card.prices.eur}€` : 'N/A';
  }
}
