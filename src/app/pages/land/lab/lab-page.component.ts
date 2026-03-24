import { Component, OnDestroy, effect } from '@angular/core';
import { trigger, transition, animate } from '@angular/animations';
import { style } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SortService} from 'app/shared/services/sort.service';
import { EventsService } from 'app/shared/services/events.service';

@Component({
    standalone: false,
    selector: 'app-lab-page',
    templateUrl: './lab-page.component.html',
    styleUrls: ['./lab-page.component.scss'],
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

export class LabPageComponent implements OnDestroy {

    private subscription: Subscription = new Subscription();
    lang = 'en';

    constructor(public translate: TranslateService, private http: HttpClient, private eventsService: EventsService, private sortService: SortService) {
        this.lang = this.eventsService.currentLanguage();
        effect(() => {
          const lang = this.eventsService.currentLanguage();
          if (lang != this.lang) {
            this.lang = lang;
          }
        });
    }

    ngOnInit() {
    }

    goto(url){
        window.open(url, "_blank");
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}
