import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { EventsService } from 'app/shared/services/events.service';
import { SearchService } from 'app/shared/services/search.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-onenew-page',
    templateUrl: './onenew-page.component.html',
    styleUrls: ['./onenew-page.component.scss'],
})

export class OneNewPageComponent {

    private subscription: Subscription = new Subscription();
    lang = 'en';
    oneNew: any = {};
    public id: string = ''
    loadedNew= false;
    news: any = [];

    constructor(public translate: TranslateService, private http: HttpClient, private eventsService: EventsService, private route: ActivatedRoute, private searchService: SearchService, protected sanitizer: DomSanitizer) {
        this.lang = sessionStorage.getItem('lang');;
        
    }

    ngOnInit() {

        this.eventsService.on('changelang', function (lang) {
            if (lang != this.lang) {
              this.lang = lang;
              this.loadNew();
            }
      
          }.bind(this));

        this.route.params.subscribe((params) => {
            this.id = params?.id
            console.log(this.id);
            this.loadNew();
        })

    }

    loadNew(){
        this.oneNew = {};
        //load countries file
        this.subscription.add(this.http.get('assets/jsons/news_'+this.lang+'.json')
          .subscribe((res: any) => {
            this.news= res;
            var foundElementIndex = this.searchService.searchIndex(this.news, 'id', this.id);
            if(foundElementIndex!=-1){
              this.oneNew = this.news[foundElementIndex];
              this.oneNew.full = this.sanitizer.bypassSecurityTrustHtml(this.oneNew.full);
              console.log(this.oneNew);
            }
          }));
    }

    openNew(actualNew){

    }

}
