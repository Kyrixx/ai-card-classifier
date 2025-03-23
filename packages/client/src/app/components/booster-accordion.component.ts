import { Component, Input } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { Card } from '../models/card';

@Component({
  selector: 'booster-accordion-item',
  imports: [
    CdkAccordionModule,
    MatIcon,
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
          <div class="flex w-full">
            <mat-icon *ngIf="!accordionItem.expanded" class="">keyboard_arrow_down</mat-icon>
            <mat-icon *ngIf="accordionItem.expanded" class="">keyboard_arrow_up</mat-icon>
            <p class="mx-3">Booster n°{{ boosterNumber }}</p>
            <span *ngIf="isActive">✅</span>
          </div>
        </div>
      </button>

      @if (accordionItem.expanded) {
        <div class="flex flex-col w-full px-1">
          @for (card of cards; track card.name) {
            <div class="flex justify-around">
              <div class="flex justify-start flex-grow">
                @for (mana of extractManaValues(card.mana_cost); track mana) {
                  <span
                    class="ms ms-cost ms-shadow"
                    [ngClass]="'ms-' + mana.toLowerCase()"
                  ></span>
                }
                <span class="mx-1">{{ getCardName(card) }}</span>
              </div>
              <div class="flex justify-end flex-grow">
                <span>{{ card.set | uppercase }}</span>
                <span class="mx-1">{{ card.collector_number }}</span>
                <span class="mx-1">{{ card.price }}</span>
              </div>
            </div>
          }
          <div class="flex justify-center" *ngIf="cards.length === 0"> Vide </div>

        </div>

      }
    </cdk-accordion-item>
  `,
  styles: `
    :host {
      //border: 1px solid black;
    }
  `,
})
export class BoosterAccordionComponent {
  @Input() cards: Card[] = [];

  @Input() boosterNumber: number = 0;
  @Input() isActive: boolean = true;

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
}
