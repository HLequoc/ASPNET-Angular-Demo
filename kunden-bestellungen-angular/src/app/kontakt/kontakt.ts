import { Component,computed, inject } from '@angular/core';
import { OrdersService as OrdersService } from '../services/orders.service';
import { CustomersService as CustomersService } from '../services/customers.service';
import { ServiceStatus } from '../service-status/service-status';
import { CustomerList} from '../customers-list/customers-list';
import { OrderFormular } from '../order-formular/order-formular';
import { OrdersList} from '../orders-list/orders-list';
import { Status } from '../models';

@Component({
  imports: [CustomerList, ServiceStatus],
  selector: 'app-kontakt',
  styleUrl: './kontakt.css',
  templateUrl: './kontakt.html',
})
export class Kontakt 
{
   protected readonly customers = inject(CustomersService);


  constructor() {
    this.update();
  }

  protected update(): void {
    this.customers.laden();
  }
}

