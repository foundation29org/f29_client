import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonatePageComponent } from "./donate/donate-page.component";
import { NewsPageComponent } from "./news/news-page.component";
import { OneNewPageComponent } from "./onenew/onenew-page.component";
import { LandPageComponent } from "./land/land-page.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '.',
        component: LandPageComponent,
        data: {
          title: 'Rare Diseases Hub Ukraine'
        },
      },
      {
        path: 'donate',
        component: DonatePageComponent,
        data: {
          title: 'Donate'
        }
      },
      {
        path: 'news',
        component: NewsPageComponent,
        data: {
          title: 'News'
        }
      },
      {
        path: 'news/:id',
        component: OneNewPageComponent,
        data: {
          title: 'News'
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
