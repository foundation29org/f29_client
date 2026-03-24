import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    var authReq = req.clone({});
    /*if (req.url.indexOf('https://bookf29.azurewebsites.net') > -1) {
      const headers = req.headers
      .set('x-api-key', environment.Server_Key);
      authReq = req.clone({ headers });
    }*/
    const headers = req.headers
      .set('x-api-key', environment.Server_Key);
      authReq = req.clone({ headers });

    // Pass on the cloned request instead of the original request.
    return next.handle(authReq).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    ) as any;
  }
}
