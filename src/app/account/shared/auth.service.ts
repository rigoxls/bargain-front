import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../../messages/message.service';
import {User, Roles} from '../../models/user.model';

import {config} from '../../shared/config';

@Injectable()
export class AuthService {
  public user: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.user = null;
  }

  async emailSignUp(formData) {
    formData.role = (formData.userType === 1) ? 'CLIENT' : 'PROVIDER';
    await this.http.post<any>(`${config.backUrl}auth/signup`, formData).subscribe(data => {
        this.messageService.add('Ha creado su cuenta de usuario satisfactoriamente, por favor proceda a realizar logIn');
      },
      error => {
        this.messageService.addError(error.error.message);
        throw Error('Error');
      });
  }

  async emailLogin(email: string, password: string) {
    const formData = {
      email,
      password
    };
    await this.http.post<any>(`${config.backUrl}auth/signin`, formData).subscribe(data => {
        this.messageService.add('Autenticación exitosa !');
        this.user = data;
        localStorage.setItem('user', btoa(JSON.stringify(data)));
        return data;
      },
      error => {
        this.messageService.addError(error.error.message);
        throw Error('Error');
      });
  }

  public signOut() {

  }
}
