import {Component, OnInit, OnDestroy} from '@angular/core';
import {RequestService} from './shared/request.service';
import {config} from '../../shared/config';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/auth.service';
import {User} from '../../models/user.model';

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
    public orderService: RequestService,
    private authService: AuthService,
  ) {
  }

  async ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
        this.getRequests(this.user.id);
      }
    );
  }

  async getRequests(userId: number) {
    this.requests = await this.orderService.getRequests(userId);
  }

  ngOnDestroy() {
  }
}
