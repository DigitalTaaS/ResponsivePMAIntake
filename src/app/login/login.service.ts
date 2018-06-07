import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';
import { error } from 'util';

const API_URL = environment.authAPIURL;
const clientId = environment.clientId;
const clientSecret = environment.clientSecret;

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }
 
    login(userId, password) {
      
      let body = {
        "clientId": userId,
        "clientSecret": password
      }
        return this.http.post<any>(API_URL+'/api/auth/tokens?client_id='+clientId+'&client_secret='+clientSecret, body)
        .map(user => {
          if (user && user.accessToken) {
              localStorage.setItem('accesstoken', JSON.stringify(user.accessToken));
          }
          else{
            return null;
          }

          return user;
          }, error => {
            return null;
        }
      );
    }

    logout() {
      localStorage.removeItem('accesstoken');
  }

}
