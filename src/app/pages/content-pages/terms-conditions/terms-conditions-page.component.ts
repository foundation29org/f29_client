import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-terms-conditions-page',
    templateUrl: './terms-conditions-page.component.html',
    styleUrls: ['./terms-conditions-page.component.scss']
})

export class TermsConditionsPageComponent implements OnInit{
  showSecurity: boolean = false;
  constructor(public activeModal: NgbActiveModal, public translate: TranslateService) {
    setTimeout(function () {
        this.goTo('initpos');
    }.bind(this), 100);

  }

  ngOnInit() {
  }

}
