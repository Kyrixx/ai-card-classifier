import { Component, computed, HostListener, OnInit, signal } from '@angular/core';
import { ProcessorService } from '../services/processor.service';
import { StorageService } from '../services/storage.service';
import { Socket } from 'ngx-socket-io';
import type { HistoryItem } from '../models/history-item';
import { RarityEnum } from '../models/rarity.enum';
import { BoosterListComponent } from './booster-list.component';
import { Loading } from '../models/loading.enum';
import { CardDisplayComponent } from './card-display.component';
import { Card } from '../models/scryfall';

@Component({
  selector: 'app-layout',
  imports: [
    BoosterListComponent,
    CardDisplayComponent,
  ],
  template: `
    <div class="flex flex-col align-center max-w-sm border-2 border-gray-400 rounded-xl p-2">
      <app-card-display
        [card]="card()"
        [loadingState]="webSocketState()"
      ></app-card-display>

      <div class="flex flex-col max-w-sm mx-12 mt-4 bg-gray-700">
        <div class="flex w-full items-center">
          <div class="px-4 py-2 text-center flex items-center justify-center w-1/2 whitespace-nowrap">Common :</div>
          <div class="px-4 py-2 text-center w-1/2">{{ cardCounts()['common'] }}</div>
        </div>

        <div class="flex w-full items-center">
          <div class="px-4 py-2 text-center flex items-center justify-center w-1/2 whitespace-nowrap">Uncommon :</div>
          <div class="px-4 py-2 text-center w-1/2">{{ cardCounts()['uncommon'] }}</div>
        </div>

        <div class="flex w-full items-center">
          <div class="px-4 py-2 text-center flex items-center justify-center w-1/2 whitespace-nowrap">Rare :</div>
          <div class="px-4 py-2 text-center w-1/2">{{ cardCounts()['rare'] }}</div>
        </div>

        <div class="flex w-full items-center">
          <div class="px-4 py-2 text-center flex items-center justify-center w-1/2 whitespace-nowrap">Mythic :</div>
          <div class="px-4 py-2 text-center w-1/2">{{ cardCounts()['mythic'] }}</div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center mt-4">
        <p>Total : {{ totalPrice().toFixed(2) }} €</p>
        <p>Booster : {{ boosterId() }}</p>
      </div>

      <div class="flex justify-evenly mt-4 flex-wrap">
        <button class="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="onClick()">Ask
          AI
        </button>
        <button class="bg-blue-800 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="resetSession()">
          Reset
          Session
        </button>
        <button class="bg-green-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="nextBooster()">
          Next booster
        </button>
        <button class="bg-red-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="back()">Nop !
        </button>
      </div>
    </div>

    <app-booster-list
      [history]="history()"
      [boosterId]="boosterId()"
      (onItemClick)="handleItemClicked($event)"
      (deleteItem)="deleteItem($event)"
      class="max-w-3xl"
    ></app-booster-list>

    <div
      class="flex flex-col flex-1 max-h-full items-center"
      [class.video-container]="webSocketState() === Loading.Requested"
    >
      <video id="feedback" autoplay class="flex" [srcObject]="stream"></video>
    </div>

  `,
  styles: `
    :host {
      @apply flex;
    }

    .video-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .video-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 255, 0, 0.5); /* Red color with 50% opacity */
      filter: blur(10px); /* Adjust the blur radius as needed */
      z-index: 3;
      pointer-events: none; /* Ensure the blur does not interfere with video controls */
    }

    #feedback {
      position: relative;
      z-index: 2;
    }
  `,
})
export class LayoutComponent implements OnInit {
  protected stream: MediaStream | null = null;
  protected readonly width: number = 300;

  history = signal<HistoryItem[]>([]);
  currentHistoryItem = signal<HistoryItem | null>(null);
  boosterId = signal<number>(1);
  card = computed<Card | null>(() => this.currentHistoryItem()?.card ?? null);
  cardCounts = computed<Record<RarityEnum, number>>(() => {
    return this.history().reduce((acc: Record<RarityEnum, number>, h: HistoryItem) => {
      acc[h.card.rarity]++;
      return acc;
    }, {
      [RarityEnum.Common]: 0,
      [RarityEnum.Uncommon]: 0,
      [RarityEnum.Rare]: 0,
      [RarityEnum.Mythic]: 0,
    });
  });
  totalPrice = signal<number>(0.0);
  webSocketState = signal<Loading>(Loading.Initial);

