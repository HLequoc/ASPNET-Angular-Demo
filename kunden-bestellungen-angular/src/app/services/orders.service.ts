import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { Observable, tap } from 'rxjs';
import { ORDERS_API, ORDERS_HEALTH, ORDERS_HUB } from '../api.config';
import { Order, Status } from '../models';

export type LiveZustand = 'verbindet' | 'verbunden' | 'getrennt';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private connection?: HubConnection;
  private healthPolling?: ReturnType<typeof setInterval>;
  private reconnectTimer?: ReturnType<typeof setTimeout>;

  readonly orders = signal<Order[]>([]);
  readonly customerFilter = signal<number | null>(null);
  readonly status = signal<Status>('loading');
  readonly live = signal<LiveZustand>('verbindet');

  gesundheitPruefungStarten(): void {
    if (this.healthPolling !== undefined) {
      return;
    }

    this.healthPolling = setInterval(() => {
      this.http.get(ORDERS_HEALTH, { responseType: 'text' }).subscribe({
        next: () => this.status.set('ready'),
        error: () => this.status.set('error'),
      });
    }, 5_000);
  }

  laden(): void {
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
      .pipe(tap((bestellung) => this.bestellungHinzufuegen(bestellung)));
  }

  liveStarten(): void {
      if (!this.connection) {
        this.connection = this.connectionBuilder();
      }
      this.verbinden();
  }

  private connectionBuilder(): HubConnection {
      const connection = new HubConnectionBuilder()
        .withUrl(ORDERS_HUB)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

      connection.on('BestellungAngelegt', (neu: Order) => {
              this.bestellungHinzufuegen(neu);
      });

      connection.onreconnecting(() => this.live.set('verbindet'));
      connection.onreconnected(() => {
              this.live.set('verbunden');
              this.laden();
            });
      connection.onclose(() => {
        this.live.set('getrennt');
        this.erneutVerbinden();
      });

      return connection;
  }

  private verbinden(): void {
      if (!this.connection || this.connection.state !== HubConnectionState.Disconnected) {
        return;
      }

      this.live.set('verbindet');
      this.connection
        .start()
        .then(() => {
          this.live.set('verbunden');
          if (this.reconnectTimer !== undefined) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = undefined;
          }
        })
        .catch(() => {
          this.live.set('getrennt');
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

  private bestellungHinzufuegen(neu: Order): void {
    this.orders.update((liste) =>
      liste.some((bestellung) => bestellung.id === neu.id)
        ? liste
        : [...liste, neu].sort((a, b) => a.id - b.id),
    );
    this.status.set('ready');
  }
}
