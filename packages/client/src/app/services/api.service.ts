import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetCardCount } from '../models/api/set-card-count';

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
}
