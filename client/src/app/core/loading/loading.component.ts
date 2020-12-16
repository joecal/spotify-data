import { Component } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'spotify-data-loading',
  template: ` <mat-progress-bar
    *ngIf="loadingService.loading"
    color="accent"
    mode="indeterminate"
  ></mat-progress-bar>`,
  styles: [],
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
