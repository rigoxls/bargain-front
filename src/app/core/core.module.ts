import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { NavigationOffCanvasComponent } from './navigation-off-canvas/navigation-off-canvas.component';
import { FooterComponent } from './content/footer/footer.component';
import { NavigationMainComponent } from './header/navigation-main/navigation-main.component';
import { ToolbarCartComponent } from './header/toolbar/cart/cart.component';
import { SearchComponent } from './header/search/search.component';

import { ProductService } from '../products/shared/product.service';
import { MessageService } from '../messages/message.service';
import { CartService } from '../cart/shared/cart.service';
import { PagerService } from '../pager/pager.service';
import { OrderService } from '../account/orders/shared/order.service';
import { AuthService } from '../account/shared/auth.service';
import { OffcanvasService } from './shared/offcanvas.service';
import { PromoService } from './shared/promo.service';
import { UiService } from '../products/shared/ui.service';
import { ProductsCacheService } from '../products/shared/products-cache.service';

import { throwIfAlreadyLoaded } from './module-import-guard';


@NgModule({
    declarations: [
        ContentComponent,
        HeaderComponent,
        NavigationOffCanvasComponent,
        FooterComponent,
        NavigationMainComponent,
        ToolbarCartComponent,
        SearchComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        CommonModule,
        SharedModule,
        NavigationOffCanvasComponent,
        HeaderComponent,
        ContentComponent
    ],
    providers: [
        ProductService,
        ProductsCacheService,
        MessageService,
        CartService,
        PagerService,
        OrderService,
        AuthService,
        OffcanvasService,
        PromoService,
        UiService
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
