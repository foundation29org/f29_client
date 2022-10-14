import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef, Renderer2, AfterViewInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ROUTESHOMEDX} from './sidebar-routes.config';
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { customAnimations } from "../animations/custom-animations";
import { ConfigService } from '../services/config.service';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import { EventsService} from 'app/shared/services/events.service';
import { Data } from 'app/shared/services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  animations: customAnimations
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('toggleIcon') toggleIcon: ElementRef;
  public menuItems: any[];
  depth: number;
  activeTitle: string;
  activeTitles: string[] = [];
  expanded: boolean;
  nav_collapsed_open = false;
  logoUrl = 'assets/img/logo.png';
  public config: any = {};
  layoutSub: Subscription;
  urlLogo: string = 'assets/img/logo-f29.webp';
  urlLogo2: string = 'assets/img/logo-f29.webp';
  isHomePage: boolean = false;
  isiniciativesPage: boolean = false;
  isthefoundationPage: boolean = false;
  isNewsPage: boolean = false;
  isEcosystemPage: boolean = false;
  isAwardsPage: boolean = false;
  isContactPage: boolean = false;
  isDonatePage: boolean = false;
  tempUrl1: string = '/';
  tempUrl2: string = 'home';
  private subscription: Subscription = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private configService: ConfigService,
    private layoutService: LayoutService,
    private eventsService: EventsService,
     private dataservice: Data,
     private http: HttpClient
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
      this.expanded = true;
    }
    this.layoutSub = layoutService.customizerChangeEmitted$.subscribe(
      options => {
        if (options) {
          if (options.bgColor) {
            if (options.bgColor === 'white') {
              this.logoUrl = 'assets/img/logo-dark.png';
            }
            else {
              this.logoUrl = 'assets/img/logo.png';
            }
          }
          if (options.compactMenu === true) {
            this.expanded = false;
            this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
            this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
            this.nav_collapsed_open = true;
          }
          else if (options.compactMenu === false) {
            this.expanded = true;
            this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
            this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
            this.nav_collapsed_open = false;
          }

        }
      });


    this.router.events.filter((event: any) => event instanceof NavigationEnd).subscribe(

      event => {
        var tempUrl= (event.url).toString().split('?');
        var actualUrl = tempUrl[0];
        this.tempUrl1 = (actualUrl).toString();
        if(this.tempUrl1!='/'){
          this.tempUrl2= this.tempUrl1.split('#')[1];
        }
        this.checkRoute(this.tempUrl1);
        this.menuItems = ROUTESHOMEDX.filter(menuItem => menuItem);
      }
    );
  }

  checkRoute(tempUrl){
    if (tempUrl.indexOf('/.') != -1 || tempUrl == '/' || tempUrl == '/#home') {
      this.isHomePage = true;
      this.isiniciativesPage = false;
      this.isthefoundationPage = false;
      this.isNewsPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
    } else if (tempUrl.indexOf('#iniciatives') != -1) {
      this.isHomePage = false;
      this.isiniciativesPage = true;
      this.isthefoundationPage = false;
      this.isNewsPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
    }else if (tempUrl.indexOf('#thefoundation') != -1) {
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isthefoundationPage = true;
      this.isNewsPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
    } else if (tempUrl.indexOf('/news') != -1) {
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isNewsPage = true;
      this.isthefoundationPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
    } else if (tempUrl.indexOf('#ecosystem') != -1) {
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isNewsPage = false;
      this.isthefoundationPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = true;
    } else if (tempUrl.indexOf('#awards') != -1) {
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isNewsPage = false;
      this.isthefoundationPage = false;
      this.isAwardsPage = true;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
    } else if (tempUrl.indexOf('#contact') != -1) {
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isNewsPage = false;
      this.isthefoundationPage = false;
      this.isAwardsPage = false;
      this.isContactPage = true;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
    } else if (tempUrl.indexOf('/donate') != -1) {
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isNewsPage = false;
      this.isthefoundationPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = true;
      this.isEcosystemPage = false;
    } else {
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isthefoundationPage = false;
      this.isNewsPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
    }
  }


  ngOnInit() {
    this.config = this.configService.templateConf;
    this.menuItems = ROUTESHOMEDX.filter(menuItem => menuItem);
    if (this.config.layout.sidebar.backgroundColor === 'white') {
      this.logoUrl = 'assets/img/logo-dark.png';
    }
    else {
      this.logoUrl = 'assets/img/logo.png';
    }
  }

  ngAfterViewInit() {

    setTimeout(() => {
      if (this.config.layout.sidebar.collapsed != undefined) {
        if (this.config.layout.sidebar.collapsed === true) {
          this.expanded = false;
          this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
          this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
          this.nav_collapsed_open = true;
        }
        else if (this.config.layout.sidebar.collapsed === false) {
          this.expanded = true;
          this.renderer.removeClass(this.toggleIcon.nativeElement, 'ft-toggle-left');
          this.renderer.addClass(this.toggleIcon.nativeElement, 'ft-toggle-right');
          this.nav_collapsed_open = false;
        }
      }
    }, 0);


  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  toggleSlideInOut() {
    this.expanded = !this.expanded;
  }

  handleToggle(titles) {
    this.activeTitles = titles;
  }

  // NGX Wizard - skip url change
  ngxWizardFunction(path: string) {
    if (path.indexOf("forms/ngx") !== -1)
      this.router.navigate(["forms/ngx/wizard"], { skipLocationChange: false });
  }

  goTo(step) {
    if( document.getElementById(step)==null){
      this.router.navigate(['/'], { fragment: step});
    }else{
      this.router.navigate(['/'], { fragment: step});
      document.getElementById(step).scrollIntoView({behavior: "smooth"});
    }
    //this.checkRoute(this.router.url);
  }

}
