import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { EventsService } from 'app/shared/services/events.service';
import { Injectable, Injector } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-dx29',
  templateUrl: './navbar-dx29.component.html',
  styleUrls: ['./navbar-dx29.component.scss']
})

@Injectable()
export class NavbarD29Component implements OnInit, AfterViewInit, OnDestroy {
  currentLang = 'en';
  toggleClass = 'ft-maximize';
  placement = "bottom-right";
  public isCollapsed = true;
  layoutSub: Subscription;
  @Output()
  toggleHideSidebar = new EventEmitter<Object>();

  public config: any = {};
  langs: any;
  isHomePage: boolean = false;
  isiniciativesPage: boolean = false;
  isthefoundationPage: boolean = false;
  isEcosystemPage: boolean = false;
  isAwardsPage: boolean = false;
  isContactPage: boolean = false;
  isDonatePage: boolean = false;
  isDxgptPage: boolean = false;
  currentHash:string = 'home';
  
  private subscription: Subscription = new Subscription();

  // Variable para controlar si estamos en medio de un desplazamiento suave
  private isScrolling: boolean = false;

  constructor(public translate: TranslateService, private layoutService: LayoutService, private configService: ConfigService, private router: Router, private inj: Injector) {

    this.loadLanguages();

    /*this.router.events.filter((event: any) => event instanceof NavigationEnd).subscribe(
      event => {
        var tempUrl = (event.url).toString();
        this.checkRoute(tempUrl);
      }
    );*/


    this.layoutSub = layoutService.changeEmitted$.subscribe(
      direction => {
        const dir = direction.direction;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      });
  }

