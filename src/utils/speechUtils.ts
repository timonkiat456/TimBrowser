// Web Speech API utilities for Android Auto Text-to-Speech & Voice Recognition

export class CarSpeechSynthesizer {
  private static utterance: SpeechSynthesisUtterance | null = null;
  private static isPlayingState: boolean = false;
  private static onStateChangeCallback: ((isPlaying: boolean) => void) | null = null;

  static setCallback(cb: (isPlaying: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  static speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser environment');
      return;
    }

    this.stop();

    if (!text.trim()) return;

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = 1.0;
    this.utterance.pitch = 1.0;
    this.utterance.lang = 'en-US';

    this.utterance.onstart = () => {
      this.isPlayingState = true;
      this.onStateChangeCallback?.(true);
    };

    this.utterance.onend = () => {
      this.isPlayingState = false;
      this.onStateChangeCallback?.(false);
      onEnd?.();
    };

    this.utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      this.isPlayingState = false;
      this.onStateChangeCallback?.(false);
    };

    window.speechSynthesis.speak(this.utterance);
  }

  static pause() {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.isPlayingState = false;
      this.onStateChangeCallback?.(false);
    }
  }

  static resume() {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPlayingState = true;
      this.onStateChangeCallback?.(true);
    }
  }

  static stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isPlayingState = false;
      this.onStateChangeCallback?.(false);
    }
  }

  static isSpeaking(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
}
