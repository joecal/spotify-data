import { Component, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'spotify-data-card-header',
  template: `
    <mat-card-header>
      <mat-card-title
        *ngIf="title"
        class="elipsis"
        #titleElement
        #titleTooltip="matTooltip"
        matTooltip="{{ tooltipMessage }}"
        (mouseover)="isTextOverflowing(titleElement, titleTooltip)"
        >{{ title }}</mat-card-title
      >
      <mat-card-subtitle
        *ngIf="subTitle"
        #subTitleElement
        class="elipsis"
        #subTitleTooltip="matTooltip"
        matTooltip="{{ tooltipMessage }}"
        (mouseover)="
          isTextOverflowing(subTitleElement, subTitleTooltip)
        "
      >
        {{ subTitle }}</mat-card-subtitle
      >
    </mat-card-header>
  `,
  styles: [],
})
export class CardHeaderComponent {
  tooltipMessage: string = '';
  @Input() title: string;
  @Input() subTitle: string;

  isTextOverflowing(element: HTMLElement, toolTip: MatTooltip) {
    if (element.scrollWidth > element.clientWidth) {
      this.tooltipMessage = element.innerText;
      toolTip.disabled = false;
      toolTip.show();
    }
  }
}
