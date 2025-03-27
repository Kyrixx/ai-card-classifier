import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetCardCount } from '../models/api/set-card-count';
import { HistoryItem } from '../models/history-item';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = `${window.location.protocol}//${window.location.hostname}:3100`;
  constructor(private readonly http: HttpClient) { }

  getCardCountForSet(set: string) {
    return this.http.get<SetCardCount[]>(`${this.baseUrl}/set/${set.toUpperCase()}/card-count`);
  }

  saveCard(params: { set: string, collectorNumber: string, boosterId: number, sessionId: string, createdAt: number }) {
    return this.http.post(`${this.baseUrl}/save/card`, params);
  }

  saveCards(params: {history: HistoryItem[], sessionId: string}) {
    const cards = params.history.map((item) => {
      return {
        set: item.card.set,
        collectorNumber: item.card.collector_number,
        boosterId: item.boosterId,
        createdAt: item.date,
        sessionId: params.sessionId
      };
    });
    return this.http.post(`${this.baseUrl}/save/cards`, cards);
  }

  deleteCard(params: { set: string, collectorNumber: string, boosterId: number, sessionId: string, createdAt: number }) {
    return this.http.delete(`${this.baseUrl}/save/card`, {body: params});
  }
}
