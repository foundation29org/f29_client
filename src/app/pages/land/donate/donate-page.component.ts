import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-donate-page',
    templateUrl: './donate-page.component.html',
    styleUrls: ['./donate-page.component.scss'],
})

export class DonatePageComponent {


    constructor(public translate: TranslateService) {

    }

}
