import { 
    HttpHandler,
    HttpInterceptor,
    HttpRequest
 } from '@angular/common/http';
import { Injectable } from '@angular/core';

 @Injectable()

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authTonen = localStorage.getItem('access_token');
        if (!authTonen) {
            return next.handle(req)
        }

        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authTonen)
        });

        return next.handle(authRequest);
    }
};
