import { Component, OnInit } from '@angular/core';
import { EventsService } from 'app/shared/services/events.service';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SortService} from 'app/shared/services/sort.service';
import { Subscription } from 'rxjs/Subscription';
import { TermsConditionsPageComponent } from "../../content-pages/terms-conditions/terms-conditions-page.component";

@Component({
    selector: 'app-land-page',
    templateUrl: './land-page.component.html',
    styleUrls: ['./land-page.component.scss'],
})

export class LandPageComponent implements OnInit {
    isApp: boolean = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1 && location.hostname != "localhost" && location.hostname != "127.0.0.1";
    iconjsd: string = 'assets/img/land/logos/sjd_en.png';
    iconmoh: string = 'assets/img/land/logos/MoH_en.png';
    lang: string = 'en';
    news: any = [];
    modalReference: NgbModalRef;
    private subscription: Subscription = new Subscription();

    constructor(private eventsService: EventsService, private modalService: NgbModal, private http: HttpClient, private sortService: SortService) {
        this.lang = sessionStorage.getItem('lang');
        if (this.lang == 'uk') {
            this.iconmoh = 'assets/img/land/logos/MoH_uk.png';
        }else{
            this.iconmoh = 'assets/img/land/logos/MoH_en.png';
        }
        if (this.lang == 'es') {
            this.iconjsd = 'assets/img/land/logos/sjd_es.png';
        } else {
            this.iconjsd = 'assets/img/land/logos/sjd_en.png';
        }
        this.loadNews();
    }

    ngOnInit() {

        this.eventsService.on('changelang', function (lang) {
            this.lang = lang;
            if (this.lang == 'uk') {
                this.iconmoh = 'assets/img/land/logos/MoH_uk.png';
            }else{
                this.iconmoh = 'assets/img/land/logos/MoH_en.png';
            }
            if (this.lang == 'es') {
                this.iconjsd = 'assets/img/land/logos/sjd_es.png';
            } else {
                this.iconjsd = 'assets/img/land/logos/sjd_en.png';
            }
            this.loadNews();
        }.bind(this));

    }


    goTo() {
        document.getElementById('waysoptions').scrollIntoView(true);
    }

    loadNews(){
        this.news = [];
        //load countries file
        this.subscription.add(this.http.get('assets/jsons/news_'+this.lang+'.json')
          .subscribe((res: any) => {
            res.sort(this.sortService.GetSortOrderNumber("id"));
            for (var i = 0; i < 3; i++) {
                this.news.push(res[i])
            }
           // this.news= res;
          }));
    }


}
