import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomersService } from '../services/customers.service';
import { ServiceStatus } from '../service-status/service-status';
import { CustomerList } from '../customers-list/customers-list';

interface Message {
  art: 'ok' | 'fehler';
  text: string;
}

@Component({
  imports: [CustomerList, ServiceStatus, ReactiveFormsModule],
  selector: 'app-kontakt',
  styleUrl: './kontakt.css',
  templateUrl: './kontakt.html',
})
export class Kontakt {
  protected readonly customers = inject(CustomersService);
  protected readonly sendet = signal(false);
  protected readonly message = signal<Message | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor() {
    this.update();
    this.customers.gesundheitPruefungStarten();
    this.customers.liveStarten();
  }

  protected update(): void {
    this.customers.laden();
  }

  protected showError(name: 'name' | 'email'): boolean {
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

    const { name, email } = this.form.getRawValue();
    this.sendet.set(true);
    this.message.set(null);

    this.customers.addCustomer(name.trim(), email.trim()).subscribe({
      next: (kunde) => {
        this.message.set({
          art: 'ok',
          text: `Kunde ${kunde.name} wurde angelegt.`,
        });
        this.form.reset({ name: '', email: '' });
        this.sendet.set(false);
      },
      error: (e: HttpErrorResponse) => {
        const text =
          e.status === 0
            ? 'Der KundenService ist nicht erreichbar. Läuft er auf Port 5001?'
            : e.status === 400
              ? 'Der KundenService hat Name oder E-Mail abgelehnt.'
              : `Der Kunde wurde nicht angelegt (Fehler ${e.status}).`;
        this.message.set({ art: 'fehler', text });
        this.sendet.set(false);
      },
    });
  }
}

