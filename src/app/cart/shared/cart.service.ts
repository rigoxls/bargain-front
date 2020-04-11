import {EventEmitter, Injectable} from '@angular/core';
import {Product} from '../../models/product.model';
import {CartItem} from '../../models/cart-item.model';
import {MessageService} from '../../messages/message.service';
import {config} from '../../shared/config';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CartService {
  // Init and generate some fixtures
  private cartItems: CartItem[];
  public itemsChanged: EventEmitter<CartItem[]> = new EventEmitter<CartItem[]>();

  constructor(
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient) {
    this.cartItems = [];
  }

  public getItems() {
    return this.cartItems.slice();
  }

  private getItemIds() {
    return this.getItems().map(cartItem => cartItem.product.id);
  }

  public addItem(item: CartItem) {
    if (this.getItemIds().includes(item.product.id)) {
      this.cartItems.forEach(function (cartItem) {
        if (cartItem.product.id === item.product.id) {
          cartItem.amount += item.amount;
        }
      });
      this.messageService.add('Amount in cart changed for: ' + item.product.name);
    } else {
      this.cartItems.push(item);
      this.messageService.add('Added to cart: ' + item.product.name);
    }
    this.itemsChanged.emit(this.cartItems.slice());
  }

  public addItems(items: CartItem[]) {
    items.forEach((cartItem) => {
      this.addItem(cartItem);
    });
  }

  public removeItem(item: CartItem) {
    const indexToRemove = this.cartItems.findIndex(element => element === item);
    this.cartItems.splice(indexToRemove, 1);
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add('Deleted from cart: ' + item.product.name);
  }

  public updateItemAmount(item: CartItem, newAmount: number) {
    this.cartItems.forEach((cartItem) => {
      if (cartItem.product.id === item.product.id) {
        cartItem.amount = newAmount;
      }
    });
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add('Updated amount for: ' + item.product.name);
  }

  public clearCart() {
    this.cartItems = [];
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add('Cleared cart');
  }

  public getTotal() {
    let total = 0;
    this.cartItems.forEach((cartItem) => {
      total += cartItem.amount * cartItem.product.price;
    });
    return total;
  }

  async sendRequest() {
    const items = this.getItems();
    const products = [];

    items.forEach(item => {
      products.push({
        productId: item.product.id,
        quantity: item.amount
      });
    });

    const formData = {
      userId: 1, //TODO RIGO
      status: 'PENDING',
      products
    };

    await this.http.post<any>(`${config.backUrl}request`, formData).subscribe(data => {
        this.messageService.add('Se ha enviado su cotización a los proveedores registrados');
      },
      error => {
        this.messageService.addError(error.error.message);
        throw Error('Error');
      });
  }

}
