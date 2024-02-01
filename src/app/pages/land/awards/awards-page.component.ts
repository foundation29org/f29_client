import { Component } from '@angular/core';
import { trigger, transition, animate } from '@angular/animations';
import { style } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { SortService} from 'app/shared/services/sort.service';
import { EventsService } from 'app/shared/services/events.service';

@Component({
    selector: 'app-awards-page',
    templateUrl: './awards-page.component.html',
    styleUrls: ['./awards-page.component.scss'],
    animations: [
        trigger('slideInOut', [
          transition(':enter', [
            style({ transform: 'translateX(-100%)' }), 
            animate('1s ease-out', style({ transform: 'translateX(0)' }))
          ]),
          transition(':leave', [
            animate('0.5s ease-in', style({ transform: 'translateX(-100%)' }))
          ])
        ])
      ]
})

export class AwardsPageComponent {

    private subscription: Subscription = new Subscription();
    lang = 'en';

    constructor(public translate: TranslateService, private http: HttpClient, private eventsService: EventsService, private sortService: SortService) {
        this.lang = sessionStorage.getItem('lang');;
    }

    ngOnInit() {
        this.eventsService.on('changelang', function (lang) {
            if (lang != this.lang) {
              this.lang = lang;
            }
          }.bind(this));
    }

    goto(url){
        window.open(url, "_blank");
    }
}
