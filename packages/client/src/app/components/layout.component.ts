import { Component, HostListener, OnInit, signal } from '@angular/core';
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
  Error,
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
          {{ cardCounts()['common'] }}
        </app-controls>
        <app-controls title="Uncommon" (i)="increment(RarityEnum.Uncommon)" (d)="decrement(RarityEnum.Uncommon)">
          {{ cardCounts()['uncommon'] }}
        </app-controls>
        <app-controls title="Rare" (i)="increment(RarityEnum.Rare)" (d)="decrement(RarityEnum.Rare)">
          {{ cardCounts()['rare'] }}
        </app-controls>
        <app-controls title="Mythic" (i)="increment(RarityEnum.Mythic)" (d)="decrement(RarityEnum.Mythic)">
          {{ cardCounts()['mythic'] }}
        </app-controls>
      </div>

      <div class="flex justify-center mt-4">
        <p>Total : {{ totalPrice().toFixed(2) }} €</p>
      </div>

      <div class="flex justify-evenly mt-4 flex-wrap">
        <button class="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="onClick()">Ask AI</button>
        <button class="bg-blue-800 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="resetSession()">Reset
          Session
        </button>
        <button class="bg-green-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="nextBooster()">Next booster</button>
        <button class="bg-red-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="back()">Nop !</button>
      </div>
    </div>
    <div class="flex flex-col flex-1 max-h-full items-center">
      <div class="flex flex-col items-center bg-blue-200 min-w-full">Booster n°{{ boosterId() }}</div>
      <div class="flex flex-col items-center bg-purple-200">Salut 2</div>
      <video id="feedback" autoplay class="flex w-5/6" [srcObject]="stream"></video>
    </div>

  `,
  styles: `
    :host {
      display: flex;
    }
    `,
})
export class LayoutComponent implements OnInit {
  protected readonly RarityEnum = RarityEnum;
  protected stream: MediaStream | null = null;
  protected readonly width: number = 300;
  private readonly emptySession: Record<RarityEnum, number> = {
    [RarityEnum.Common]: 0,
    [RarityEnum.Uncommon]: 0,
    [RarityEnum.Rare]: 0,
    [RarityEnum.Mythic]: 0,
  };

  history: any[] = [];
  boosterId = signal<number>(1);
  card = signal<any>(null);
  loadingString = signal<string>("Waiting for request...");

  cardCounts = signal<Record<RarityEnum, number>>(this.emptySession);
  totalPrice = signal<number>(0.0);
  readonly WebSocket = {
    Requested: 'requested',
    Clicked: 'clicked',
    WaitingScryfall: 'waiting_scryfall',
    WaitingAI: 'waiting_ai',
    AIFinished: 'ai_finished',
    Finished: 'finished',
    Error: 'error',
  };

  readonly LoadingLabels: Record<Loading, string> = {
    [Loading.Clicked]: 'Detection requested',
    [Loading.Requested]: 'Request received',
    [Loading.WaitingAI]: 'Waiting for AI response',
    [Loading.AIFinished]: 'Card detected',
    [Loading.WaitingScryfall]: 'Waiting for Scryfall response',
    [Loading.Finished]: 'Card Information retrieved',
    [Loading.Error]: 'No card detected',
  };

  constructor(
    private readonly processorService: ProcessorService,
    private readonly websocket: Socket,
    private readonly storage: StorageService,
  ) {
  }

  async ngOnInit() {
    this.cardCounts.set(this.storage.getSession() ?? this.emptySession);
    this.totalPrice.set(this.storage.get('price') ? parseFloat(this.storage.get('price')!) : 0.0);
    this.stream = await ProcessorService.triggerVideo();

    this.websocket.on(this.WebSocket.Clicked, () => {
      this.loadingString.set(this.LoadingLabels[Loading.Clicked]);
      this.onClick();
    });

    this.websocket.on(this.WebSocket.Requested, () => {
      this.loadingString.set(this.LoadingLabels[Loading.Requested]);
      this.card.update(() => null);
    })

    this.websocket.on(this.WebSocket.WaitingAI, () => {
      this.loadingString.set(this.LoadingLabels[Loading.WaitingAI]);

    });

    this.websocket.on(this.WebSocket.AIFinished, () => {
      this.loadingString.set(this.LoadingLabels[Loading.AIFinished]);

    });

    this.websocket.on(this.WebSocket.WaitingScryfall, () => {
      this.loadingString.set(this.LoadingLabels[Loading.WaitingScryfall]);
    })

    this.websocket.on(this.WebSocket.Finished, () => {
      this.loadingString.set(this.LoadingLabels[Loading.Finished]);
    })

    this.websocket.on(this.WebSocket.Error, () => {
      this.loadingString.set(this.LoadingLabels[Loading.Error]);
    })
  }

  @HostListener('window:keydown', ['$event'])
  async onClick(event?: KeyboardEvent) {
    if (!!event && event.key !== 'Enter') {
      return;
    }
    const card = await this.processorService.triggerRecognition();
    this.card.update(() => card);
    this.history.push({
      card,
      date: Date.now(),
      boosterId: this.boosterId,
    })
    this.totalPrice.update((price) => price + parseFloat(card.prices.eur));
    this.increment(`${card.rarity}` as RarityEnum);
    this.saveSession();
  }

  back() {
    const removedCard = this.history.pop()?.card;
    let card1 = this.history.at(-1)?.card ?? null;
    this.card.set(card1);
    this.totalPrice.update((price) => price - parseFloat(removedCard.prices.eur));
    this.decrement(`${removedCard.rarity}` as RarityEnum);
    this.saveSession();
  }

  nextBooster() {
    this.boosterId.update((id) => id + 1);
  }

  saveSession() {
    this.storage.saveSession(this.cardCounts());
    this.storage.set('price', this.totalPrice.toString());
  }

  resetSession() {
    this.storage.resetSession();
    this.cardCounts.set(this.emptySession);
    this.card.set(null);
    this.totalPrice.set(0.0);
    this.loadingString.set("Waiting for request...");
  }

  increment(rarity: RarityEnum) {
    this.cardCounts.update(obj => {
      obj[rarity]++;
      return obj;
    });
    this.saveSession();
  }

  decrement(rarity: RarityEnum) {
    this.cardCounts.update(obj => {
      obj[rarity]--;
      return obj;
    });
    this.saveSession();
  }
}
