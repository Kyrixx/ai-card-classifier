import { Component, OnInit, signal } from '@angular/core';
import { CardListComponent } from './widgets/card-list.component';
import { Card } from '../models/mtg-json';
import { ApiService } from '../services/api.service';

@Component({
  template: `
    <app-card-list [cards]="cards()"></app-card-list>
  `,
  styles: [`

  `],
  imports: [
    CardListComponent,
  ],
  standalone: true,
})
export class PrinterComponent implements OnInit {
  cards = signal<Card[]>([]);

  constructor(private readonly apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getCardFromMtgJson([
      { set: 'FIN', collector_number: '1' },
      { set: 'FIN', collector_number: '2' },
      { set: 'FIN', collector_number: '3' },
      { set: 'FIN', collector_number: '4' },
      { set: 'FIN', collector_number: '5' },
      { set: 'FIN', collector_number: '6' },
      { set: 'FIN', collector_number: '7' },
      { set: 'FIN', collector_number: '8' },
      { set: 'FIN', collector_number: '9' },
      { set: 'FIN', collector_number: '10' },
      { set: 'FIN', collector_number: '11' },
      { set: 'FIN', collector_number: '12' },
      { set: 'FIN', collector_number: '13' },
      { set: 'FIN', collector_number: '14' },
      { set: 'FIN', collector_number: '15' },
    ]).subscribe(res => {
      this.cards.set(res);
    })
  }
}
