import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../account/shared/auth.service';
import { User } from '../../../models/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrls: ['./navigation-main.component.scss']
})
export class NavigationMainComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  public user: User;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
      }
    );
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
