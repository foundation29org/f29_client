import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Renderer2, AfterViewInit } from "@angular/core";
import { ROUTESHOMEDX} from './sidebar-routes.config';
import { Router, NavigationEnd } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { customAnimations } from "../animations/custom-animations";
import { ConfigService } from '../services/config.service';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';

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
  isDxgptPage: boolean = false;
  isEcosystemPage: boolean = false;
  isAwardsPage: boolean = false;
  isContactPage: boolean = false;
  isDonatePage: boolean = false;
  isLabPage: boolean = false;
  tempUrl1: string = '/';
  tempUrl2: string = 'home';

  constructor(
    private renderer: Renderer2,
    private router: Router,
    public translate: TranslateService,
    private configService: ConfigService,
    private layoutService: LayoutService,
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
      this.expanded = true;
    }
    this.layoutSub = this.layoutService.customizerChangeEmitted$.subscribe(
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
      this.isHomePage = false;
      this.isiniciativesPage = false;
      this.isthefoundationPage = false;
      this.isAwardsPage = false;
      this.isContactPage = false;
      this.isDonatePage = false;
      this.isEcosystemPage = false;
      this.isLabPage = false;
      this.isDxgptPage = false;
    if (tempUrl.indexOf('/.') != -1 || tempUrl == '/' || tempUrl == '/#home') {
      this.isHomePage = true;
    } else if (tempUrl.indexOf('#iniciatives') != -1) {
      this.isiniciativesPage = true;
    }else if (tempUrl.indexOf('#thefoundation') != -1) {
      this.isthefoundationPage = true;
    }else if (tempUrl.indexOf('#ecosystem') != -1) {
      this.isEcosystemPage = true;
    } else if (tempUrl.indexOf('#awards') != -1) {
      this.isAwardsPage = true;
    } else if (tempUrl.indexOf('#contact') != -1) {
      this.isContactPage = true;
    } else if (tempUrl.indexOf('/donate') != -1) {
      this.isDonatePage = true;
    }else if (tempUrl.indexOf('#lab') != -1) {
      this.isLabPage = true;
    }else if (tempUrl.indexOf('#dxgpt') != -1) {
      this.isDxgptPage = true;
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
