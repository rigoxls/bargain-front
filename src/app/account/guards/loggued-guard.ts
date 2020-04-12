import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {AuthService} from '../../account/shared/auth.service';
import {Subscription} from 'rxjs';

@Injectable()
export class LogguedGuard implements CanActivate {
  private user = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    try {
      this.user = JSON.parse(atob(localStorage.getItem('user')));
      if (!this.user || !this.user['role']) {
        this.router.navigate(['/products']);
        return false;
      }
    } catch (e) {
      this.router.navigate(['/products']);
      return false;
    }

    return true;
  }
}
