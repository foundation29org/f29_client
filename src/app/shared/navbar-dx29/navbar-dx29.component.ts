import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { LangService } from 'app/shared/services/lang.service';
import { EventsService } from 'app/shared/services/events.service';
import { Injectable, Injector } from '@angular/core';

@Component({
  selector: 'app-navbar-dx29',
  templateUrl: './navbar-dx29.component.html',
  styleUrls: ['./navbar-dx29.component.scss'],
  providers: [LangService]
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
  isClinicianPage: boolean = false;
  isNewsPage: boolean = false;
  isUndiagnosedPatientPage: boolean = false;
  isEdHubPage: boolean = false;
  isAboutPage: boolean = false;
  isGTPPage: boolean = false;
  isDonaPage: boolean = false;
  role: string = 'Clinical';
  subrole: string = 'null';
  private subscription: Subscription = new Subscription();

  constructor(public translate: TranslateService, private layoutService: LayoutService, private configService: ConfigService, private langService: LangService, private router: Router, private route: ActivatedRoute, private inj: Injector) {

    this.loadLanguages();

    this.router.events.filter((event: any) => event instanceof NavigationEnd).subscribe(

      event => {
        var tempUrl = (event.url).toString();
        console.log(tempUrl);
        if (tempUrl.indexOf('/.') != -1 || tempUrl == '/') {
          this.isHomePage = true;
          this.isClinicianPage = false;
          this.isNewsPage = false;
          this.isEdHubPage = false;
          this.isAboutPage = false;
          this.isGTPPage = false;
          this.isUndiagnosedPatientPage = false;
          this.role = 'Clinical';
          this.subrole = 'null';
        } else if (tempUrl.indexOf('/clinician') != -1) {
          this.isHomePage = false;
          this.isClinicianPage = true;
          this.isNewsPage = false;
          this.isEdHubPage = false;
          this.isAboutPage = false;
          this.isGTPPage = false;
          this.isUndiagnosedPatientPage = false;
          this.role = 'Clinical';
          this.subrole = 'null';
        } else if (tempUrl.indexOf('/news') != -1) {
          this.isHomePage = false;
          this.isNewsPage = true;
          this.isClinicianPage = false;
          this.isEdHubPage = false;
          this.isAboutPage = false;
          this.isGTPPage = false;
          this.isUndiagnosedPatientPage = false;
          this.role = 'User';
          this.subrole = 'HaveDiagnosis';
        } else if (tempUrl.indexOf('/undiagnosed') != -1) {
          this.isHomePage = false;
          this.isNewsPage = false;
          this.isClinicianPage = false;
          this.isEdHubPage = false;
          this.isAboutPage = false;
          this.isGTPPage = false;
          this.isUndiagnosedPatientPage = true;
          this.role = 'User';
          this.subrole = 'NoDiagnosis';
        } else if (tempUrl.indexOf('/education') != -1) {
          this.isHomePage = false;
          this.isNewsPage = false;
          this.isClinicianPage = false;
          this.isEdHubPage = true;
          this.isAboutPage = false;
          this.isGTPPage = false;
          this.isUndiagnosedPatientPage = false;
        } else if (tempUrl.indexOf('/aboutus') != -1) {
          this.isHomePage = false;
          this.isNewsPage = false;
          this.isClinicianPage = false;
          this.isEdHubPage = false;
          this.isAboutPage = true;
          this.isGTPPage = false;
          this.isUndiagnosedPatientPage = false;
        } else if (tempUrl.indexOf('/juntoshaciaeldiagnostico') != -1) {
          this.isHomePage = false;
          this.isNewsPage = false;
          this.isClinicianPage = false;
          this.isEdHubPage = false;
          this.isAboutPage = false;
          this.isGTPPage = true;
          this.isUndiagnosedPatientPage = false;
          if (tempUrl.indexOf('/juntoshaciaeldiagnostico/donar') != -1) {
            this.isDonaPage = true;
          } else {
            this.isDonaPage = false;
          }
        } else {
          this.isHomePage = false;
          this.isClinicianPage = false;
          this.isNewsPage = false;
          this.isEdHubPage = false;
          this.isAboutPage = false;
          this.isGTPPage = false;
          this.isUndiagnosedPatientPage = false;
        }

        if (tempUrl.indexOf('patient') != -1) {
          if (tempUrl.indexOf('role=User') != -1) {///patient;role=User;subrole=HaveDiagnosis
            this.role = 'User'
          }
          if (tempUrl.indexOf('subrole=HaveDiagnosis') != -1) {///patient;role=User;subrole=HaveDiagnosis
            this.subrole = 'HaveDiagnosis'
          }
        }
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
    document.getElementById(step).scrollIntoView(true);
  }

}
