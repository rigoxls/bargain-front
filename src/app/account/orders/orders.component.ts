import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from './shared/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  constructor(public orderService: OrderService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
