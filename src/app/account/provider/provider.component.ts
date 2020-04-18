import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProviderService} from './shared/provider.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/auth.service';

import {User} from '../../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private user: User;
  private requests: any;

  constructor(
    public providerService: ProviderService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    if (this.user) {
      this.getRequests();
    }
  }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
        if (this.user) {
          this.getRequests();
        }
      }
    );
  }

  async getRequests() {
    this.requests = await this.providerService.getRequests();
  }

  feedCart(requestId) {
    this.providerService.feedCart(requestId);
    this.router.navigate(['/cart/true']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
