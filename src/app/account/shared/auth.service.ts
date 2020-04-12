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
        this.userSubject.next(data);
        localStorage.setItem('user', btoa(JSON.stringify(data)));
        this.router.navigate(['/account/requests']);
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
