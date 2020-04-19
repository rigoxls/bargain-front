import {Component, OnInit, OnDestroy} from '@angular/core';
import {ExternalProviderService} from './shared/external-provider.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/auth.service';

import {User} from '../../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './external-provider.component.html',
  styleUrls: ['./external-provider.component.scss']
})
export class ExternalProviderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private user: User;
  private requests: any;

  constructor(
    public providerService: ExternalProviderService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    if (this.user) {

    }
  }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
        if (this.user) {

        }
      }
    );
  }


  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
