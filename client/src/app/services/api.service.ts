import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  async get(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.http
          .get(url)
          .toPromise()
          .then((response: any) => response);
        resolve(response);
      } catch (caughtError) {
        console.error(caughtError);
        reject(caughtError);
      }
    });
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
        console.error(caughtError);
        reject(caughtError);
      }
    });
  }
}
