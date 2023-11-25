import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDuration',
})
export class FormatDurationPipe implements PipeTransform {
  transform(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return hours === 0
      ? `${minutes.toString().padStart(2, '0')} min`
      : `${hours.toString()}h ${minutes.toString().padStart(2, '0')} min`;
  }
}
