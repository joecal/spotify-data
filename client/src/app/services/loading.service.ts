import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoadingService {
  loadingSubject: Subject<boolean>;
  loading: boolean;

  constructor() {
    this.loadingSubject = new Subject<boolean>();
    this.loadingSubject.subscribe((value: boolean) => {
      this.loading = value;
    });
  }

  startLoading() {
    this.loadingSubject.next(true);
  }

  stopLoading() {
    this.loadingSubject.next(false);
  }

  stopLoadingTimeout(timeMs: number) {
    setTimeout(() => {
      this.stopLoading();
    }, timeMs);
  }
}
