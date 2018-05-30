import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient ,HttpResponse} from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
  
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';

@Injectable()
export class DegreeautosearchService {
   
  endPoint: string;  
  constructor(private http: HttpClient) {  
      this.endPoint = "/assets/degrees.json";  
  }  
   search(term: string) : Observable<any[]> {  
    console.log("search string" + term)

    
    //var a= this.http.get<any[]>(this.endPoint). 
   return this.http.get<any[]>(this.endPoint)
    .filter( stud => stud[1].name != term)
     
   
    
      
    //return this.http.get<any[]>(this.endPoint).filter(i=>i[0].name.indexOf(term) !=-1);
     
      // working code for US 955
    // var degreeList = this.http.get(this.endPoint + '?term=' + term)
    //   .map((r: Response) => { return (r!= null ? r : [{ "id": "0", "name": "No Record Found" }]) as any[] });
    //     return degreeList;  
     
    
  } 
  


}