  // Función para resetear todos los estados de página
  resetAllPageStates() {
    this.isHomePage = false;
    this.isiniciativesPage = false;
    this.isthefoundationPage = false;
    this.isEcosystemPage = false;
    this.isAwardsPage = false;
    this.isContactPage = false;
    this.isDonatePage = false;
    this.isDxgptPage = false;
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
    onScroll(event) {
      // Evitar procesamiento innecesario si estamos en medio de un desplazamiento suave
      if (this.isScrolling) return;
      
      let elements = document.getElementsByClassName("anchor_tags");
      var found = false;
      var indexFound = 0;
      var currentScrollPosition = window.pageYOffset;
      
      // Primero intentamos encontrar la sección actual basada en la posición de scroll
      for (var i = 0; i < elements.length; i++) {
        var elementPosition = $(elements[i]).offset().top;
        var elementHeight = $(elements[i]).height();
        var viewportHeight = window.innerHeight;
        
        // Calculamos si el elemento está visible en el viewport
        // Un elemento está visible si:
        // 1. La parte superior del elemento está por encima de la parte inferior de la ventana
        // 2. La parte inferior del elemento está por debajo de la parte superior de la ventana
        var isVisible = (
          elementPosition < (currentScrollPosition + viewportHeight) &&
          (elementPosition + elementHeight) > currentScrollPosition
        );
        
        // Si el elemento es visible y no es el hash actual, lo seleccionamos
        if (isVisible && elements[i].id != this.currentHash) {
          // Para la sección de premios, verificamos que estemos realmente en esa sección
          if (elements[i].id === 'awards') {
            // Verificar si estamos más cerca de awards que de contact
            var contactElement = document.getElementById('contact');
            if (contactElement) {
              var contactPosition = $(contactElement).offset().top;
              // Si estamos más cerca de awards que de contact, seleccionamos awards
              if (Math.abs(currentScrollPosition - elementPosition) < 
                  Math.abs(currentScrollPosition - contactPosition)) {
                indexFound = i;
                this.currentHash = elements[indexFound].id;
                found = true;
                break;
              }
            } else {
              // Si no hay elemento contact, simplemente seleccionamos awards
              indexFound = i;
              this.currentHash = elements[indexFound].id;
              found = true;
              break;
            }
          } 
          // Para la sección de contacto, verificamos que estemos realmente en esa sección
          else if (elements[i].id === 'contact') {
            // Solo seleccionamos contact si estamos muy cerca de él
            var distanceToContact = Math.abs(currentScrollPosition - elementPosition);
            if (distanceToContact < 300) { // Ajustar este valor según sea necesario
              indexFound = i;
              this.currentHash = elements[indexFound].id;
              found = true;
              break;
            }
          }
          // Para otras secciones, las seleccionamos normalmente
          else {
            indexFound = i;
            this.currentHash = elements[indexFound].id;
            found = true;
            break;
          }
        }
      }
      
      //console.log("Current hash (scroll): " + this.currentHash);
      if (found) {
        this.checkStep(this.currentHash);
      }
    }


  checkStep(step) {
    // Resetear todos los estados primero
    this.resetAllPageStates();
    switch(step) {
      case 'home':
        this.isHomePage = true;
        break;
      case 'iniciatives':
        this.isiniciativesPage = true;
        break;
      case 'thefoundation':
        this.isthefoundationPage = true;
        break;
      case 'ecosystem':
        this.isEcosystemPage = true;
        break;
      case 'awards':
        this.isAwardsPage = true;
        break;
      case 'contact':
        this.isContactPage = true;
        break;
      case 'donate':
        this.isDonatePage = true;
        break;
      case 'dxgpt':
        this.isDxgptPage = true;
        break;
    }
  }

  goTo(step) {    
    // Caso especial para contacto
    if (step === 'contact') {
      this.resetAllPageStates();
      this.isContactPage = true;
      this.currentHash = 'contact';
      
      // Obtener la posición del elemento
      const element = document.getElementById(step);
      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Calcular la posición de desplazamiento
        const y = rect.top + window.pageYOffset;
        
        // Marcar que estamos en medio de un desplazamiento suave
        this.isScrolling = true;
        
        // Realizar el desplazamiento suave
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Restablecer la bandera después de un tiempo
        setTimeout(() => {
          this.isScrolling = false;
          // Verificar nuevamente que estamos en la sección correcta
          this.resetAllPageStates();
          this.isContactPage = true;
        }, 1000);
      } else {
        this.router.navigate(['/'], { fragment: step });
      }
      return;
    }
    
    // Caso especial para premios
    if (step === 'awards') {
      this.resetAllPageStates();
      this.isAwardsPage = true;
      this.currentHash = 'awards';
      
      // Obtener la posición del elemento
      const element = document.getElementById(step);
      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Calcular la posición de desplazamiento
        const y = rect.top + window.pageYOffset;
        
        // Marcar que estamos en medio de un desplazamiento suave
        this.isScrolling = true;
        
        // Realizar el desplazamiento suave
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Restablecer la bandera después de un tiempo y verificar que seguimos en la sección correcta
        setTimeout(() => {
          this.isScrolling = false;
          // Verificar nuevamente que estamos en la sección correcta
          this.resetAllPageStates();
          this.isAwardsPage = true;
        }, 1000);
      } else {
        this.router.navigate(['/'], { fragment: step });
      }
      return;
    }
    
    // Para los demás casos, usar el comportamiento normal
    this.checkStep(step);
    
