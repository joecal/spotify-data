import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<any> {
    let accessToken = this.authService.getAccessToken();
    if (
      accessToken &&
      !this.authService.isTokenExpired() &&
      req.url.includes(environment.spotifyApiBaseUrl)
    ) {
      req = this.setAuthHeader(req, accessToken);
    }
    return next.handle(req);
  }

  private setAuthHeader(
    req: HttpRequest<any>,
    accessToken: string,
  ): HttpRequest<any> {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return req;
  }
}
