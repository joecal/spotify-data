import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  loading: boolean;

  constructor() {
    this.loading = false;
  }

  set _loading(isLoading: boolean) {
    this.loading = isLoading;
  }

  get _loading(): boolean {
    return this.loading;
  }
}
