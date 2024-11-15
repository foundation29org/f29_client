import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-donate-page',
    templateUrl: './donate-page.component.html',
    styleUrls: ['./donate-page.component.scss'],
})

export class DonatePageComponent {

    @ViewChild('donorboxWidget') donorboxWidget!: ElementRef;
    constructor(public translate: TranslateService) {

    }

    ngAfterViewInit() {
        // Aquí ya está disponible el elemento
      }
    
      scrollToWidget() {
        if (this.donorboxWidget) {
          this.donorboxWidget.nativeElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
}
