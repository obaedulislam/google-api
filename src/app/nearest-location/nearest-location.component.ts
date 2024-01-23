import { Component, NgZone, OnInit } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-nearest-location',
  templateUrl: './nearest-location.component.html',
  styleUrls: ['./nearest-location.component.scss']
})
export class NearestLocationComponent implements OnInit {
  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    console.log("google map done");
    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=geometry,places,drawing&key=AIzaSyBJbfJEM7cENLUqYq3WNLaPziVcFKDLXgI`;
    document.body.appendChild(script);
    script.onload = () => {
      this.initializeAutocomplete();
    };
  }

  initializeAutocomplete() {
    this.zone.run(() => {
      const searchField = new google.maps.places.Autocomplete((document.getElementById('search_input')), { types: ['geocode'], });

      google.maps.event.addListener(searchField, 'place_changed', () => {
        const nearPlace = searchField.getPlace();
        console.log(nearPlace);
      });
    });
  }


}