    // Realizar el desplazamiento
    if(document.getElementById(step) == null) {
      this.router.navigate(['/'], { fragment: step });
    } else {
      // Obtener la posición del elemento
      const element = document.getElementById(step);
      const rect = element.getBoundingClientRect();
      
      // Calcular la posición de desplazamiento teniendo en cuenta el estilo de anchor_tags
      // No necesitamos añadir un offset adicional porque el estilo CSS ya lo hace
      const y = rect.top + window.pageYOffset;
      
      // Marcar que estamos en medio de un desplazamiento suave
      this.isScrolling = true;
      
      // Realizar el desplazamiento suave
      window.scrollTo({ top: y, behavior: 'smooth' });
      
      // Actualizar el hash actual
      this.currentHash = step;
      
      // Restablecer la bandera después de un tiempo
      setTimeout(() => {
        this.isScrolling = false;
        // Verificar nuevamente que estamos en la sección correcta
        this.checkStep(step);
      }, 1000); // Ajustar según sea necesario
    }
  }

  checkRoute(tempUrl) {
    //console.log("Verificando ruta: " + tempUrl);
    
    // Caso especial para contacto
    if (tempUrl.indexOf('#contact') != -1) {
      //console.log("URL de contacto detectada: " + tempUrl);
      this.resetAllPageStates();
      this.isContactPage = true;
      this.currentHash = 'contact';
      return;
    }
    
    // Caso especial para premios
    if (tempUrl.indexOf('#awards') != -1) {
      //console.log("URL de premios detectada: " + tempUrl);
      this.resetAllPageStates();
      this.isAwardsPage = true;
      this.currentHash = 'awards';
      return;
    }
    
    // Resetear todos los estados primero
    this.resetAllPageStates();
    
    // Establecer solo el estado correspondiente basado en la URL
    if (tempUrl.indexOf('/.') != -1 || tempUrl == '/' || tempUrl == '/#home') {
      this.isHomePage = true;
    } else if (tempUrl.indexOf('#iniciatives') != -1) {
      this.isiniciativesPage = true;
    } else if (tempUrl.indexOf('#thefoundation') != -1) {
      this.isthefoundationPage = true;
    } else if (tempUrl.indexOf('#ecosystem') != -1) {
      this.isEcosystemPage = true;
    } else if (tempUrl.indexOf('/donate') != -1) {
      this.isDonatePage = true;
    } else if (tempUrl.indexOf('#dxgpt') != -1) {
      this.isDxgptPage = true;
    }
  }

  ngOnInit() {
    this.config = this.configService.templateConf;
    
    // Verificar la URL actual al inicializar
    const currentUrl = this.router.url;
    //console.log("URL inicial: " + currentUrl);
    this.checkRoute(currentUrl);
    
    // Suscribirse a los eventos de navegación
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          //console.log("Evento de navegación: " + event.url);
          this.checkRoute(event.url);
        })
    );
  }

  ngAfterViewInit() {
    if (this.config.layout.dir) {
      setTimeout(() => {
        const dir = this.config.layout.dir;
        if (dir === "rtl") {
          this.placement = "bottom-left";
        } else if (dir === "ltr") {
          this.placement = "bottom-right";
        }
      }, 0);
    }
    
    // Verificar el hash actual al cargar la página
    setTimeout(() => {
      const hash = window.location.hash ? window.location.hash.substring(1) : 'home';
      //console.log("Hash inicial: " + hash);
      
      // Caso especial para contacto
      if (hash === 'contact') {
        //console.log("Inicializando en sección de contacto");
        this.resetAllPageStates();
        this.isContactPage = true;
        this.currentHash = 'contact';
      } 
      // Caso especial para premios
      else if (hash === 'awards') {
        //console.log("Inicializando en sección de premios");
        this.resetAllPageStates();
        this.isAwardsPage = true;
        this.currentHash = 'awards';
      } 
      // Para los demás casos
      else if (hash) {
        this.currentHash = hash;
        this.checkStep(hash);
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    this.subscription.unsubscribe();
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleNotificationSidebar() {
    this.layoutService.emitNotiSidebarChange(true);
  }

  toggleSidebar() {
    const appSidebar = document.getElementsByClassName("app-sidebar")[0];
    if (appSidebar.classList.contains("hide-sidebar")) {
      this.toggleHideSidebar.emit(false);
    } else {
      this.toggleHideSidebar.emit(true);
    }
  }

  loadLanguages() {
    this.langs=[
      { name: "English", code: "en" },
      { name: "Español", code: "es" }
    ];
    if (sessionStorage.getItem('lang')) {
      this.translate.use(sessionStorage.getItem('lang'));
      this.searchLangName(sessionStorage.getItem('lang'));
    } else {
      const browserLang: string = this.translate.getBrowserLang();
      var foundlang = false;
      for (let lang of this.langs) {
        if (browserLang.match(lang.code)) {
          this.translate.use(lang.code);
          foundlang = true;
          sessionStorage.setItem('lang', lang.code);
          this.searchLangName(lang.name);
        }
      }
      if (!foundlang) {
        sessionStorage.setItem('lang', this.translate.store.currentLang);
      }
    }
  }

  searchLangName(code: string) {
    for (let lang of this.langs) {
      var actualLang = sessionStorage.getItem('lang');
      if (actualLang == lang.code) {
        this.currentLang = lang.code;
      }
    }
  }

  ChangeLanguage(language: string) {
    this.translate.use(language);
    sessionStorage.setItem('lang', language);
    this.searchLangName(language);
    var eventsLang = this.inj.get(EventsService);
    eventsLang.broadcast('changelang', language);
  }

}
