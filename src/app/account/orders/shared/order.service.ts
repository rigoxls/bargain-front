import { Injectable, OnInit } from '@angular/core';
import { MessageService } from '../../../messages/message.service';
import { AuthService } from '../../shared/auth.service';

@Injectable()
export class OrderService {
  constructor(
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  public getOrders() {
    //TODO RIGO
  }
}
