import { Component, OnInit, signal } from '@angular/core';
import { NgIf, UpperCasePipe } from '@angular/common';
import { ProcessorService } from '../services/processor.service';
import { StorageService } from '../services/storage.service';
import { Socket } from 'ngx-socket-io';
import { ControlsComponent } from './controls.component';

enum Loading {
  Requested,
  Clicked,
  WaitingScryfall,
  WaitingAI,
  AIFinished,
  Finished,
}

enum RarityEnum {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Mythic = 'mythic',
}

@Component({
  selector: 'app-layout',
  imports: [
    NgIf,
    UpperCasePipe,
    ControlsComponent,
  ],
  template: `
    <div class="flex flex-col align-center max-w-sm border-2 border-gray-400 rounded-xl p-2">
      <section class="flex flex-col items-center min-h-auto">
        <img *ngIf="card() !== null" class="justify-center min-h-75" [src]="card()?.image_uris.large" [width]="width"
             [height]="width*1.31"
             alt="Card" />
        <div *ngIf="card() === null"
             class="w-75 h-98 rounded-xl bg-blue-100 flex items-center justify-center border-1 border-gray-400">
          {{ loadingString() }}
        </div>
        <div *ngIf="card()" class="flex flex-row justify-evenly min-w-full">
          <p>Set : {{ card()?.set | uppercase }}</p>
          <p class="align-center">Prix : {{ card()?.prices.eur }} €</p>
        </div>
      </section>

      <div class="flex flex-col max-w-md mx-auto mt-4 bg-gray-200">
          <app-controls title="Common" (i)="increment(RarityEnum.Common)" (d)="decrement(RarityEnum.Common)">
            {{ cardCounts['common'] }}
          </app-controls>
          <app-controls title="Uncommon" (i)="increment(RarityEnum.Uncommon)" (d)="decrement(RarityEnum.Uncommon)">
            {{ cardCounts['uncommon'] }}
          </app-controls>
          <app-controls title="Rare" (i)="increment(RarityEnum.Rare)" (d)="decrement(RarityEnum.Rare)">
            {{ cardCounts['rare'] }}
          </app-controls>
          <app-controls title="Mythic" (i)="increment(RarityEnum.Mythic)" (d)="decrement(RarityEnum.Mythic)">
            {{ cardCounts['mythic'] }}
          </app-controls>
      </div>

      <div class="flex justify-center mt-4">
        <p>Total : {{ totalPrice().toFixed(2) }} €</p>
      </div>

      <div class="flex justify-evenly mt-4">
        <button class="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer" (click)="onClick()">Ask AI</button>
        <button class="bg-blue-800 text-white px-6 py-2 rounded-md cursor-pointer" (click)="resetSession()">Reset Session</button>
      </div>
    </div>
  `,
})
export class LayoutComponent implements OnInit{
  protected readonly RarityEnum = RarityEnum;
  protected readonly width: number = 300;
  private readonly emptySession: Record<RarityEnum, number> = {
    [RarityEnum.Common]: 0,
    [RarityEnum.Uncommon]: 0,
    [RarityEnum.Rare]: 0,
    [RarityEnum.Mythic]: 0,
  };

  history: any[] = [];
  boosterId: number = 0;
  totalPrice = signal<number>(0.0);
  card = signal<any>(null);
  loadingString = signal<string>("Waiting for request...");
  cardCounts: Record<RarityEnum, number> = this.emptySession;

  readonly WebSocket = {
    Requested: 'requested',
    Clicked: 'clicked',
    WaitingScryfall: 'waiting_scryfall',
    WaitingAI: 'waiting_ai',
    AIFinished: 'ai_finished',
    Finished: 'finished',
  }

  readonly LoadingLabels: Record<Loading, string> = {
    [Loading.Clicked]: 'Detection requested',
    [Loading.Requested]: 'Request received',
    [Loading.WaitingAI]: 'Waiting for AI response',
    [Loading.AIFinished]: 'Card detected',
    [Loading.WaitingScryfall]: 'Waiting for Scryfall response',
    [Loading.Finished]: 'Card Information retrieved',
  }

  constructor(
    private readonly processorService: ProcessorService,
    private readonly websocket: Socket,
    private readonly storage: StorageService,
  ) {
  }

  async ngOnInit() {

    this.cardCounts = this.storage.getSession() ?? this.emptySession;
    this.totalPrice.update(() => this.storage.get('price') ? parseFloat(this.storage.get('price')!) : 0.0);
    await ProcessorService.triggerVideo();

    this.websocket.on(this.WebSocket.Clicked, () => {
      this.loadingString.update(() => this.LoadingLabels[Loading.Clicked]);
      this.onClick();
    })

    this.websocket.on(this.WebSocket.Requested, () => {
      this.loadingString.update(() => this.LoadingLabels[Loading.Requested]);
      this.card.update(() => null);
    })

    this.websocket.on(this.WebSocket.WaitingAI, () => {
      this.loadingString.update(() => this.LoadingLabels[Loading.WaitingAI]);

    })

    this.websocket.on(this.WebSocket.AIFinished, () => {
      this.loadingString.update(() => this.LoadingLabels[Loading.AIFinished]);

    })

    this.websocket.on(this.WebSocket.WaitingScryfall, () => {
      this.loadingString.update(() => this.LoadingLabels[Loading.WaitingScryfall]);
    })

    this.websocket.on(this.WebSocket.Finished, () => {
      this.loadingString.update(() => this.LoadingLabels[Loading.Finished]);
    })
  }

  async onClick() {
    const card = await this.processorService.triggerRecognition();
    this.card.update(() => card);
    this.history.push({
      card,
      date: Date.now(),
      boosterId: this.boosterId,
    })
    this.totalPrice.update((price) => price + parseFloat(card.prices.eur));
    this.cardCounts[`${card.rarity}` as RarityEnum]++;
    this.saveSession();
  }

  saveSession() {
    this.storage.saveSession(this.cardCounts);
    this.storage.set('price', this.totalPrice().toString());
  }

  resetSession() {
    this.storage.resetSession();
    this.cardCounts = this.emptySession;
  }

  increment(rarity: RarityEnum) {
    this.cardCounts[rarity]++;
    this.saveSession();
  }

  decrement(rarity: RarityEnum) {
    this.cardCounts[rarity]--;
    this.saveSession();
  }
}
