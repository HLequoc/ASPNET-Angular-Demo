import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Observable, tap } from 'rxjs';
import { CUSTOMERS_API, CUSTOMERS_HUB } from '../api.config';
import { Customer, Status } from '../models';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly http = inject(HttpClient);
  private connection?: HubConnection;

  readonly customers = signal<Customer[]>([]);
  readonly status = signal<Status>('loading');
  readonly liveStatus = signal<Status>('loading');

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

  addCustomer(name: string, email: string): Observable<Customer> {
    return this.http
      .post<Customer>(CUSTOMERS_API, { name, email })
      .pipe(tap(() => this.laden()));
  }

  liveStarten(): void {
    if (!this.connection) {
      this.connection = this.connectionBuilder();
    }
    if (this.connection.state !== HubConnectionState.Disconnected) {
      return;
    }

    this.liveStatus.set('loading');
    this.connection
      .start()
      .then(() => this.liveStatus.set('ready'))
      .catch(() => this.liveStatus.set('error'));
  }

  private connectionBuilder(): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(CUSTOMERS_HUB)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on('KundeAngelegt', (neu: Customer) => {
      this.customers.update((liste) =>
        liste.some((kunde) => kunde.id === neu.id)
          ? liste
          : [...liste, neu].sort((a, b) => a.id - b.id),
      );
    });

    connection.onreconnecting(() => this.liveStatus.set('loading'));
    connection.onreconnected(() => {
      this.liveStatus.set('ready');
      this.laden();
    });
    connection.onclose(() => this.liveStatus.set('error'));

    return connection;
  }
}
