import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CUSTOMERS_API } from './api.config';
import { Customer, Status } from './models';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly http = inject(HttpClient);

  readonly customers = signal<Customer[]>([]);
  readonly status = signal<Status>('loading');

  laden(): void {
    this.status.set('loading');
    this.http.get<Customer[]>(CUSTOMERS_API).subscribe({
      next: (liste) => {
        this.customers.set(liste);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }
}
