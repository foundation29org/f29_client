import { Component, OnDestroy, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SortService} from 'app/shared/services/sort.service';
import { EventsService } from 'app/shared/services/events.service';

@Component({
    standalone: false,
    selector: 'app-news-page',
    templateUrl: './news-page.component.html',
    styleUrls: ['./news-page.component.scss'],
})

export class NewsPageComponent implements OnDestroy {

    private subscription: Subscription = new Subscription();
    lang = 'en';
    news: any = [];

    constructor(public translate: TranslateService, private http: HttpClient, private eventsService: EventsService, private sortService: SortService) {
        this.lang = this.eventsService.currentLanguage();
        effect(() => {
          const lang = this.eventsService.currentLanguage();
          if (lang != this.lang) {
            this.lang = lang;
            this.loadNews();
          }
        });
        this.loadNews();
    }

    ngOnInit() {
    }

    loadNews(){
        this.news = [];
        //load countries file
        this.subscription.add(this.http.get('assets/jsons/news_'+this.lang+'.json')
          .subscribe((res: any) => {
            res.sort(this.sortService.GetSortOrderNumber("id"));
            this.news= res;
            document.getElementById('init').scrollIntoView({behavior: "smooth"});
          }));
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }

}
