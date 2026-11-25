import { Component } from '@angular/core';

@Component({
  selector: 'app-produkte',
  templateUrl: './produkte.html',
})
export class Produkte {
  produkte = [
    { name: 'Laptop', preis: 899 },
    { name: 'Monitor', preis: 249 },
    { name: 'Tastatur', preis: 49 },
  ];
}