  readonly WebSocketEvent: Record<Loading, string> = {
    [Loading.Initial]: '_',
    [Loading.Requested]: 'requested',
    [Loading.Clicked]: 'clicked',
    [Loading.WaitingScryfall]: 'waiting_scryfall',
    [Loading.WaitingAI]: 'waiting_ai',
    [Loading.AIFinished]: 'ai_finished',
    [Loading.Finished]: 'finished',
    [Loading.Error]: 'error',
  };

  constructor(
    private readonly processorService: ProcessorService,
    private readonly websocket: Socket,
    private readonly storage: StorageService,
  ) {}

  async ngOnInit() {
    this.loadSession();
    this.listenWebsocketEvents();
    this.stream = await ProcessorService.triggerVideo();
  }

  loadSession() {
    this.totalPrice.set(!!this.storage.get('price') ? parseFloat(this.storage.get('price')!) : 0.0);
    this.history.set(JSON.parse(this.storage.get('history') ?? '[]'));
    this.currentHistoryItem.set(this.history().at(-1) ?? null);
  }

  listenWebsocketEvents() {
    this.websocket.on(this.WebSocketEvent[Loading.Clicked], () => {
      this.webSocketState.set(Loading.Clicked);
      this.onClick();
    });

    this.websocket.on(this.WebSocketEvent[Loading.Requested], () => {
      this.webSocketState.set(Loading.Requested);
      this.currentHistoryItem.set(null);
    });

    this.websocket.on(this.WebSocketEvent[Loading.WaitingAI], () => {
      this.webSocketState.set(Loading.WaitingAI);
    });

    this.websocket.on(this.WebSocketEvent[Loading.AIFinished], () => {
      this.webSocketState.set(Loading.AIFinished);
    });

    this.websocket.on(this.WebSocketEvent[Loading.WaitingScryfall], () => {
      this.webSocketState.set(Loading.WaitingScryfall);
    });

    this.websocket.on(this.WebSocketEvent[Loading.Finished], () => {
      this.webSocketState.set(Loading.Finished);
    });

    this.websocket.on(this.WebSocketEvent[Loading.Error], () => {
      this.webSocketState.set(Loading.Error);
    });
  }

  @HostListener('window:keydown', ['$event'])
  async handleKeyDown(event: KeyboardEvent) {
    if (!!event && event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    await this.onClick();
  }

  async onClick() {
    this.currentHistoryItem.set(null);
    const historyItem = {
      card: await this.processorService.triggerRecognition(),
      date: Date.now(),
      boosterId: this.boosterId(),
    };
    this.history.set([...this.history(), historyItem]);
    this.currentHistoryItem.set(historyItem);

    this.totalPrice.update((price) => price + parseFloat(this.card()?.prices?.eur ?? '0.0'));
    this.saveSession();
  }

  back() {
    this.deleteItem(this.history().at(-1) ?? null)
  }

  nextBooster() {
    this.boosterId.set(this.boosterId() + 1);
  }

  saveSession() {
    this.storage.set('price', this.totalPrice().toString());
    this.storage.saveObject('history', this.history());
  }

  resetSession() {
    this.storage.resetSession();
    this.currentHistoryItem.set(null);
    this.totalPrice.set(0.0);
    this.history.set([]);
    this.boosterId.set(1);
    this.webSocketState.set(Loading.Initial);
  }

  protected readonly Loading = Loading;

  handleItemClicked(event: any) {
    console.log(event);
    this.currentHistoryItem.set(event);
  }

  deleteItem(item: HistoryItem | null) {
    if (!item) {
      return;
    }
    const removedCard = item.card;
    this.history.set(this.history().filter((h) => h.date !== item.date));
    this.currentHistoryItem.set(this.history().at(-1) ?? null);
    this.totalPrice.update((price) => price - parseFloat(removedCard.prices.eur ?? '0.0'));
    this.saveSession();
  }
}
