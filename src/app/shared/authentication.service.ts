import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/http';
import { environment } from '../../environments/environment';

const API_URL = environment.authAPIURL;

@Injectable()
export class AuthenticationService {
  
  constructor(private http: HttpClient) { }
 
    GetAuthToken(clientId: string, clientSecret: string) {
        return this.http.post<any>(API_URL+'/api/auth/tokens?client_id='+clientId+'&client_secret='+clientSecret, null)
            .map(response => {
                if (response && response.accessToken) {
                  console.log(response.accessToken);
                    localStorage.setItem('authToken', JSON.stringify(response.accessToken));
                }
 
                return response;
            });
    }

}
