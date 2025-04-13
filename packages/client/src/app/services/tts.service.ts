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
  }

  speak(text: string, lang: string = 'fr-FR') {
    this.utterThis.text = text;
    this.utterThis.voice = window.speechSynthesis.getVoices()
      .filter((voice) => voice.lang === lang && voice.voiceURI.match(/^Google/))[0];
    this.synth.speak(this.utterThis);
  }
}
