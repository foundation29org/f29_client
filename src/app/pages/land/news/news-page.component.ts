import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { SortService} from 'app/shared/services/sort.service';
import { EventsService } from 'app/shared/services/events.service';

@Component({
    selector: 'app-news-page',
    templateUrl: './news-page.component.html',
    styleUrls: ['./news-page.component.scss'],
})

export class NewsPageComponent {

    private subscription: Subscription = new Subscription();
    lang = 'en';
    news: any = [];

    constructor(public translate: TranslateService, private http: HttpClient, private eventsService: EventsService, private sortService: SortService) {
        this.lang = sessionStorage.getItem('lang');;
        this.loadNews();
    }

    ngOnInit() {

        this.eventsService.on('changelang', function (lang) {
            if (lang != this.lang) {
              this.lang = lang;
              this.loadNews();
            }
      
          }.bind(this));

    }

    loadNews(){
        this.news = [];
        //load countries file
        this.subscription.add(this.http.get('assets/jsons/news_'+this.lang+'.json')
          .subscribe((res: any) => {
            res.sort(this.sortService.GetSortOrderNumber("id"));
            this.news= res;
          }));
    }

}
