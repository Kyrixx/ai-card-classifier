import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  static async sparkles() {
    const audio = new Audio('audio/sparkles.mp3');
    await audio.play();
  }
}
