import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonatePageComponent } from "./donate/donate-page.component";
import { NewsPageComponent } from "./news/news-page.component";
import { OneNewPageComponent } from "./onenew/onenew-page.component";
import { LandPageComponent } from "./land/land-page.component";
import { LibroPageComponent } from "./libro/libro-page.component";
import { LabPageComponent } from "./lab/lab-page.component";
import { IniciativesPageComponent } from "./iniciatives/iniciatives-page.component";
import { ThefoundationPageComponent } from "./thefoundation/thefoundation-page.component";
import { EcosystemPageComponent } from "./ecosystem/ecosystem-page.component";
import { AwardsPageComponent } from "./awards/awards-page.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '.',
        component: LandPageComponent,
        data: {
          title: 'Foundation 29'
        },
      },
      {
        path: 'donate',
        component: DonatePageComponent,
        data: {
          title: 'f29.Donate'
        }
      },
      {
        path: 'news',
        component: NewsPageComponent,
        data: {
          title: 'f29.News'
        }
      },
      {
        path: 'news/:title/:id',
        component: OneNewPageComponent,
        data: {
          title: 'f29.News'
        }
      },
      {
        path: 'libroenfermedadesraras',
        component: LibroPageComponent,
        data: {
          title: 'libroenfermedadesraras'
        }
      },
      {
        path: 'lab',
        component: LabPageComponent,
        data: {
          title: 'Lab 29'
        }
      },
      {
        path: 'iniciatives',
        component: IniciativesPageComponent,
        data: {
          title: 'f29.Initiatives'
        }
      },
      {
        path: 'thefoundation',
        component: ThefoundationPageComponent,
        data: {
          title: 'f29.The Foundation'
        }
      },
      {
        path: 'ecosystem',
        component: EcosystemPageComponent,
        data: {
          title: 'f29.Ecosystem'
        }
      },
      {
        path: 'awards',
        component: AwardsPageComponent,
        data: {
          title: 'f29.Awards'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandPageRoutingModule { }
