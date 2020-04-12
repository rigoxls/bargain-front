import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Subscription} from 'rxjs';

import {AuthService} from '../../account/shared/auth.service';

import {User} from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  public user: User;
  public showSearch;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
      }
    );
  }

  public onLogOut(e: Event) {
    this.authService.signOut();
    this.router.navigate(['/register-login']);
    e.preventDefault();
  }

  public onMenuToggle(e: Event) {
    e.preventDefault();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
