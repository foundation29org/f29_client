import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EventsService } from 'app/shared/services/events.service';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
    selector: 'app-land-page',
    templateUrl: './land-page.component.html',
    styleUrls: ['./land-page.component.scss'],
})

export class LandPageComponent implements OnInit {
    lang: string = 'en';
    news: any = [];
    fragment: string;
    @ViewChild('containerboton') containerBoton: ElementRef;
    containerVisible = true;
    private audioIntro = new Audio('assets/img/home/animation/sonido1.mp3');

    part1Options: AnimationOptions = {
      path: 'assets/img/home/animation/part1.json',
      loop: true
    };
    part2Options: AnimationOptions = {
      path: 'assets/img/home/animation/part2.json',
      loop: false
    };

    showPart1: boolean = true;
    audioStarted: boolean = false;
    bottomPosition: string = '0px';
    

    constructor(private eventsService: EventsService, private route: ActivatedRoute, private router: Router, public translate: TranslateService) {
        //this.lang = sessionStorage.getItem('lang');
        if(sessionStorage.getItem('lang') == null){
          sessionStorage.setItem('lang', this.translate.store.currentLang);
        }
        this.lang = this.translate.store.currentLang;
    }


    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.calculateBottomPosition();
    }

    async calculateBottomPosition() {
      await this.delay(100);
      setTimeout(() => {
        // Asegúrate de que ya se haya establecido la referencia a containerBoton
        if (this.containerBoton && this.containerBoton.nativeElement) {
          const containerRect = this.containerBoton.nativeElement.getBoundingClientRect();
          // Ahora usamos las dimensiones del contenedor para los cálculos
          const containerHeight = containerRect.height;
    
          const svgElement = document.querySelector('svg > g[clip-path*="__lottie_element_"]');
          if (svgElement) {
            const svgRect = svgElement.getBoundingClientRect();
            // Ya no dependemos de viewportHeight sino de containerHeight
            let additionalSpace = 13 * 10; // Valor por defecto para pantallas grandes
            additionalSpace = containerHeight / additionalSpace;
            if (containerRect.width > 1000) {
              additionalSpace = additionalSpace + 10;
            }
            const bottom = containerHeight - (svgRect.bottom - containerRect.top) + additionalSpace; // Ajustado para usar la altura del contenedor
            this.bottomPosition = `${bottom}px`;
          }
        }
      });
    }

    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.route.fragment.subscribe(fragment => { this.fragment = fragment; });

        this.eventsService.on('changelang', function (lang) {
            this.lang = lang;
        }.bind(this));
        this.calculateBottomPosition();
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

    // Handler para el evento de animación completada
    animationCreated(animationItem: AnimationItem): void {
      if (!this.showPart1) {
        animationItem.addEventListener('complete', () => {
          window.location.href = 'https://nav29.org/'; // URL a la que navegar
          //window.open("https://nav29.org/", "_blank");
          //window.location.reload();
          this.showPart1 = true;
        });
      }
    }

    // Cambiar la animación al hacer clic en el botón
    toggleAnimation(): void {
      this.showPart1 = false;
      if (!this.audioStarted) {
        this.audioIntro.play().catch(error => console.error("Error al reproducir el audio:", error));
        this.audioStarted = true;
      }
    }

}
