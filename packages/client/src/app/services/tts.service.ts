import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private synth: SpeechSynthesis;
  private readonly utterThis: SpeechSynthesisUtterance;

  constructor() {
    this.synth = window.speechSynthesis;
    this.utterThis = new SpeechSynthesisUtterance();
    this.utterThis.lang = 'fr-FR';
    this.utterThis.voice = this.synth.getVoices().find((voice) => voice.voiceURI === 'Marie')!;
  }

  speak(text: string) {
    this.utterThis.text = text;
    console.log(text);
    this.synth.speak(this.utterThis);
  }
}
