import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private refreshingToken: boolean;
  private queuedRequests: HttpRequest<any>[];

  constructor(private authService: AuthService) {
    this.refreshingToken = false;
    this.queuedRequests = [];
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> | any {
    const accessToken = this.authService.getAccessToken();
    if (
      accessToken &&
      !this.authService.isTokenExpired() &&
      req.url.includes(environment.spotifyApiBaseUrl)
    ) {
      return next.handle(this.setAuthHeader(req));
    } else if (
      accessToken &&
      this.authService.isTokenExpired() &&
      req.url.includes(environment.spotifyApiBaseUrl)
    ) {
      this.retryRequest(req, next);
    } else {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('HttpErrorResponse error: ', error);
          if (
            accessToken &&
            error.status === 401 &&
            req.url.includes(environment.spotifyApiBaseUrl)
          ) {
            console.log('401 error: ', error);
            this.retryRequest(req, next);
          }
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log('this is client side error');
            errorMsg = `Error: ${error.error.message}`;
          } else {
            console.log('this is server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
          }
          console.log(errorMsg);
          return throwError(errorMsg);
        }),
      );
    }
  }

  private async retryRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
  ) {
    if (this.refreshingToken) {
      this.queuedRequests.push(req);
    } else if (
      !this.refreshingToken &&
      this.queuedRequests.length > 0
    ) {
      this.resumeQueuedRequests(next);
    } else if (
      !this.refreshingToken &&
      this.queuedRequests.length === 0
    ) {
      await this.authService.refreshAccessToken();
      this.refreshingToken = false;
      return next.handle(this.setAuthHeader(req));
    }
    return;
  }

  private setAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    const accessToken = this.authService.getAccessToken();
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return req;
  }

  private async resumeQueuedRequests(next: HttpHandler) {
    const start = async () => {
      await this.asyncForEach(
        this.queuedRequests,
        async (req: HttpRequest<any>) => {
          await next.handle(this.setAuthHeader(req)).toPromise();
          const index = this.queuedRequests.indexOf(req);
          if (index > -1) {
            this.queuedRequests.splice(index, 1);
          }
        },
      );
      if (this.queuedRequests.length > 0) {
        this.resumeQueuedRequests(next);
      }
    };
    start();
  }

  private async asyncForEach(array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
