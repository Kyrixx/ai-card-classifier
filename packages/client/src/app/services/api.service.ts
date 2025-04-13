import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetCardCount } from '../models/api/set-card-count';
import { HistoryItem } from '../models/history-item';
import { Session } from '../models/api/session';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = `${window.location.protocol}//${window.location.hostname}/api`;
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
        set: item.card.setCode,
        collectorNumber: item.card.number,
        boosterId: item.boosterId,
        createdAt: item.date,
        sessionId: params.sessionId
      };
    });
    return this.http.post<any[]>(`${this.baseUrl}/save/cards`, cards);
  }

  deleteCard(params: { _id: number }) {
    return this.http.delete(`${this.baseUrl}/save/card`, {body: params});
  }

  createSession(params: { name: string, type: string }) {
    return this.http.post<Session>(`${this.baseUrl}/session`, params);
  }

  updateSession(params: { sessionId: string, name: string, type: string }) {
    return this.http.patch<Session>(`${this.baseUrl}/session/${params.sessionId}`, params);
  }

  getSession(sessionId: string) {
    return this.http.get<HistoryItem[]>(`${this.baseUrl}/session/${sessionId}`);
  }

  getSessions() {
    return this.http.get<Session[]>(`${this.baseUrl}/session`);
  }
}
