import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isValidDate',
})
export class IsValidDatePipe implements PipeTransform {
  transform(str: string): boolean {
    const date = new Date(str);
    return !isNaN(date.getTime());
  }
}
