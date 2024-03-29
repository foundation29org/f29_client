import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap'
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { EventsService } from 'app/shared/services/events.service';

import {
  NgcCookieConsentService,
  NgcNoCookieLawEvent,
  NgcInitializeEvent,
  NgcStatusChangeEvent,
} from "ngx-cookieconsent";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  private subscriptionIntervals: Subscription = new Subscription();
  private subscriptionTestForce: Subscription = new Subscription();
  loggerSubscription: Subscription;
  actualPage: string = '';
  hasLocalLang: boolean = false;
  tituloEvent: string = '';
  role: string = '';
  langs: any;

  //keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;
  constructor(public toastr: ToastrService, private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title, public translate: TranslateService, private eventsService: EventsService, private ccService: NgcCookieConsentService, private meta: Meta) {

    if (sessionStorage.getItem('lang')) {
      this.translate.use(sessionStorage.getItem('lang'));
      this.hasLocalLang = true;
    } else {
      this.translate.use('en');
      sessionStorage.setItem('lang', 'en');
      this.hasLocalLang = false;
    }

    this.loadLanguages();
    this.loadCultures();

  }

  loadLanguages() {
    this.langs=[
      { name: "English", code: "en" },
      { name: "Español", code: "es" }
    ];

    if (!this.hasLocalLang) {
      const browserLang: string = this.translate.getBrowserLang();
      for (let lang of this.langs) {
        if (browserLang.match(lang.code)) {
          this.translate.use(lang.code);
          sessionStorage.setItem('lang', lang.code);
          this.eventsService.broadcast('changelang', lang.code);
        }
      }
    }
  }

  loadCultures() {
    const browserCulture: string = this.translate.getBrowserCultureLang();
    sessionStorage.setItem('culture', browserCulture);

  }

  ngOnInit() {

    this.meta.addTags([
      { name: 'keywords', content: this.translate.instant("seo.home.keywords") },
      { name: 'description', content: this.translate.instant("seo.home.description") },
      { name: 'title', content: this.translate.instant("seo.home.title") },
      { name: 'robots', content: 'index, follow' }
    ]);

    //evento que escucha si ha habido un error de conexión
    this.eventsService.on('http-error', function (error) {
      var msg1 = 'No internet connection';
      var msg2 = 'Trying to connect ...';

      if (sessionStorage.getItem('lang')) {
        var actuallang = sessionStorage.getItem('lang');
        if (actuallang == 'es') {
          msg1 = 'Sin conexión a Internet';
          msg2 = 'Intentando conectar ...';
        } else if (actuallang == 'pt') {
          msg1 = 'Sem conexão à internet';
          msg2 = 'Tentando se conectar ...';
        } else if (actuallang == 'de') {
          msg1 = 'Keine Internetverbindung';
          msg2 = 'Versucht zu verbinden ...';
        } else if (actuallang == 'nl') {
          msg1 = 'Geen internet verbinding';
          msg2 = 'Proberen te verbinden ...';
        }
      }
      if (error.message) {
        if (error == 'The user does not exist') {
          Swal.fire({
            icon: 'warning',
            title: this.translate.instant("errors.The user does not exist"),
            html: this.translate.instant("errors.The session has been closed")
          })
        }
      } else {

        Swal.fire({
          title: msg1,
          text: msg2,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#33658a',
          confirmButtonText: 'OK',
          showLoaderOnConfirm: true,
          allowOutsideClick: false,
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            location.reload();
          }

        });
      }
    }.bind(this));

    this.subscription = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        (async () => {
          await this.delay(500);
          this.tituloEvent = event['title'];
          var titulo = this.translate.instant(this.tituloEvent);
          this.titleService.setTitle(titulo);
          this.changeMeta();
        })();

        //para los anchor de la misma páginano hacer scroll hasta arriba
        if (this.actualPage != event['title']) {
          window.scrollTo(0, 0)
        }
        this.actualPage = event['title'];
      });


    this.eventsService.on('changelang', function (lang) {
      
      (async () => {
        await this.delay(500);
        var titulo = this.translate.instant(this.tituloEvent);
        this.titleService.setTitle(titulo);
        sessionStorage.setItem('lang', lang);
        this.changeMeta();
      })();

      this.translate
      .get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy'])
      .subscribe(data => {

        this.ccService.getConfig().content = this.ccService.getConfig().content || {} ;
        // Override default messages with the translated ones
        this.ccService.getConfig().content.header = data['cookie.header'];
        this.ccService.getConfig().content.message = data['cookie.message'];
        this.ccService.getConfig().content.dismiss = data['cookie.dismiss'];
        this.ccService.getConfig().content.allow = data['cookie.allow'];
        this.ccService.getConfig().content.deny = data['cookie.deny'];
        this.ccService.getConfig().content.link = data['cookie.link'];
        this.ccService.getConfig().content.policy = data['cookie.policy'];
        this.ccService.getConfig().content.href = environment.api+'/privacy-policy';
        this.ccService.destroy();//remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig()); // update config with translated messages
      });

    }.bind(this));

    this.ccService.getConfig().cookie.domain = window.location.hostname;

    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(() => {
      // you can use this.ccService.getConfig() to do stuff...
    });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(() => {
      // you can use this.ccService.getConfig() to do stuff...
    });

    this.initializeSubscription = this.ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
      }
    );

    this.translate
      .get(['cookie.header', 'cookie.message', 'cookie.dismiss', 'cookie.allow', 'cookie.deny', 'cookie.link', 'cookie.policy'])
      .subscribe(data => {

        this.ccService.getConfig().content = this.ccService.getConfig().content || {} ;
        // Override default messages with the translated ones
        this.ccService.getConfig().content.header = data['cookie.header'];
        this.ccService.getConfig().content.message = data['cookie.message'];
        this.ccService.getConfig().content.dismiss = data['cookie.dismiss'];
        this.ccService.getConfig().content.allow = data['cookie.allow'];
        this.ccService.getConfig().content.deny = data['cookie.deny'];
        this.ccService.getConfig().content.link = data['cookie.link'];
        this.ccService.getConfig().content.policy = data['cookie.policy'];
        this.ccService.getConfig().content.href = environment.api+'/privacy-policy';
        this.ccService.destroy();//remove previous cookie bar (with default messages)
        this.ccService.init(this.ccService.getConfig()); // update config with translated messages
      });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // when the component is destroyed, unsubscribe to prevent memory leaks
  ngOnDestroy() {
    if (this.loggerSubscription) {
      this.loggerSubscription.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.subscriptionIntervals) {
      this.subscriptionIntervals.unsubscribe();
    }

    if (this.subscriptionTestForce) {
      this.subscriptionTestForce.unsubscribe();
    }

    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }

  changeMeta() {
    var URLactual = window.location.href;
    if (URLactual.indexOf("donate") != -1) {
      this.meta.updateTag({ name: 'keywords', content: this.translate.instant("seo.donate.keywords") });
      this.meta.updateTag({ name: 'description', content: this.translate.instant("seo.donate.description") });
      this.meta.updateTag({ name: 'title', content: this.translate.instant("seo.donate.title") });
    } else if (URLactual.indexOf("/news/") != -1) {
     //change meta on onenew-page.component
    }else if (URLactual.indexOf("news") != -1) {
      this.meta.updateTag({ name: 'keywords', content: this.translate.instant("seo.news.keywords") });
      this.meta.updateTag({ name: 'description', content: this.translate.instant("seo.news.description") });
      this.meta.updateTag({ name: 'title', content: this.translate.instant("seo.news.title") });
    } else {
      this.meta.updateTag({ name: 'keywords', content: this.translate.instant("seo.home.keywords") });
      this.meta.updateTag({ name: 'description', content: this.translate.instant("seo.home.description") });
      this.meta.updateTag({ name: 'title', content: this.translate.instant("seo.home.title") });
    } 
  }

}
