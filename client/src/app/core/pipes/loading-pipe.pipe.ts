import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loadingPipe',
})
export class LoadingPipePipe implements PipeTransform {
  transform(isLoading: boolean): boolean {
    if (isLoading) {
      return true;
    } else {
      return false;
    }
  }
}
