import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../../messages/message.service';

import {config} from '../../shared/config';
import {logger} from 'codelyzer/util/logger';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AuthService {
  public userSubject: Subject<any> = new Subject<any>();
  public user: Observable<any> = this.userSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    try {
      setTimeout(() => {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
          this.userSubject.next(JSON.parse(atob(userInfo)));
        }
      }, 50);

    } catch (e) {
      logger.error(e);
    }
  }

  async emailSignUp(formData) {
    switch (parseInt(formData.userType, 10)) {
      case 1:
        formData.role = 'CLIENT';
        break;
      case 2:
        formData.role = 'PROVIDER';
        break;
      case 3:
        formData.role = 'EXTERNAL_PROVIDER';
        break;
    }

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
        setTimeout(() => {
          this.userSubject.next(data);
        }, 50);
        localStorage.setItem('user', btoa(JSON.stringify(data)));
        if (data.role === 'CLIENT') {
          this.router.navigate(['/account/client']);
        } else if (data.role === 'PROVIDER') {
          this.router.navigate(['/account/provider']);
        } else if (data.role === 'EXTERNAL_PROVIDER') {
          this.router.navigate(['/account/external-provider']);
        }

        return data;
      },
      error => {
        this.messageService.addError(error.error.message);
        throw Error('Error');
      });
  }

  public signOut() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
