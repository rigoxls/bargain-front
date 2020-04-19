import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';

import {ContentComponent} from './content/content.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './content/footer/footer.component';
import {NavigationMainComponent} from './header/navigation-main/navigation-main.component';
import {SearchComponent} from './header/search/search.component';

import {ProductService} from '../products/shared/product.service';
import {MessageService} from '../messages/message.service';
import {CartService} from '../cart/shared/cart.service';
import {PagerService} from '../pager/pager.service';
import {ClientService} from '../account/client/shared/client.service';
import {AuthService} from '../account/shared/auth.service';
import {UiService} from '../products/shared/ui.service';
import {ProductsCacheService} from '../products/shared/products-cache.service';
import {ProviderService} from '../account/provider/shared/provider.service';

import {throwIfAlreadyLoaded} from './module-import-guard';
import {OfferService} from '../account/offer/shared/offer.service';


@NgModule({
  declarations: [
    ContentComponent,
    HeaderComponent,
    FooterComponent,
    NavigationMainComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    CommonModule,
    SharedModule,
    HeaderComponent,
    ContentComponent
  ],
  providers: [
    ProductService,
    ProductsCacheService,
    MessageService,
    CartService,
    PagerService,
    ClientService,
    ProviderService,
    OfferService,
    AuthService,
    UiService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
