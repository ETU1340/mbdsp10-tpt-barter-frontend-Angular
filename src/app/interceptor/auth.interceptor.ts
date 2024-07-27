import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const authToken = localStorage.getItem('authToken');
    console.log(authToken);
    if (authToken) {
      const clonedReq = req.clone({
        headers: req.headers.set('x-auth-token', `${authToken}`)
      });
      return next.handle(clonedReq);
    } else {
      return next.handle(req);
    }
  }
}
