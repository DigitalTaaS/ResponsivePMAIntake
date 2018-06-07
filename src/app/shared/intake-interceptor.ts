import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { environment } from '../../environments/environment';

const clientId = environment.clientId;
const clientSecret = environment.clientSecret;

@Injectable()
export class IntakeInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        let headers = new HttpHeaders();
        headers = headers.append("Content-type", "application/json");
        headers = headers.append("Authorization", "Basic " + btoa(clientId+":"+clientSecret));

        const authReq = req.clone({ headers: headers });

        return next.handle(authReq)
            .catch((error, caught) => {
                console.log(error);
                return Observable.throw(error);
            }) as any;
    }
}