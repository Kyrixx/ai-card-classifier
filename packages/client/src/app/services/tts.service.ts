import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private synth: SpeechSynthesis;
  private readonly utterThis: SpeechSynthesisUtterance;
  private readonly languageMapping: Record<string, string> = {
    'fr': 'fr-FR',
    'en': 'en-US',
  }

  constructor() {
    this.synth = window.speechSynthesis;
    this.utterThis = new SpeechSynthesisUtterance();
    this.utterThis.lang = 'fr-FR';
  }

  speak(text: string, lang: string = 'fr') {
    this.utterThis.text = text;
    this.utterThis.voice = window.speechSynthesis.getVoices()
      .filter((voice) => voice.lang === this.languageMapping[lang] && voice.voiceURI.match(/^Google/))[0];
    this.synth.speak(this.utterThis);
  }
}
