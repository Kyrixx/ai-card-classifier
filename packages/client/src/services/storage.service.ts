import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage: Storage = window.localStorage;

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  get(key: string): string | null {
    return this.storage.getItem(key);
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  saveSession(cardCounts: Record<string, number>) {
    this.set('cardCounts', JSON.stringify(cardCounts));
  }

  getSession(): Record<string, number> {
    return JSON.parse(this.get('cardCounts') || 'null');
  }

  resetSession() {
    this.remove('cardCounts');
    this.remove('price');
  }
}
