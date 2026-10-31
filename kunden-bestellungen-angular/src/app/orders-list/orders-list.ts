import { Component, computed, inject } from '@angular/core';
import { OrdersService as OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders-list',
  template: `
    <section aria-labelledby="bestellungen-titel">
      <h2 id="bestellungen-titel">Bestellungen</h2>

      @if (orders.status() === 'error') {
        <p class="hinweis fehler">
          Der BestellService antwortet nicht. Starte ihn auf Port 5002 und wähle Aktualisieren.
        </p>
      } @else if (orders.status() === 'loading' && lines().length === 0) {
        <p class="hinweis">Bestellungen werden geladen.</p>
      } @else if (lines().length === 0) {
        <p class="hinweis">Noch keine Bestellungen. Lege rechts die erste an.</p>
      } @else {
        <div class="tabelle">
          <table>
            <thead>
              <tr>
                <th scope="col" class="zahl">Nr.</th>
                <th scope="col">Kunde</th>
                <th scope="col">Artikel</th>
                <th scope="col" class="zahl">Menge</th>
              </tr>
            </thead>
            <tbody>
              @for (b of lines(); track b.id) {
                <tr>
                  <td class="zahl">{{ b.id }}</td>
                  <td>{{ b.customerName }}</td>
                  <td>{{ b.artikel }}</td>
                  <td class="zahl">{{ b.count }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
})
export class OrdersList {
  protected readonly orders = inject(OrdersService);

  // Neueste Bestellung zuerst
  protected readonly lines = computed(() => [...this.orders.orders()].reverse());
}
