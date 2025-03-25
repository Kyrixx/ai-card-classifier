import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  static async sparkles() {
    const audio = new Audio('audio/sparkles.mp3');
    await audio.play();
  }

  static async beep() {
    const audio = new Audio('audio/beep.mp3');
    audio.volume = 0.4;
    await audio.play();
  }
}
