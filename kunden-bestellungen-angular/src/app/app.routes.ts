import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Start } from './start/start';
import { Produkte } from './produkte/produkte';
import { Kontakt } from './kontakt/kontakt';

export const routes: Routes = [
  {
    path: '',
    component: Layout,          // Rahmen für alle Seiten darunter
    children: [
      { path: '', component: Start, title: 'Start' },
      { path: 'produkte', component: Produkte, title: 'Produkte' },
      { path: 'kontakt', component: Kontakt, title: 'Kontakt' },
    ],
  },
  { path: '**', redirectTo: '' },
];