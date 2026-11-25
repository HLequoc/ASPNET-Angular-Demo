import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { OrdersService as OrdersService } from './services/orders.service';
import { CustomersService as CustomersService } from './services/customers.service';
import { ServiceStatus } from './service-status/service-status';
import { Status } from './models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App 
{
  protected readonly customers = inject(CustomersService);
  protected readonly orders = inject(OrdersService);

  protected readonly liveZustand = computed<Status>(() => {
    switch (this.orders.live()) {
      case 'verbunden':
        return 'ready';
      case 'getrennt':
        return 'error';
      default:
        return 'loading';
    }
  });
  
  constructor() {
    this.update();
  }

  protected update(): void {
    this.customers.laden();
    this.orders.laden();
    this.orders.liveStarten();
  }
}
