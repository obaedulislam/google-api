import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationSearchComponent } from './location-search/location-search.component';

const routes: Routes = [
  {
    path: '',
    component: LocationSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
