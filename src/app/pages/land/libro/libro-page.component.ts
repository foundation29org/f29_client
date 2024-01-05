import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { SortService} from 'app/shared/services/sort.service';
import { EventsService } from 'app/shared/services/events.service';

@Component({
    selector: 'app-libro-page',
    templateUrl: './libro-page.component.html',
    styleUrls: ['./libro-page.component.scss'],
})

export class LibroPageComponent {

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
}
