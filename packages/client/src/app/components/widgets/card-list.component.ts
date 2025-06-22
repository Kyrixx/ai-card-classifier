import { Component, input } from '@angular/core';
import { Card, getCardImageUrl } from '../../models/mtg-json';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-list',
  template: `
    <ul class="flex flex-wrap justify-center">
      @for (card of cards(); track $index) {
        <li class="flex flex-col">
          <img
            class="mx-2 my-2"
            [ngSrc]="getCardImageUrl(card, 'en')"
            [width]="width"
            [height]="width*745/1040"
            alt="Card"
          />
          <div>
            <span>{{ card.setcode }}</span>
          </div>
        </li>
      }
    </ul>
  `,
  styles: ``,
  imports: [
    NgOptimizedImage,
  ],
  standalone: true,
})
export class CardListComponent {
  cards = input<Card[]>([]);
  protected readonly getCardImageUrl = getCardImageUrl;

  protected readonly width = 400;
}
