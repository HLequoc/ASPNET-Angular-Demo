import { Component, computed, input } from '@angular/core';
import { Status } from '../models';

@Component({
  selector: 'app-service-status',
  host: { '[attr.data-zustand]': 'status()', role: 'status' },
  template: `
    <span class="punkt" aria-hidden="true"></span>
    <span class="name">{{ name() }}</span>
    <span class="adresse">{{ adresse() }}</span>
    <span class="text">{{ text() }}</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: baseline;
      gap: 8px;
      padding: 6px 12px;
      border: 1px solid var(--linie);
      border-radius: 999px;
      background: var(--flaeche);
      font-size: 14px;
    }
    .punkt {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--gedaempft);
      align-self: center;
    }
    .name { font-weight: 600; }
    .adresse { color: var(--gedaempft); }
    :host([data-zustand='ready']) .punkt { background: var(--ok); }
    :host([data-zustand='ready']) .text { color: var(--ok); }
    :host([data-zustand='error']) .punkt { background: var(--fehler); }
    :host([data-zustand='error']) .text { color: var(--fehler); font-weight: 600; }
  `,
})
export class ServiceStatus {
  readonly name = input.required<string>();
  readonly adresse = input.required<string>();
  readonly status = input.required<Status>();

  readonly textBereit = input('erreichbar');
  readonly textFehler = input('nicht erreichbar');
  readonly textLaedt = input('wird geprüft');

  protected readonly text = computed(() => {
    switch (this.status()) {
      case 'ready':
        return this.textBereit();
      case 'error':
        return this.textFehler();
      default:
        return this.textLaedt();
    }
  });
}
