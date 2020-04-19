import {Component, OnInit, OnDestroy} from '@angular/core';
import {RequestService} from './shared/request.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/auth.service';

import {User} from '../../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private user: User;
  private requests: any;

  constructor(
    public requestService: RequestService,
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
    this.router.navigate(['/client/request/true']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
