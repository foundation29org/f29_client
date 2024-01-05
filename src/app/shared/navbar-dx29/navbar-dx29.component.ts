import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { EventsService } from 'app/shared/services/events.service';
import { Injectable, Injector } from '@angular/core';

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
  isNewsPage: boolean = false;
  isEcosystemPage: boolean = false;
  isAwardsPage: boolean = false;
  isContactPage: boolean = false;
  isDonatePage: boolean = false;
  isLabPage: boolean = false;
  
  private subscription: Subscription = new Subscription();

  constructor(public translate: TranslateService, private layoutService: LayoutService, private configService: ConfigService, private router: Router, private inj: Injector) {

    this.loadLanguages();

    this.router.events.filter((event: any) => event instanceof NavigationEnd).subscribe(
      event => {
        var tempUrl = (event.url).toString();
        this.checkRoute(tempUrl);
      }
    );


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




  checkRoute(tempUrl){
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isthefoundationPage = false;
      this.isNewsPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
      this.isLabPage = false;
    if (tempUrl.indexOf('/.') != -1 || tempUrl == '/' || tempUrl == '/#home') {
      this.isHomePage = true;
    } else if (tempUrl.indexOf('#iniciatives') != -1) {
      this.isiniciativesPage = true;
    } else if (tempUrl.indexOf('#thefoundation') != -1) {
      this.isthefoundationPage = true;
    } else if (tempUrl.indexOf('/news') != -1) {
      this.isNewsPage = true;
    } else if (tempUrl.indexOf('#ecosystem') != -1) {
      this.isEcosystemPage = true;
    } else if (tempUrl.indexOf('#awards') != -1) {
      this.isAwardsPage = true;
    } else if (tempUrl.indexOf('#contact') != -1) {
      this.isContactPage = true;
    } else if (tempUrl.indexOf('/donate') != -1) {
      this.isDonatePage = true;
    }else if (tempUrl.indexOf('/lab') != -1) {
      this.isLabPage = true;
    }
  }

  ngOnInit() {
    this.config = this.configService.templateConf;
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
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

  goTo(step) {
    if( document.getElementById(step)==null){
      this.router.navigate(['/'], { fragment: step});
    }else{
      this.router.navigate(['/'], { fragment: step});
      document.getElementById(step).scrollIntoView({behavior: "smooth"});
    }
    this.checkRoute(this.router.url);
  }

}
