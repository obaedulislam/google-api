import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationSearchComponent } from './location-search/location-search.component';
import { NearestLocationComponent } from './nearest-location/nearest-location.component';

const routes: Routes = [
  {
    path: '',
    component: LocationSearchComponent
  },
  {
    path: 'nearest-location',
    component: NearestLocationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
