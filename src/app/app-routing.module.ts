import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {CartComponent} from './cart/cart.component';
import {AddEditComponent} from './provider/add-edit/add-edit.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ProviderGuard} from './provider/shared/provider.guard';
import {RegisterLoginComponent} from './account/register-login/register-login.component';
import {RequestComponent} from './account/request/request.component';
import {ProfileComponent} from './account/profile/profile.component';
import {AccountComponent} from './account/account.component';
import {ProductsListComponent} from './products/products-list/products-list.component';
import {ProductDetailComponent} from './products/product-detail/product-detail.component';
import {LogguedGuard} from './account/guards/loggued-guard';

const routes: Routes = [
  {path: '', redirectTo: '/register-login', pathMatch: 'full'},
  {path: 'products', component: ProductsListComponent},
  {path: 'products/:id', component: ProductDetailComponent},
  {path: 'cart', component: CartComponent},
  {path: 'cart/:read', component: CartComponent},
  {path: 'provider/add', component: AddEditComponent, canActivate: [ProviderGuard]},
  {
    path: 'provider/edit/:id',
    component: AddEditComponent,
    canActivate: [ProviderGuard]
  },
  {
    path: 'register-login',
    component: RegisterLoginComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      {path: '', redirectTo: 'profile', pathMatch: 'full'},
      {path: 'requests', component: RequestComponent},
      {path: 'profile', component: ProfileComponent}
    ],
    canActivate: [LogguedGuard]
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    ProviderGuard,
    LogguedGuard,
  ]
})
export class AppRoutingModule {
}
