import {EventEmitter, Injectable} from '@angular/core';
import {Product} from '../../models/product.model';
import {CartItem} from '../../models/cart-item.model';
import {MessageService} from '../../messages/message.service';
import {config} from '../../shared/config';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {User} from '../../models/user.model';

@Injectable()
export class CartService {
  // Init and generate some fixtures
  private cartItems: CartItem[];
  private user: User;

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

  public addItem(item: CartItem, avoidMsg = false) {
    if (this.getItemIds().includes(item.product.id)) {
      this.cartItems.forEach(function (cartItem) {
        if (cartItem.product.id === item.product.id) {
          cartItem.amount += item.amount;
        }
      });

      if (!avoidMsg) {
        this.messageService.add('Producto agregado: ' + item.product.name);
      }
    } else {
      this.cartItems.push(item);
      if (!avoidMsg) {
        this.messageService.add('Producto agregado: ' + item.product.name);
      }
    }
    this.itemsChanged.emit(this.cartItems.slice());
  }

  public addItems(items: CartItem[], avoidMsg = false) {
    items.forEach((cartItem) => {
      this.addItem(cartItem, avoidMsg);
    });
  }

  public removeItem(item: CartItem) {
    const indexToRemove = this.cartItems.findIndex(element => element === item);
    this.cartItems.splice(indexToRemove, 1);
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add('Producto eliminado de la cotización: ' + item.product.name);
  }

  public updateItemAmount(item: CartItem, newAmount: number) {
    this.cartItems.forEach((cartItem) => {
      if (cartItem.product.id === item.product.id) {
        cartItem.amount = newAmount;
      }
    });
    this.itemsChanged.emit(this.cartItems.slice());
  }

  public updateItemPrice(item: CartItem, price: number) {
    this.cartItems.forEach((cartItem) => {
      if (cartItem.product.id === item.product.id) {
        cartItem.product.price = price;
      }
    });
    this.itemsChanged.emit(this.cartItems.slice());
  }

  public clearCart() {
    this.cartItems = [];
    this.itemsChanged.emit(this.cartItems.slice());
  }

  public getTotal() {
    let total = 0;
    this.cartItems.forEach((cartItem) => {
      total += cartItem.amount * cartItem.product.price;
    });
    return total;
  }

  async sendRequest() {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    const items = this.getItems();
    const products = [];

    items.forEach(item => {
      products.push({
        productId: item.product.id,
        quantity: item.amount,
        price: item.product.price
      });
    });

    const formData = {
      userId: this.user.id,
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

  async sendOffer() {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    const items = this.getItems();
    const products = [];

    items.forEach(item => {
      products.push({
        productId: item.product.id,
        priceOffer: (item.amount * item.product.price)
      });
    });

    const formData = {
      userId: this.user.id,
      requestId: localStorage.getItem('requestId'),
      status: 'PENDING',
      products
    };

    await this.http.post<any>(`${config.backUrl}offer`, formData).subscribe(data => {
        this.messageService.add('Se ha enviado la oferta al cliente emisor');
      },
      error => {
        this.messageService.addError(error.error.message);
        throw Error('Error');
      });
  }

  async chooseOffer(id) {
    const formData = {id};
    await this.http.post<any>(`${config.backUrl}offer/updateStatus`, formData).subscribe(data => {
        this.messageService.add('Se ha elegido la oferta actual');
      },
      error => {
        this.messageService.addError(error.error.message);
        throw Error('Error');
      });
  }

}
