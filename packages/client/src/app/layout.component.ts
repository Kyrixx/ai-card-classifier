import { Component, OnInit } from '@angular/core';
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
        <img *ngIf="imgUrl !== null" class="justify-center min-h-75" [src]="imgUrl" [width]="width"
             [height]="width*1.31"
             alt="Card" />
        <div *ngIf="imgUrl === null"
             class="w-75 h-98 rounded-xl bg-blue-100 flex items-center justify-center border-1 border-gray-400">
          {{ loadingString }}
        </div>
        <div class="flex flex-row justify-evenly min-w-full">
          <p>Set : {{ set | uppercase }}</p>
          <p *ngIf="!!price" class="align-center">Prix : {{ price }} €</p>
        </div>
      </section>

      <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-4 bg-gray-200">
        <div class="p-4 text-center flex items-center justify-center">Common :</div>
        <div class="p-4 text-center">
          {{ cardCounts['common'] }}&nbsp;
          <app-controls (i)="increment(RarityEnum.Common)" (d)="decrement(RarityEnum.Common)"></app-controls>
        </div>
        <div class="p-4 text-center flex items-center justify-center">Uncommon :</div>
        <div class="p-4 text-center">
          {{ cardCounts['uncommon'] }}&nbsp;
          <app-controls (i)="increment(RarityEnum.Uncommon)" (d)="decrement(RarityEnum.Uncommon)"></app-controls>
        </div>
        <div class="p-4 text-center flex items-center justify-center">Rare :</div>
        <div class="p-4 text-center">
          {{ cardCounts['rare'] }}&nbsp;
          <app-controls (i)="increment(RarityEnum.Rare)" (d)="decrement(RarityEnum.Rare)"></app-controls>
        </div>
        <div class="p-4 text-center flex items-center justify-center">Mythic :</div>
        <div class="p-4 text-center">
          {{ cardCounts['mythic'] }}&nbsp;
          <app-controls (i)="increment(RarityEnum.Mythic)" (d)="decrement(RarityEnum.Mythic)"></app-controls>
        </div>
      </div>

      <div class="flex justify-center mt-4">
        <p>Total : {{ totalPrice.toFixed(2) }} €</p>
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
  imgUrl: string | null = null;
  price: string = "N/A";
  totalPrice: number = 0.0;
  width: number = 300;
  set: string = "";
  loadingString: string = "Waiting for request...";
  private readonly emptySession: Record<RarityEnum, number> = {
    [RarityEnum.Common]: 0,
    [RarityEnum.Uncommon]: 0,
    [RarityEnum.Rare]: 0,
    [RarityEnum.Mythic]: 0,
  };
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
    this.totalPrice = this.storage.get('price') ? parseFloat(this.storage.get('price')!) : 0.0;
    await ProcessorService.triggerVideo();

    this.websocket.on(this.WebSocket.Clicked, () => {
      this.loadingString = this.LoadingLabels[Loading.Clicked];
      this.onClick();
    })

    this.websocket.on(this.WebSocket.Requested, () => {
      this.loadingString = this.LoadingLabels[Loading.Requested];
      this.imgUrl = null;
    })

    this.websocket.on(this.WebSocket.WaitingAI, () => {
      this.loadingString = this.LoadingLabels[Loading.WaitingAI];

    })

    this.websocket.on(this.WebSocket.AIFinished, () => {
      this.loadingString = this.LoadingLabels[Loading.AIFinished];

    })

    this.websocket.on(this.WebSocket.WaitingScryfall, () => {
      this.loadingString = this.LoadingLabels[Loading.WaitingScryfall];
    })

    this.websocket.on(this.WebSocket.Finished, () => {
      this.loadingString = this.LoadingLabels[Loading.Finished];
    })
  }

  async onClick() {
    let card = await this.processorService.triggerRecognition();
    this.imgUrl = card.image_uris.large;
    this.price = card.prices.eur;
    this.totalPrice += parseFloat(card.prices.eur);
    this.set = card.set;
    this.cardCounts[`${card.rarity}` as RarityEnum]++;
    console.log(card);
    this.saveSession();
  }

  saveSession() {
    this.storage.saveSession(this.cardCounts);
    this.storage.set('price', this.totalPrice.toString());
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
