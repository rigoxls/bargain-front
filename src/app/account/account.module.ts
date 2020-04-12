import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { ProfileComponent } from './profile/profile.component';
import { RequestComponent } from './request/request.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { AccountComponent } from './account.component';

@NgModule({
    declarations: [
        AccountComponent,
        ProfileComponent,
        RequestComponent,
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
export class AccountModule {}
