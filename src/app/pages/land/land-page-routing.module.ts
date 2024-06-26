import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonatePageComponent } from "./donate/donate-page.component";
import { NewsPageComponent } from "./news/news-page.component";
import { OneNewPageComponent } from "./onenew/onenew-page.component";
import { LandPageComponent } from "./land/land-page.component";
import { LibroPageComponent } from "./libro/libro-page.component";
import { GuiaPageComponent } from "./guia/guia-page.component";
import { LabPageComponent } from "./lab/lab-page.component";

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
        path: 'guiaenfermedadesraras',
        component: GuiaPageComponent,
        data: {
          title: 'Guia enfermedades raras'
        }
      },
      {
        path: 'lab',
        component: LabPageComponent,
        data: {
          title: 'Lab 29'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandPageRoutingModule { }
