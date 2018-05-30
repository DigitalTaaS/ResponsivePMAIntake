import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pmataxoncode',
  pure: false
})
export class PmataxoncodePipe implements PipeTransform {

  transform(value: any, input: string) {
    if (input) {
       if(input==null) return null;
        input = input.toLowerCase();
        return value.filter(function (el: any) {
            return el.name.toLowerCase().indexOf(input) > -1;
        })
    }
    return value;
}
   
  

}
