import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'environments/environment';
import { SortService } from 'app/shared/services/sort.service';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, merge, mergeMap, concatMap } from 'rxjs/operators'

@Injectable()
export class OpenAiService {
    constructor(private http: HttpClient, private sortService: SortService) {}

    postOpenAi(info){
      return this.http.post(environment.api + '/api/callopenai', info)
      .pipe(map((res: any) => {
        return res;
      }))
    }

    postOpenAi3(info){
      // return this.http.post('https://langchainraito.azurewebsites.net/api/HttpTrigger2', info)
      return this.http.post(environment.api + '/api/callbook', info)
      .pipe(map((res: any) => {
        return res;
      }))
    }

    postCallGuia(info){
      // return this.http.post('https://langchainraito.azurewebsites.net/api/HttpTrigger2', info)
      return this.http.post(environment.api + '/api/callguia', info)
      .pipe(map((res: any) => {
        return res;
      }))
    }

    postCallIaClaro(info){
      return this.http.post(environment.api + '/api/calliaClaro', info)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
    }


}
