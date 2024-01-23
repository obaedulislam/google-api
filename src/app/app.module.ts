import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationSearchComponent } from './location-search/location-search.component';
import { NearestLocationComponent } from './nearest-location/nearest-location.component';

@NgModule({
  declarations: [
    AppComponent,
    LocationSearchComponent,
    NearestLocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
