import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'app/shared/services/events.service';
import { HttpClient } from '@angular/common/http';
import { SortService } from 'app/shared/services/sort.service';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-land-page',
    templateUrl: './land-page.component.html',
    styleUrls: ['./land-page.component.scss'],
})

export class LandPageComponent implements OnInit {
    lang: string = 'en';
    fragment: string;
    currentHash:string = 'home';
    summaryDx29: string = '';
    modalReference: NgbModalRef;
    private subscription: Subscription = new Subscription();

    constructor(private eventsService: EventsService, private http: HttpClient, private sortService: SortService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private translate: TranslateService) {
        this.lang = sessionStorage.getItem('lang');
    }

    /*@HostListener('window:scroll', ['$event']) // for window scroll events
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
    }*/

    ngOnInit() {
        this.route.fragment.subscribe(fragment => { this.fragment = fragment; });

        this.eventsService.on('changelang', function (lang) {
            this.lang = lang;
          
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


    gotoDxGPT(){
        let url = `https://dxgpt.app/?medicalText=${encodeURIComponent(this.summaryDx29)}`;
        window.open(url, '_blank');
    }

    showContentInfoAPP(contentInfoAPP) {
        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            windowClass: 'ModalClass-lg'// xl, lg, sm
        };
        if (this.modalReference != undefined) {
            this.modalReference.close();
            this.modalReference = undefined;
        }
        this.modalReference = this.modalService.open(contentInfoAPP, ngbModalOptions);
    }

    copyText(option: string) {
        if (option === 'opt1') {
            this.summaryDx29 = this.translate.instant('f29.dxgpt.interface.p1.1');
        } else if (option === 'opt2') {
            this.summaryDx29 = this.translate.instant('f29.dxgpt.interface.p1.2');
        }
        
        if (this.modalReference) {
            this.modalReference.close();
            this.modalReference = undefined;
        }
    }

    lauchEvent(action: string) {
        // Puedes implementar aquí la lógica para registrar eventos de analítica
        console.log('Event:', action);
    }
}
