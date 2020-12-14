import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  delay,
  mergeMap,
  retryWhen,
  shareReplay,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class ApiService {
  refreshingToken: boolean;
  maxRequestRetries: number;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private store: Store,
  ) {
    this.refreshingToken = false;
    this.maxRequestRetries = 5;
  }

  async get(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.http
          .get(url)
          .pipe(
            this.delayedRetry(1000, 0, url),
            catchError((caughtError) => {
              console.error(caughtError);
              reject(caughtError);
              return EMPTY;
            }),
          )
          .toPromise()
          .then((response) => response);
        resolve(response);
      } catch (caughtError) {
        console.error(caughtError);
        reject(caughtError);
      }
    });
  }

  delayedRetry = (
    delayMs: number,
    maxRetry = this.maxRequestRetries,
    url: string,
  ) => {
    let retries = maxRetry;
    return (src: Observable<any>) =>
      src.pipe(
        retryWhen((errors: Observable<any>) =>
          errors.pipe(
            delay(delayMs),
            mergeMap(async (error) => {
              if (
                error.status === 401 &&
                url.includes(environment.spotifyApiBaseUrl) &&
                !this.refreshingToken
              ) {
                const accessToken = this.authService.getAccessToken();
                if (accessToken) {
                  this.refreshingToken = true;
                  await this.authService.refreshAccessToken();
                  this.refreshingToken = false;
                } else {
                  this.authService.logOut();
                }
              }
              return retries > 0
                ? of(error)
                : throwError(
                    `Tried to load resource over XHR for ${maxRetry} times without success. Giving Up!`,
                  );
            }),
          ),
        ),
      );
  };

  async getNext(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const items = await this.recursiveGet(url, []);
        resolve(items);
      } catch (caughtError) {
        console.error(caughtError);
        reject(caughtError);
      }
    });
  }

  private async recursiveGet(
    url: string,
    collected: any,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.get(url);
        collected = collected.concat(response.items);
        if (response.next) {
          resolve(this.recursiveGet(response.next, collected));
        } else {
          resolve(collected);
        }
      } catch (caughtError) {
        console.error(caughtError);
        reject(caughtError);
      }
    });
  }

  async post(url: string, body: any, options: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.http
          .post(url, body, options)
          .toPromise()
          .then((response: any) => response);
        resolve(response);
      } catch (caughtError) {
        console.error(caughtError);
        reject(caughtError);
      }
    });
  }
}
