import {Injectable, OnInit} from '@angular/core';
import {MessageService} from '../../../messages/message.service';
import {CartService} from '../../../cart/shared/cart.service';
import {CartItem} from '../../../models/cart-item.model';
import {config} from '../../../shared/config';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class OfferService {
  constructor(
    private messageService: MessageService,
    private cartService: CartService,
    private http: HttpClient
  ) {
  }

  public async getOffers(listOfferPath: string, userId: number) {
    const requests = await this.http.get<any>(`${config.backUrl}offer/${listOfferPath}/${userId}`).toPromise();
    return requests.map(request => {
      return {
        id: request.Id,
        status: request.Status,
        email: request.email,
        representative: request.representative,
        date: request.Creation_Date
      };
    });
  }

  async feedCart(requestId) {
    const request = await this.http.get<any>(`${config.backUrl}offer/${requestId}`).toPromise();
    const products = request.products.map(product => {
      localStorage.setItem('requestId', requestId);
      return new CartItem({
        id: product.Id_Product,
        name: product.Name,
        description: product.Description,
        price: product.Price_Offer,
        imageURLs: product.imageURLs,
        idCatalogue: product.Id_Catalogue,
        imageRefs: [],
      }, 1);
    });

    this.cartService.clearCart();
    this.cartService.addItems(products, true);

  }
}
