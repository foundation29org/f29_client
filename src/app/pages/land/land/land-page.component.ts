import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    currentHash:string = 'home';
    @ViewChild('containerboton', { static: true }) container: ElementRef;
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
    
    constructor(private eventsService: EventsService, private route: ActivatedRoute, private router: Router) {
        this.lang = sessionStorage.getItem('lang');
    }

    @HostListener('window:scroll', ['$event']) // for window scroll events
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
    }

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

    // Handler para el evento de animación completada
    animationCreated(animationItem: AnimationItem): void {
      if (!this.showPart1) {
        animationItem.addEventListener('complete', () => {
          window.location.href = 'https://nav29.org/'; // URL a la que navegar
          //window.open("https://nav29.org/", "_blank");
          //window.location.reload();
          //this.showPart1 = true;
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
