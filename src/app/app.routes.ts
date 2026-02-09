import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./features/landing/landing').then(m => m.Landing)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
