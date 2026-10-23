import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReaderService } from '../../../../core/services/reader.service';
import { FileReaderService } from '../../../../core/services/file-reader/file-reader.service';

import { WordDisplayComponent } from '../../components/word-display/word-display.component';

@Component({
    selector: 'app-reader-page',
    standalone: true,
    imports: [FormsModule, WordDisplayComponent],
    templateUrl: './reader-page.component.html',
    styleUrls: ['./reader-page.component.css']
})
export class ReaderPageComponent {

    readerService = inject(ReaderService);
    private fileReaderService = inject(FileReaderService);

    text = '';
    selectedFileName = '';

    progress = computed(() => {

        const total = this.readerService.words().length;

        if (total === 0) {
        return 0;
        }

        return Math.round((this.readerService.currentIndex() / total) * 100);
    });

    estimatedTime = computed(() => {

        const totalWords = this.readerService.words().length;
        const wpm = this.readerService.wpm();

        if (!totalWords || !wpm) {
        return 0;
        }

        return Math.ceil(totalWords / wpm);
    });

    async onFileSelected(event: Event) {

        const file = (event.target as HTMLInputElement).files?.[0];

        if (!file) {
        return;
        }

        this.selectedFileName = file.name;

        try {

            const text = await this.fileReaderService.extractText(file);

            this.text = text;

            this.readerService.loadText(text);

        } catch (error) {

            console.error(error);

            alert('No se pudo leer el archivo seleccionado.');
        }
    }

    private http = inject(HttpClient);

    loadExample() {
        this.http
            .get('examples/quijote.txt', { responseType: 'text' })
            .subscribe(text => { this.text = text; this.readerService.loadText(text); });
    }

    updateSpeed(event: Event) {

        const value =
        Number(
            (event.target as HTMLInputElement).value
        );

        this.readerService.updateWpm(value);
    }

    play(): void {
        this.readerService.play();
    }

    pause(): void {
        this.readerService.pause();
    }

    reset(): void {
        this.readerService.reset();
    }
}