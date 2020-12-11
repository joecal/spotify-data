import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService
  implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): Promise<boolean> {
    return this.checkAccessToken();
  }

  canActivateChild(): Promise<boolean> {
    return this.canActivate();
  }

  canLoad(): Promise<boolean> {
    return this.checkAccessToken();
  }

  async checkAccessToken(): Promise<boolean> {
    const accessToken = this.authService.getAccessToken();
    if (accessToken && !this.authService.isTokenExpired()) {
      return true;
    } else if (accessToken && this.authService.isTokenExpired()) {
      try {
        await this.authService.refreshAccessToken();
        return true;
      } catch (caughtError) {
        console.error(caughtError);
        return false;
      }
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
