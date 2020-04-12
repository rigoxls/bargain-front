import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from './shared/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public orders: Order[];

  constructor(public orderService: OrderService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
