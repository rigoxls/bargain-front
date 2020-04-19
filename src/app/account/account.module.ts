import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {SharedModule} from '../shared/shared.module';

import {RequestComponent} from './request/request.component';
import {RegisterLoginComponent} from './register-login/register-login.component';
import {AccountComponent} from './account.component';
import {ProviderComponent} from './provider/provider.component';
import {OfferComponent} from './offer/offer.component';

@NgModule({
  declarations: [
    AccountComponent,
    RequestComponent,
    ProviderComponent,
    OfferComponent,
    RegisterLoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SharedModule
  ]
})
export class AccountModule {
}
