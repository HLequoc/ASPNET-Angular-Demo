import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Observable, tap } from 'rxjs';
import { ORDERS_API, ORDERS_HUB } from './api.config';
import { Order, Status } from './models';

export type LiveZustand = 'verbindet' | 'verbunden' | 'getrennt';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private connection?: HubConnection;


  readonly orders = signal<Order[]>([]);
  readonly status = signal<Status>('loading');
  readonly live = signal<LiveZustand>('verbindet');

  laden(): void {
    this.status.set('loading');
    this.http.get<Order[]>(ORDERS_API).subscribe({
      next: (liste) => {
        this.orders.set(liste);
        this.status.set('ready');
      },
      error: () => this.status.set('error'),
    });
  }

  // Der BestellService erwartet einzelne Parameter in der URL (kein JSON-Body):
  // POST /api/bestellungen?kundenId=1&artikel=Laptop&menge=1
  addOrder(customerId: number, artikel: string, count: number): Observable<Order> {
    const params = new HttpParams()
      .set('customerId', customerId)
      .set('artikel', artikel)
      .set('count', count);

    return this.http
      .post<Order>(ORDERS_API, null, { params })
      .pipe(tap(() => this.laden()));
  }

  liveStarten(): void {
      if (!this.connection) {
        this.connection = this.connectionBuilder();
      }
      if (this.connection.state !== HubConnectionState.Disconnected) {
        return;
      }

      this.live.set('verbindet');
      this.connection
        .start()
        .then(() => this.live.set('verbunden'))
        .catch(() => this.live.set('getrennt'));
  }

  private connectionBuilder(): HubConnection {
      const connection = new HubConnectionBuilder()
        .withUrl(ORDERS_HUB)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      connection.on('BestellungAngelegt', (neu: Order) => {
              this.orders.update((liste) =>
                liste.some((b) => b.id === neu.id) ? liste : [...liste, neu].sort((a, b) => a.id - b.id),
              );
      });

      connection.onreconnecting(() => this.live.set('verbindet'));
      connection.onreconnected(() => {
              this.live.set('verbunden');
              this.laden();
            });
      connection.onclose(() => this.live.set('getrennt'));

      return connection;
  }
}
