import {Component, OnInit, OnDestroy} from '@angular/core';
import {OfferService} from './shared/offer.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/auth.service';

import {User} from '../../models/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  private user: User;
  private requests: any;

  constructor(
    public providerService: OfferService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    if (this.user) {
      this.getOffers();
    }
  }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe(
      user => {
        this.user = user;
        if (this.user) {
          this.getOffers();
        }
      }
    );
  }

  async getOffers() {
    let listOfferPath = null;
    if (this.router.url === '/account/offer/client') {
      listOfferPath = 'getByClient';
    } else {
      listOfferPath = 'getByProvider';
    }
    this.requests = await this.providerService.getOffers(listOfferPath, this.user.id);
  }

  feedCart(requestId, representative, status) {
    localStorage.setItem('representative', representative);
    localStorage.setItem('offerId', requestId);
    localStorage.setItem('offerStatus', status);
    this.providerService.feedCart(requestId);
    this.router.navigate(['/client/offer/true']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
