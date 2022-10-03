import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    currentHash:string = 'home';
    private subscription: Subscription = new Subscription();

    constructor(private eventsService: EventsService, private http: HttpClient, private sortService: SortService, private route: ActivatedRoute, private router: Router) {
        this.lang = sessionStorage.getItem('lang');
        this.loadNews();
    }

    @HostListener('window:scroll', ['$event']) // for window scroll events
    onScroll(event) {
      let elements = document.getElementsByClassName("anchor_tags");
      var found =false;
      var indexFound = 0;
      for (var i = 0; i < elements.length; i++) {
        var top = window.pageYOffset;
        var distance = top - $(elements[i]).offset().top;
        if(distance>0 && elements[i].id!= this.currentHash){
          indexFound = i;
          this.currentHash = elements[indexFound].id;
          found = true;
          
        }
      }
      if(found){
        this.router.navigate(['/'], { fragment: this.currentHash});
      }
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
