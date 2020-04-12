import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {AuthService} from '../../account/shared/auth.service';

@Injectable()
export class LogguedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.user || !this.authService.user['role']) {
      this.router.navigate(['/products']);
      return false;
    }

    return true;
  }
}
