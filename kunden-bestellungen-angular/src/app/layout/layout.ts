import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  jahr = new Date().getFullYear();

  menue = [
    { pfad: '/', text: 'Start' },
    { pfad: '/produkte', text: 'Produkte' },
    { pfad: '/kontakt', text: 'Kontakt' },
  ];
}