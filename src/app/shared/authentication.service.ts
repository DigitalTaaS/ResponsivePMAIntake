import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const API_URL = environment.authAPIURL;


@Injectable()
export class AuthenticationService {
  
  constructor(private http: HttpClient) { }
 
    GetAuthToken(clientId, clientSecret) {
      
      let body = {
        "clientId": "Myeisha.White.lac@gmail.com",
        "clientSecret": "Password1234"
      }
        return this.http.post<any>(API_URL+'/api/auth/tokens?client_id='+clientId+'&client_secret='+clientSecret, body);
    }

}
