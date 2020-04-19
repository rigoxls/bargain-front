import {Component, OnInit, OnDestroy} from '@angular/core';
import {ClientService} from './shared/client.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/auth.service';

import {User} from '../../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private user: User;
  private requests: any;

  constructor(
    public requestService: ClientService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    if (this.user) {
      this.getRequests(this.user.id);
    }
  }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
        if (this.user) {
          this.getRequests(this.user.id);
        }
      }
    );
  }

  async getRequests(userId: number) {
    this.requests = await this.requestService.getRequests(userId);
  }

  feedCart(requestId) {
    this.requestService.feedCart(requestId);
    this.router.navigate(['/client/client/true']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
