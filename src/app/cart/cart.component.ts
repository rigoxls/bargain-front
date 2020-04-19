import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {CartService} from './shared/cart.service';
import {CartItem} from '../models/cart-item.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  private cartSubscription: Subscription;
  public items: CartItem[];
  public total: number;
  public readOnly = false;
  public isRequest = false;
  public isOffer = false;
  public isOfferRequest = false;
  public isCart = false;
  public user = null;
  public representative = null;
  public offerStatus = null;

  constructor(
    private router: Router,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute) {
    this.isOffer = this.activatedRoute.snapshot.params.isOffer;
    this.isRequest = this.activatedRoute.snapshot.params.isRequest;
    this.isOfferRequest = this.activatedRoute.snapshot.params.isOfferRequest;
    this.isCart = (!this.isOffer && !this.isOfferRequest && !this.isRequest);
    this.representative = null;

    this.offerStatus = localStorage.getItem('offerStatus');

    try {
      this.user = JSON.parse(atob(localStorage.getItem('user')));
      this.representative = localStorage.getItem('representative');
    } catch (e) {
      console.info(e);
    }
  }

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    this.cartSubscription = this.cartService.itemsChanged.subscribe(
      (items: CartItem[]) => {
        this.items = items;
        this.total = this.cartService.getTotal();
      }
    );
  }

  public onClearCart(event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.clearCart();
  }

  public onRemoveItem(event, item: CartItem) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.removeItem(item);
  }

  public increaseAmount(item: CartItem) {
    this.cartService.updateItemAmount(item, item.amount + 1);
  }

  public decreaseAmount(item: CartItem) {
    const newAmount = item.amount === 1 ? 1 : item.amount - 1;
    this.cartService.updateItemAmount(item, newAmount);
  }

  public checkAmount(item: CartItem) {
    this.cartService.updateItemAmount(
      item,
      item.amount < 1 || !item.amount || isNaN(item.amount) ? 1 : item.amount
    );
  }

  public updatePrice(item: CartItem, price) {
    this.cartService.updateItemPrice(
      item,
      price.target.value
    );
  }

  async sendRequest() {
    await this.cartService.sendRequest();
    this.router.navigate(['/account/client']);
  }

  async sendOffer() {
    await this.cartService.sendOffer();
    this.router.navigate(['/account/provider']);
  }

  async chooseOffer() {
    this.offerStatus = localStorage.getItem('offerStatus');
    await this.cartService.chooseOffer(localStorage.getItem('offerId'));
    this.router.navigate(['/account/client']);
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}
