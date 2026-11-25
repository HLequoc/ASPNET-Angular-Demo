import { Component,computed, inject } from '@angular/core';
import { OrdersService as OrdersService } from '../services/orders.service';
import { CustomersService as CustomersService } from '../services/customers.service';
import { ServiceStatus } from '../service-status/service-status';
import { CustomerList} from '../customers-list/customers-list';
import { OrderFormular } from '../order-formular/order-formular';
import { OrdersList} from '../orders-list/orders-list';
import { Status } from '../models';

@Component({
  imports: [OrderFormular, CustomerList, OrdersList, ServiceStatus],
  selector: 'app-start',
  styleUrl: './start.css',
  templateUrl: './start.html',
})
export class Start{
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