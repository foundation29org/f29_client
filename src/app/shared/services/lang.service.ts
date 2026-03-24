import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'environments/environment';
import { SortService} from 'app/shared/services/sort.service';
import { map } from 'rxjs/operators';

@Injectable()
export class LangService {

    private readonly _langs = signal<any[]>([]);
    readonly langs = this._langs.asReadonly();

    constructor(public translate : TranslateService, private http: HttpClient, private sortService: SortService) {}


    getLangs(){
      //load the available languages
      return this.http.get(environment.api+'/api/langs').pipe(
        map((res : any) => {
            res.sort(this.sortService.GetSortOrder("order"));
            this._langs.set(res);
            return res;
         })
      )
    }

    loadDataJson(lang: string){
      //cargar las palabras del idioma
      return this.http.get(environment.api+'/assets/i18n/'+lang+'.json').pipe(
        map((res : any) => {
            return { lang: lang, jsonData: res };
         })
      )
    }

}
