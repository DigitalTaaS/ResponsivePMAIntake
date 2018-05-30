import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pmahighlighttext'
})
export class PmahighlighttextPipe implements PipeTransform {

  // transform(text: string, [search]): string {
  //   return search ? text.replace(new RegExp(search, 'i'), `<h4><span style="color:blue">${search.toUpperCase()}</span><h4>`) : text;
  // }
  transform(text: any, args: any): any {
    if (!args) {
      return text;
    }
    // Match in a case insensitive maneer
    const re = new RegExp(args, 'gi');
    const match = text.match(re);

    // If there's no match, just return the original value.
    if (!match) {
      return text;
    }

    const value = text.replace(re, "<mark>" + match[0] + "</mark>")
    return value
  }
}
