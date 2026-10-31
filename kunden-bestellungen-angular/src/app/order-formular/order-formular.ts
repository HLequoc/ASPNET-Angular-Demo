import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../orders.service';
import { CustomersService } from '../customers.service';

interface Message {
  art: 'ok' | 'fehler';
  text: string;
}

function errorText(e: HttpErrorResponse): string {
  if (e.status === 0) {
    return 'Der BestellService ist nicht erreichbar. Läuft er auf Port 5002?';
  }
  if (typeof e.error === 'string' && e.error.length > 0 && e.error.length < 200) {
    return e.error;
  }
  if (e.status === 400) {
    return 'Der BestellService hat die Eingaben abgelehnt. Prüfe Kunde, Artikel und Menge.';
  }
  return `Die Bestellung wurde nicht angelegt (Fehler ${e.status}).`;
}

@Component({
  selector: 'app-order-formular',
  imports: [ReactiveFormsModule],
  templateUrl: './order-formular.html',
  styleUrl: './order-formular.css',
})
export class OrderFormular {
  private readonly customersService = inject(CustomersService);
  private readonly ordersService = inject(OrdersService);

  protected readonly customers = this.customersService.customers;
  protected readonly kundenFehlen = computed(() => this.customers().length === 0);

  protected readonly sendet = signal(false);
  protected readonly message = signal<Message | null>(null);

  protected readonly form = new FormGroup({
    customerId: new FormControl<number | null>(null, Validators.required),
    artikel: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)],
    }),
    count: new FormControl<number | null>(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(999),
    ]),
  });

  protected showError(name: 'customerId' | 'artikel' | 'count'): boolean {
    const feld = this.form.controls[name];
    return feld.invalid && feld.touched;
  }

  protected senden(): void {
    if (this.sendet()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { customerId, artikel, count: number } = this.form.getRawValue();
    this.sendet.set(true);
    this.message.set(null);

    this.ordersService.addOrder(customerId!, artikel.trim(), number!).subscribe({
      next: (b) => {
        this.message.set({
          art: 'ok',
          text: `Bestellung ${b.id} für ${b.customerName} wurde angelegt.`,
        });
        // Kunde bleibt ausgewählt, damit mehrere Artikel nacheinander möglich sind
        this.form.reset({ customerId, artikel: '', count: 1 });
        this.sendet.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.message.set({ art: 'fehler', text: errorText(e) });
        this.sendet.set(false);
      },
    });
  }
}
