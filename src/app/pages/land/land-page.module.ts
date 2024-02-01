import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { LandPageRoutingModule } from "./land-page-routing.module";
import { TranslateModule } from '@ngx-translate/core';

import { LandPageComponent } from "./land/land-page.component";
import { DonatePageComponent } from "./donate/donate-page.component";
import { NewsPageComponent } from "./news/news-page.component";
import { OneNewPageComponent } from "./onenew/onenew-page.component";
import { LibroPageComponent } from "./libro/libro-page.component";
import { LabPageComponent } from "./lab/lab-page.component";
import { IniciativesPageComponent } from "./iniciatives/iniciatives-page.component";
import { ThefoundationPageComponent } from "./thefoundation/thefoundation-page.component";
import { EcosystemPageComponent } from "./ecosystem/ecosystem-page.component";
import { AwardsPageComponent } from "./awards/awards-page.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    exports: [
        TranslateModule
    ],
    imports: [
        CommonModule,
        LandPageRoutingModule,
        FormsModule,
        TranslateModule,
        CustomFormsModule,
        NgbModule
    ],
    declarations: [
        LandPageComponent,
        DonatePageComponent,
        NewsPageComponent,
        OneNewPageComponent,
        LibroPageComponent,
        LabPageComponent,
        IniciativesPageComponent,
        ThefoundationPageComponent,
        EcosystemPageComponent,
        AwardsPageComponent
    ]
})
export class LandPageModule { }
