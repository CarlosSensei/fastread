import { Routes } from '@angular/router';
import { ReaderPageComponent } from '../features/fastreader/pages/reader/reader-page.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'reader',
        pathMatch: 'full'
    },
    {
        path: 'reader',
        loadComponent: () =>
            import('../features/fastreader/pages/reader/reader-page.component')
        .then(m => m.ReaderPageComponent)
    },
    {
        path: '**',
        redirectTo: 'reader'
    }
];
