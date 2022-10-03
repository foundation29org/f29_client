import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from 'app/shared/services/events.service';
import { HttpClient } from '@angular/common/http';
import { SortService } from 'app/shared/services/sort.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-land-page',
    templateUrl: './land-page.component.html',
    styleUrls: ['./land-page.component.scss'],
})

export class LandPageComponent implements OnInit {
    lang: string = 'en';
    news: any = [];
    fragment: string;
    private subscription: Subscription = new Subscription();

    constructor(private eventsService: EventsService, private http: HttpClient, private sortService: SortService, private route: ActivatedRoute) {
        this.lang = sessionStorage.getItem('lang');
        this.loadNews();
    }

    ngOnInit() {
        this.route.fragment.subscribe(fragment => { this.fragment = fragment; });

        this.eventsService.on('changelang', function (lang) {
            this.lang = lang;
            this.loadNews();
        }.bind(this));
    }

    ngAfterViewInit(): void {
        try {
            setTimeout(function () {
                if (this.fragment != null) {
                    document.getElementById(this.fragment).scrollIntoView({behavior: "smooth"});
                }
            }.bind(this), 200);
        } catch (e) { }
    }

    loadNews() {
        this.news = [];
        this.subscription.add(this.http.get('assets/jsons/news_' + this.lang + '.json')
            .subscribe((res: any) => {
                res.sort(this.sortService.GetSortOrderNumber("id"));
                for (var i = 0; i < 3; i++) {
                    this.news.push(res[i])
                }
            }));
    }

}
