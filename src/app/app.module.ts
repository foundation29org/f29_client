import { NgModule ,LOCALE_ID  } from '@angular/core';
import es from '@angular/common/locales/es'
import { registerLocaleData } from '@angular/common';
registerLocaleData(es);
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";
import { ToastrModule } from "ngx-toastr";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader, provideTranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppComponent } from './app.component';
import { LandPageLayoutComponent } from "./layouts/land-page/land-page-layout.component";

import { AuthInterceptor } from './shared/auth/auth.interceptor';
import { DatePipe } from '@angular/common';
import { DateService } from 'app/shared/services/date.service';
import { LocalizedDatePipe } from 'app/shared/services/localizedDatePipe.service';
import { SortService } from 'app/shared/services/sort.service';
import { SearchService } from 'app/shared/services/search.service';
import { EventsService } from 'app/shared/services/events.service';
import { DialogService } from 'app/shared/services/dialog.service';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import { environment } from 'environments/environment';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain:  environment.api// or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#000000'
    }
  },
  theme: 'edgeless',
  type: 'opt-out'
};

  @NgModule({
    declarations: [AppComponent, LandPageLayoutComponent, LocalizedDatePipe],
    imports: [
      CommonModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      SharedModule,
      HttpClientModule,
      ToastrModule.forRoot(),
      NgbModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader
        }
      }),
      NgcCookieConsentModule.forRoot(cookieConfig)
    ],
    providers: [
      {
        provide : HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi   : true
      },
      DatePipe,
      DateService,
      LocalizedDatePipe,
      { provide: LOCALE_ID, useValue: 'es-ES' },
      SortService,
      SearchService,
      EventsService,
      DialogService,
      ...provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    ],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
