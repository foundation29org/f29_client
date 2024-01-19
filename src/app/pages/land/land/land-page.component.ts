import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'app/shared/services/events.service';
import { HttpClient } from '@angular/common/http';
import { SortService } from 'app/shared/services/sort.service';
import { Subscription } from 'rxjs/Subscription';

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
    private subscription: Subscription = new Subscription();
    @ViewChild('containerboton', { static: true }) container: ElementRef;
    containerVisible = true;
    private animationInterval: any;
    private audioIntro = new Audio('assets/img/home/animation/sonido1.mp3');

    constructor(private eventsService: EventsService, private http: HttpClient, private sortService: SortService, private route: ActivatedRoute, private router: Router) {
        this.lang = sessionStorage.getItem('lang');
        this.loadNews();
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
            this.loadNews();
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

        this.initAnimation();
    }

    loadNews() {
        this.news = [];
        this.subscription.add(this.http.get('assets/jsons/news_' + this.lang + '.json')
            .subscribe((res: any) => {
                res.sort(this.sortService.GetSortOrderNumber("id"));
                for (var i = 0; i < 3; i++) {
                    this.news.push(res[i])
                }
            }));
    }

    


      initAnimation() {
        const container = this.container.nativeElement;
        const elements = container.getElementsByClassName('animation-element');
        Array.from(elements).forEach((element: HTMLElement) => {
            element.classList.add('moveRandomly');
          });
        for (let element of elements) {
            const x = Math.random() * (container.offsetWidth - element.clientWidth);
            const y = Math.random() * (container.offsetHeight - element.clientHeight);
    
            element.style.left = x + 'px';
            element.style.top = y + 'px';
          }
          this.animationInterval = setInterval(() => {
            for (let element of elements) {
              const x = Math.random() * (container.offsetWidth - element.clientWidth);
              const y = Math.random() * (container.offsetHeight - element.clientHeight);
        
              element.style.left = x + 'px';
              element.style.top = y + 'px';
            }
          }, 4000); // Ajusta este intervalo según la velocidad de la animación deseada
      }

      startAnimation() {
        this.audioIntro.play().catch(error => console.error("Error al reproducir el audio:", error));
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        
        const elements = this.container.nativeElement.getElementsByClassName('animation-element');
      
        // Aplica la animación de temblor
        Array.from(elements).forEach((element: HTMLElement) => {
          element.classList.add('shaking');
          element.classList.remove('moveRandomly');
        });
        //set z-index: 1; to <div id="circle" class="circle">
        var circle = document.getElementById("circle");
        circle.style.zIndex = "1";
      
        // Después de un retraso, cambia a la animación de desplazamiento
        setTimeout(() => {
          Array.from(elements).forEach((element: HTMLElement) => {
            element.classList.remove('shaking');
            
            // Calcula la posición relativa para cada elemento
            const buttonPos = this.getButtonPosition();
            const elementRect = element.getBoundingClientRect();
            const translateX = buttonPos.x - elementRect.left;
            const translateY = buttonPos.y - elementRect.top;
      
            // Aplica la transformación
            element.style.transform = `translate(${translateX}px, ${translateY}px)`;
            element.style.transition = 'transform 2s'; // Asegúrate de ajustar la duración como necesites
            //wait 2 seconds and this.containerVisible = false;
            
          });
          setTimeout(() => {
            //this.containerVisible = false;
            //open web page https://nav29.org/
              window.open("https://nav29.org/", "_blank");
              //reload page
              window.location.reload();
              
          }, 2000); // Tiempo de duración de la animación de desplazamiento
        }, 800); // Tiempo de duración de la animación de temblor
      }

      toggleContainer() {
        this.containerVisible = !this.containerVisible;
      }
      
      getButtonPosition() {
        const button = this.container.nativeElement.querySelector('.circle__btn');
        const rect = button.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + rect.height / 2 + window.scrollY
        };
      }
}
