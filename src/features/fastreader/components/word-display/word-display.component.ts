import { Component, Input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-word-display',
  standalone: true,
  templateUrl: './word-display.component.html',
  styleUrl: './word-display.component.css'
})
export class WordDisplayComponent {

  word = signal('');

  @Input()
  set currentWord(value: string) {
    this.word.set(value ?? '');
  }

  leftPart = computed(() => {
    const word = this.word();
    const pivot = this.getPivotIndex(word);

    return word.slice(0, pivot);
  });

  focusLetter = computed(() => {
    const word = this.word();
    const pivot = this.getPivotIndex(word);

    return word.charAt(pivot);
  });

  rightPart = computed(() => {
    const word = this.word();
    const pivot = this.getPivotIndex(word);

    return word.slice(pivot + 1);
  });

  private getPivotIndex(word: string): number {

    if (!word) return 0;

    if (word.length <= 2) return 0;
    if (word.length <= 5) return 1;
    if (word.length <= 9) return 2;

    return 3;
  }
}