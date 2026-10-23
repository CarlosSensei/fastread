import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ReaderService {

  words = signal<string[]>([]);
  currentIndex = signal(0);
  wpm = signal(300);
  isPlaying = signal(false);

  private timer: ReturnType<typeof setInterval> | null = null;

  currentWord = computed(
    () => this.words()[this.currentIndex()] ?? ''
  );

  loadText(text: string): void {

    const words = text
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    this.pause();

    this.words.set(words);
    this.currentIndex.set(0);
  }

  play(): void {

    if (this.isPlaying() || this.words().length === 0) {
      return;
    }

    this.isPlaying.set(true);

    const intervalMs = 60000 / this.wpm();

    this.timer = setInterval(() => {

      if (this.currentIndex() >= this.words().length - 1) {
        this.reset();
        return;
      }

      this.currentIndex.update(index => index + 1);

    }, intervalMs);
  }

  updateWpm(value: number): void {

    this.wpm.set(value);

    if (this.isPlaying()) {
      this.pause();
      this.play();
    }
  }

  pause(): void {

    this.isPlaying.set(false);

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset(): void {

    this.pause();
    this.currentIndex.set(0);
  }
}