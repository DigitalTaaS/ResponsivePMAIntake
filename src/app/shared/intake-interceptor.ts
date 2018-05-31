import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';

@Injectable()
export class IntakeInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        let headers = new HttpHeaders();
        headers = headers.append("Content-type", "application/json");
        headers = headers.append("Authorization", "Basic " + btoa("966b9d649e724d3887c6db7c1468af53:489402D0779543F8aDaFd10c6d4A03D4"));

        const authReq = req.clone({ headers: headers });

        return next.handle(authReq)
            .catch((error, caught) => {
                console.log(error);
                return Observable.throw(error);
            }) as any;
    }
}