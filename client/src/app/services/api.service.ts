import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

enum Method {
  get = 'get',
  put = 'put',
  patch = 'patch',
  post = 'post',
  delete = 'delete',
}

interface HandleAuthError {
  resolve: any;
  url: string;
  method: Method;
  body: any;
  options: any;
}

@Injectable()
export class ApiService {
  private refreshingToken: boolean;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.refreshingToken = false;
  }

  async get(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.http
          .get(url)
          .toPromise()
          .then((response) => response);
        resolve(response);
      } catch (caughtError) {
        if (
          caughtError.status &&
          caughtError.status === 401 &&
          url.includes(environment.spotifyApiBaseUrl)
        ) {
          const authErrorObj: HandleAuthError = {
            resolve: resolve,
            url: url,
            method: Method.get,
            body: null,
            options: null,
          };
          this.handleAuthError(authErrorObj);
        } else {
          console.error(caughtError);
          reject(caughtError);
        }
      }
    });
  }

  private async handleAuthError(authErrorObj: HandleAuthError) {
    const accessToken = this.authService.getAccessToken();
    if (accessToken && !this.refreshingToken) {
      this.refreshingToken = true;
      await this.authService.refreshAccessToken();
      this.refreshingToken = false;
      this.resolveAuthError(authErrorObj);
    } else if (
      (!accessToken && this.refreshingToken) ||
      (accessToken && this.refreshingToken)
    ) {
      let interval: any = setInterval(() => {
        console.log(1);
        if (!this.refreshingToken) {
          clearInterval(interval);
          interval = null;
          this.resolveAuthError(authErrorObj);
        }
      }, 0);
      setTimeout(() => {
        if (interval) {
          clearInterval(interval);
          interval = null;
          this.resolveAuthError(authErrorObj);
          // show loading
        }
      }, 5000);
    } else {
      this.authService.logOut();
      authErrorObj.resolve(true);
    }
  }

  private resolveAuthError(authErrorObj: HandleAuthError): void {
    switch (authErrorObj.method) {
      case Method.get:
        authErrorObj.resolve(this.get(authErrorObj.url));
        break;
      case Method.post:
        authErrorObj.resolve(
          this.post(
            authErrorObj.url,
            authErrorObj.body,
            authErrorObj.options,
          ),
        );
        break;
    }
  }

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
        if (
          caughtError.status &&
          caughtError.status === 401 &&
          url.includes(environment.spotifyApiBaseUrl)
        ) {
          const authErrorObj: HandleAuthError = {
            resolve: resolve,
            url: url,
            method: Method.post,
            body: body,
            options: options,
          };
          this.handleAuthError(authErrorObj);
        } else {
          console.error(caughtError);
          reject(caughtError);
        }
      }
    });
  }
}
