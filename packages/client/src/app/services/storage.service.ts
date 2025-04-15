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

  saveObject(key: string, value: Record<string, any>) {
    this.set(key, JSON.stringify(value));
  }

  getObject(key: string) {
    return JSON.parse(this.get(key) || 'null');
  }

  resetSession() {
    this.remove('cardCounts');
    this.remove('price');
    this.remove('history');
    this.remove('sessionId');
  }
}
