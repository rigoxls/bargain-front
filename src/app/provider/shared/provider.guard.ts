import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {AuthService} from '../../account/shared/auth.service';

@Injectable()
export class ProviderGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  public canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.user['role'] === 'PROVIDER') {
      return true;
    }
    this.router.navigate(['/register-login']);
    return false;
  }
}
