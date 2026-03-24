import { Component, OnInit, OnDestroy, HostListener, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'app/shared/services/events.service';
import { HttpClient } from '@angular/common/http';
import { SortService } from 'app/shared/services/sort.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    standalone: false,
    selector: 'app-land-page',
    templateUrl: './land-page.component.html',
    styleUrls: ['./land-page.component.scss'],
})

export class LandPageComponent implements OnInit, OnDestroy {
    lang: string = 'en';
    fragment: string;
    currentHash:string = 'home';
    summaryDx29: string = '';
    heroTitle1: string = '';
    heroTitle2: string = '';
    heroDescription: string = '';
    modalReference: NgbModalRef;
    private subscription: Subscription = new Subscription();
    private readonly heroCopyByLang: Record<string, { title1: string; title2: string; description: string }> = {
      en: {
        title1: 'REVOLUTIONIZING HEALTHCARE <br>WITH TECHNOLOGY',
        title2: 'BREAKING BARRIERS... <br>TO LEAVE NO ONE BEHIND',
        description: "We rebel against an obsolete healthcare system.<br>We use AI to tear down barriers that exclude millions of people.<br>We don't ask for permission... sometimes we ask for forgiveness.<br>We radically transform access to healthcare, ensuring no one is left behind.<br>The healthcare revolution starts here."
      },
      es: {
        title1: 'REVOLUCIONANDO EL SISTEMA SANITARIO <br>CON TECNOLOGÍA',
        title2: 'ROMPIENDO BARRERAS... <br>PARA NO DEJAR A NADIE ATRÁS',
        description: 'Nos rebelamos contra un sistema sanitario obsoleto.<br>Utilizamos la IA para derribar las barreras que excluyen a millones de personas.<br>No pedimos permiso... a veces pedimos perdón.<br>Transformamos radicalmente el acceso a la salud, asegurando que nadie quede atrás.<br>La revolución de la salud comienza aquí.'
      }
    };

    constructor(private eventsService: EventsService, private http: HttpClient, private sortService: SortService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private translate: TranslateService) {
        this.lang = this.eventsService.currentLanguage();
        this.setHeroContent(this.lang);
        effect(() => {
          const currentLang = this.eventsService.currentLanguage();
          this.lang = currentLang;
          this.setHeroContent(currentLang);
        });
    }

    private setHeroContent(lang: string): void {
      const normalizedLang = lang === 'es' ? 'es' : 'en';
      const fallback = this.heroCopyByLang[normalizedLang];
      this.heroTitle1 = fallback.title1;
      this.heroTitle2 = fallback.title2;
      this.heroDescription = fallback.description;
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
        this.subscription.add(this.route.fragment.subscribe(fragment => { this.fragment = fragment; }));

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
            container: 'body',
            scrollable: true,
            windowClass: 'ModalClass-lg dxgpt-help-modal-window',// xl, lg, sm
            backdropClass: 'dxgpt-help-modal-backdrop'
        };
        this.modalService.dismissAll();
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

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}
