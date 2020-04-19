import { Component } from '@angular/core';

import { AuthService } from './shared/auth.service';
import { Router } from '@angular/router';
import { ClientService } from './client/shared/client.service';

import { User } from '../models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  public user: User;

  constructor(
    private authService: AuthService,
    public router: Router,
    public orderService: ClientService
  ) {
    try {
      this.user = JSON.parse(atob(localStorage.getItem('user')));
    } catch (e) {
      console.info(e);
    }
  }
}
