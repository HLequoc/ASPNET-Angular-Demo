import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Observable, tap } from 'rxjs';
import { CUSTOMERS_API, CUSTOMERS_HEALTH, CUSTOMERS_HUB } from '../api.config';
import { Customer, Status } from '../models';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly http = inject(HttpClient);
  private connection?: HubConnection;
  private healthPolling?: ReturnType<typeof setInterval>;
  private reconnectTimer?: ReturnType<typeof setTimeout>;

  readonly customers = signal<Customer[]>([]);
  readonly status = signal<Status>('loading');
  readonly liveStatus = signal<Status>('loading');

  gesundheitPruefungStarten(): void {
    if (this.healthPolling !== undefined) {
      return;
    }

    this.healthPolling = setInterval(() => {
      this.http.get(CUSTOMERS_HEALTH, { responseType: 'text' }).subscribe({
        next: () => this.status.set('ready'),
        error: () => this.status.set('error'),
      });
    }, 5_000);
  }

  laden(): void {
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
      .pipe(tap((kunde) => this.kundeHinzufuegen(kunde)));
  }

  liveStarten(): void {
    if (!this.connection) {
      this.connection = this.connectionBuilder();
    }
    this.verbinden();
  }

  private connectionBuilder(): HubConnection {
    const connection = new HubConnectionBuilder()
      .withUrl(CUSTOMERS_HUB)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on('KundeAngelegt', (neu: Customer) => {
      this.kundeHinzufuegen(neu);
    });

    connection.onreconnecting(() => this.liveStatus.set('loading'));
    connection.onreconnected(() => {
      this.liveStatus.set('ready');
      this.laden();
    });
    connection.onclose(() => {
      this.liveStatus.set('error');
      this.erneutVerbinden();
    });

    return connection;
  }

  private verbinden(): void {
    if (!this.connection || this.connection.state !== HubConnectionState.Disconnected) {
      return;
    }

    this.liveStatus.set('loading');
    this.connection
      .start()
      .then(() => {
        this.liveStatus.set('ready');
        if (this.reconnectTimer !== undefined) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = undefined;
        }
      })
      .catch(() => {
        this.liveStatus.set('error');
        this.erneutVerbinden();
      });
  }

  private erneutVerbinden(): void {
    if (this.reconnectTimer !== undefined) {
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.verbinden();
    }, 5000);
  }

  private kundeHinzufuegen(neu: Customer): void {
    this.customers.update((liste) =>
      liste.some((kunde) => kunde.id === neu.id)
        ? liste
        : [...liste, neu].sort((a, b) => a.id - b.id),
    );
    this.status.set('ready');
  }
}
