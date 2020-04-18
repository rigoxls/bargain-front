import {Injectable, OnInit} from '@angular/core';
import {MessageService} from '../../../messages/message.service';
import {CartService} from '../../../cart/shared/cart.service';
import {CartItem} from '../../../models/cart-item.model';
import {config} from '../../../shared/config';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ProviderService {
  constructor(
    private messageService: MessageService,
    private cartService: CartService,
    private http: HttpClient
  ) {
  }

  public async getRequests() {
    const requests = await this.http.get<any>(`${config.backUrl}request/`).toPromise();
    return requests.map(request => {
      return {
        id: request.Id,
        status: request.Status,
        date: request.Creation_Date
      };
    });
  }

  async feedCart(requestId) {
    const request = await this.http.get<any>(`${config.backUrl}request/${requestId}`).toPromise();
    const products = request.products.map(product => {
      localStorage.setItem('requestId', requestId);
      return new CartItem({
        id: product.Id_Product,
        name: product.Name,
        description: product.Description,
        price: product.Price,
        imageURLs: product.imageURLs,
        idCatalogue: product.Id_Catalogue,
        imageRefs: [],
      }, 1);
    });

    this.cartService.clearCart();
    this.cartService.addItems(products, true);

  }
}
