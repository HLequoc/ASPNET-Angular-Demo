import { Component, inject } from '@angular/core';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-customers-list',
  template: `
    <section aria-labelledby="kunden-titel">
      <h2 id="kunden-titel">Kunden</h2>

      @if (customers.status() === 'error') {
        <p class="hinweis fehler">
          Der KundenService antwortet nicht. Starte ihn auf Port 5001 und wähle Aktualisieren.
        </p>
      } @else if (customers.status() === 'loading' && customers.customers().length === 0) {
        <p class="hinweis">Kunden werden geladen.</p>
      } @else if (customers.customers().length === 0) {
        <p class="hinweis">Der KundenService hat keine Kunden geliefert.</p>
      } @else {
        <div class="tabelle">
          <table>
            <thead>
              <tr>
                <th scope="col" class="zahl">Nr.</th>
                <th scope="col">Name</th>
                <th scope="col">E-Mail</th>
              </tr>
            </thead>
            <tbody>
              @for (k of customers.customers(); track k.id) {
                <tr>
                  <td class="zahl">{{ k.id }}</td>
                  <td>{{ k.name }}</td>
                  <td>{{ k.email }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
})
export class CustomerList {
  protected readonly customers = inject(CustomersService);
}
