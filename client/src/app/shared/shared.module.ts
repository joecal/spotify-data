import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ScrollingModule,
    CdkTableModule,
    TableVirtualScrollModule,
    CarouselModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    ScrollingModule,
    CdkTableModule,
    TableVirtualScrollModule,
    CarouselModule,
  ],
})
export class SharedModule {}
