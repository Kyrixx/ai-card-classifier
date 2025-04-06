import { Component, input, Input, signal } from '@angular/core';
import { NgIf, UpperCasePipe } from '@angular/common';
import { Loading } from '../../models/loading.enum';
import { Card } from '../../models/scryfall';
import { getCardImageUrl, getCardPrice } from '../../models/mtg-json';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-card-display',
  template: `
    <section *ngIf="enabled" class="flex flex-col items-center min-h-auto">
      <div *ngIf="!!card" class="relative">
        <img class="justify-center min-h-75" [src]="getCardImageUrl(card, currentLanguage())" [width]="width"
             [height]="width*1.31"
             alt="Card" />
        <div *ngIf="loadingState() !== Loading.Finished" class="loading-text absolute z-1 text-white italic bg-blue-700 w-full text-center">
          {{ LoadingLabels[loadingState()] }}
        </div>
      </div>
      <div *ngIf="card === null"
           class="w-75 h-98 rounded-xl bg-blue-700 flex items-center justify-center border-1 border-gray-400">
        {{ LoadingLabels[loadingState()] }}
      </div>
      <div *ngIf="card" class="flex flex-row justify-evenly min-w-full">
        <p>Set : {{ card.setCode | uppercase }}</p>
        <p class="align-center">Prix : {{ getCardPrice(card).toFixed(2) }}€</p>
        <div
          class="flex justify-center cursor-pointer hover:underline"
          (click)="changeLanguage()"
        >
          <mat-icon>flip_camera_android</mat-icon>
          <span [class.text-blue-400]="currentLanguage() === 'fr'">FR</span>/<span [class.text-blue-400]="currentLanguage() === 'en'">EN</span>
        </div>
      </div>
    </section>
  `,
  imports: [
    NgIf,
    UpperCasePipe,
    MatIcon,
  ],
  styles: `
    :host {
      @apply flex flex-col items-center min-h-auto;
    }

    .loading-text {
      top: 100%;
      left: 50%;
      transform: translate(-50%, -100%);
      background-color: rgba(21, 70, 230, 0.5);
    }
  `,
})
export class CardDisplayComponent {
  @Input() card: Card | null = null;
  loadingState = input<Loading>(Loading.Initial);
  @Input() enabled = false;
  currentLanguage = signal<string>('fr');

  protected readonly width = 600;
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

  protected readonly Loading = Loading;
  protected readonly getCardPrice = getCardPrice;
  protected readonly getCardImageUrl = getCardImageUrl;
  changeLanguage() {
    this.currentLanguage.set(this.currentLanguage() === 'fr' ? 'en' : 'fr');
  }
}
