import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { RouterModule } from "@angular/router";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

//COMPONENTS
import { FooterLandComponent } from "./footer-land/footer-land.component";
import { NavbarD29Component } from "./navbar-dx29/navbar-dx29.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

//DIRECTIVES
import { SidebarDirective } from './directives/sidebar.directive';
import { SidebarLinkDirective } from './directives/sidebarlink.directive';
import { SidebarListDirective } from './directives/sidebarlist.directive';
import { SidebarAnchorToggleDirective } from './directives/sidebaranchortoggle.directive';
import { SidebarToggleDirective } from './directives/sidebartoggle.directive';



@NgModule({
    exports: [
        CommonModule,
        FooterLandComponent,
        NavbarD29Component,
        SidebarComponent,
        SidebarDirective,
        NgbModule,
        TranslateModule
    ],
    imports: [
      FormsModule,
      CustomFormsModule,
        RouterModule,
        CommonModule,
        NgbModule,
        TranslateModule,
        PerfectScrollbarModule
    ],
    declarations: [
        FooterLandComponent,
        NavbarD29Component,
        SidebarComponent,
        SidebarDirective,
        SidebarLinkDirective,
        SidebarListDirective,
        SidebarAnchorToggleDirective,
        SidebarToggleDirective
    ]
})
export class SharedModule { }
