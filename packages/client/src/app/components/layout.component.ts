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
import { TtsService } from '../services/tts.service';
import { AudioService } from '../services/audio.service';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-layout',
  imports: [
    BoosterListComponent,
    CardDisplayComponent,
  ],
  template: `
    <div class="flex flex-col align-center max-w-sm border-2 border-gray-400 rounded-xl p-2">
      <div class="flex flex-row items-center justify-center mb-4">
        <p>Total : {{ totalPrice().toFixed(2) }} € | Booster : {{ boosterId() }} | Session : {{ sessionId }}</p>
      </div>

      <video id="feedback" autoplay class="flex" [srcObject]="stream"></video>

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

      <div class="flex justify-evenly mt-4 flex-wrap">
        <button class="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="detectCard()">Ask
          AI
        </button>
        <button class="bg-blue-800 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="resetSession()">
          Reset
          Session
        </button>
        <button class="bg-green-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="nextBooster()">
          Next booster
        </button>
        <button class="bg-orange-500 text-white px-6 py-2 rounded-md cursor-pointer mx-2 my-1" (click)="readCard()">Read
          Card
        </button>
        <button (click)="saveHistory()">history</button>
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
      <app-card-display
        [card]="card()"
        [loadingState]="webSocketState()"
      ></app-card-display>
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
  protected readonly Loading = Loading;
  protected stream: MediaStream | null = null;
  protected readonly width: number = 300;
  protected sessionId: string = '';

  history = signal<HistoryItem[]>([]);
  currentHistoryItem = signal<HistoryItem | null>(null);
  collectionCompletion = computed(() => {
    const history = this.history()
    return {
      total: [...new Set(history.map(h => h.card.oracle_id))].length,
      [RarityEnum.Common]: [...new Set(history.filter(h => h.card.rarity === RarityEnum.Common).map(h => h.card.oracle_id))].length,
      [RarityEnum.Uncommon]: [...new Set(history.filter(h => h.card.rarity === RarityEnum.Uncommon).map(h => h.card.oracle_id))].length,
      [RarityEnum.Rare]: [...new Set(history.filter(h => h.card.rarity === RarityEnum.Rare).map(h => h.card.oracle_id))].length,
      [RarityEnum.Mythic]: [...new Set(history.filter(h => h.card.rarity === RarityEnum.Mythic).map(h => h.card.oracle_id))].length,
    }
  });
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
    private readonly tts: TtsService,
    private readonly apiWebservice: ApiService,
  ) {
  }

  async ngOnInit() {
    this.listenWebsocketEvents();
    await this.loadSession();
    this.stream = await ProcessorService.triggerVideo();
  }

  async loadSession() {
    this.totalPrice.set(!!this.storage.get('price') ? parseFloat(this.storage.get('price')!) : 0.0);

    this.history.set(JSON.parse(this.storage.get('history') ?? '[]').reduce((acc: HistoryItem[], h: HistoryItem) => {
      return [
        ...acc,
        {
          card: h.card,
          date: h.date,
          boosterId: h.boosterId,
          isDoublon: this.isCardDoublon(h.card, acc),
        },
      ];
    }, []));

    this.currentHistoryItem.set(this.history().at(-1) ?? null);
    this.boosterId.set(this.history().length > 0 ? this.history().at(-1)!.boosterId : 1);
    this.sessionId = this.storage.get('sessionId') ?? (await lastValueFrom(this.apiWebservice.createSession({ type: 'display_opening' }))).sessionId;
  }

  listenWebsocketEvents() {
    this.websocket.on(this.WebSocketEvent[Loading.Clicked], () => {
      if(this.webSocketState() !== Loading.Finished) {
        return;
      }

      this.webSocketState.set(Loading.Clicked);
      this.detectCard();
    });

    this.websocket.on(this.WebSocketEvent[Loading.Requested], () => {
      this.webSocketState.set(Loading.Requested);
      AudioService.beep();
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
    await this.detectCard();
  }

  async detectCard() {
    let card = await this.processorService.triggerRecognition();
    const historyItem: HistoryItem = {
      card,
      date: Date.now(),
      boosterId: this.boosterId(),
      isDoublon: this.isCardDoublon(card, this.history()),
    };
    this.history.set([...this.history(), historyItem]);
    this.currentHistoryItem.set(historyItem);
    this.totalPrice.update((price) => price + parseFloat(this.card()?.prices?.eur ?? '0.0'));
    if(parseInt(this.card()?.prices?.eur ?? '0.0') >= 10) {
      await AudioService.sparkles();
    }
    this.saveSession();
  }

  nextBooster() {
    this.boosterId.set(this.boosterId() + 1);
  }

  saveSession() {
    this.storage.set('price', this.totalPrice().toString());
    this.storage.saveObject('history', this.history());
    this.storage.set('sessionId', this.sessionId);
    lastValueFrom(this.apiWebservice.saveCards({
      history: this.history(),
      sessionId: this.sessionId,
    }));
  }

  async resetSession() {
    if (!window.confirm('Are you sure you want to reset the session?')) {
      return;
    }
    this.storage.resetSession();
    this.currentHistoryItem.set(null);
    this.totalPrice.set(0.0);
    this.history.set([]);
    this.boosterId.set(1);
    this.webSocketState.set(Loading.Initial);
    this.sessionId = (await lastValueFrom(this.apiWebservice.createSession({ type: 'display_opening' }))).sessionId;
  }

  handleItemClicked(event: any) {
    this.currentHistoryItem.set(event);
  }

  async deleteItem(item: HistoryItem | null) {
    if (!item) {
      return;
    }
    const removedCard = item.card;
    this.history.set(this.history().filter((h) => h.date !== item.date));
    this.currentHistoryItem.set(this.history().at(-1) ?? null);
    this.totalPrice.update((price) => price - parseFloat(removedCard.prices.eur ?? '0.0'));
    await lastValueFrom(this.apiWebservice.deleteCard({
      set: removedCard.set,
      collectorNumber: removedCard.collector_number,
      boosterId: item.boosterId,
      sessionId: this.sessionId,
      createdAt: item.date,
    }));
    this.saveSession();
  }

  readCard() {
    const textToRead = this.card()?.printed_text ?? '';
    this.tts.speak(
      textToRead
        .replace(/\{T\}/g, 'Engagez cette carte')
        .replace(/\{Q\}/g, 'Dégagez cette carte')
        .replace(/\{W\}/g, 'Mana blanc')
        .replace(/\{U\}/g, 'Mana bleu')
        .replace(/\{B\}/g, 'Mana noir')
        .replace(/\{R\}/g, 'Mana rouge')
        .replace(/\{G\}/g, 'Mana vert')
        .replace(/\{C\}/g, 'Mana incolore')
        .replace(/\(*.\)/g, '')
        .replace(/\//g, '')
    );
  }

  isCardDoublon(card: Card, history: HistoryItem[]): boolean {
    return history.some((h) => h.card.printed_name === card.printed_name);
  }

  async saveHistory() {
    await lastValueFrom(this.apiWebservice.saveCards({
      history: this.history(),
      sessionId: this.sessionId,
    }));
  }
}
