import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
declare var google: any;// 
// import * as google from 'googlemaps';

// import { google } from 'googlemaps';
@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  searchInputValue!: string;
  currentLocation!: { lat: number, lng: number };
  currentLocationName!: string;

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    console.log("Google Maps initialized");
    this.loadGoogleMaps();
    this.getCurrentLocation();
  }

  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=geometry,places,drawing&key=AIzaSyBJbfJEM7cENLUqYq3WNLaPziVcFKDLXgI`;
    document.body.appendChild(script);
    script.onload = () => {
      this.initializeAutocomplete();
    };
  }

  // initializeAutocomplete() {
  //   this.zone.run(() => {
  //     const searchField = new google.maps.places.Autocomplete(
  //       document.getElementById('search_input') as HTMLInputElement,
  //       {
  //         types: ['geocode'],
  //         bounds: this.createBounds()
  //       }
  //     );

  //     // // Set the bounds after the Autocomplete is created
  //     // searchField.setBounds(this.createBounds());


  //     google.maps.event.addListener(searchField, 'place_changed', () => {
  //       const nearPlace = searchField.getPlace();
  //       console.log(nearPlace);
  //       // Search address show
  //       const myLatlng = nearPlace.geometry.location;
  //       const mapOptions = {
  //         zoom: 15,
  //         center: myLatlng
  //       };
  //       const map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
  //       const marker = new google.maps.Marker({
  //         position: myLatlng,
  //         title: nearPlace.name
  //       });
  //       marker.setMap(map);
  //     });
  //   });
  // }

  initializeAutocomplete() {
    this.zone.run(() => {
      console.log(navigator.geolocation);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const myLatlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const mapOptions = {
            zoom: 15,
            center: myLatlng
          };

          const map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);

          const searchField = new google.maps.places.Autocomplete(
            document.getElementById('search_input') as HTMLInputElement,
            {
              types: ['geocode'],
              bounds: this.createBounds()
            }
          );

          google.maps.event.addListener(searchField, 'place_changed', () => {
            const nearPlace = searchField.getPlace();
            console.log(nearPlace);

            map.setCenter(nearPlace.geometry.location);

            const marker = new google.maps.Marker({
              position: nearPlace.geometry.location,
              title: nearPlace.name
            });

            marker.setMap(map);
          });
        });
      }
    });
  }


  getCurrentLocation() {
    if (navigator.geolocation) {
      this.tryGetLocation();
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  tryGetLocation(attempts = 5) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.zone.run(() => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(this.currentLocation);
          this.getLocationName(this.currentLocation.lat, this.currentLocation.lng);
        });
      },
      (error) => {
        console.error('Error getting current location:', error);
        if (attempts > 0) {
          setTimeout(() => this.tryGetLocation(attempts - 1), 1000); // Retry after 1 second
        } else {
          console.error('Maximum attempts reached. Unable to get current location.');
        }
      }
    );
  }

  getLocationName(lat: number, lng: number) {
    if (google == undefined && google.maps && google.maps.Geocoder) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ 'location': latlng }, (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            this.zone.run(() => {
              this.currentLocationName = results[0].formatted_address;
              console.log('Current Location Name:', this.currentLocationName);
            });
          } else {
            console.error('No results found');
          }
        } else {
          console.error('Geocoder failed due to: ' + status);
        }
      });
    } else {
      console.error('Google Maps script is not loaded yet.');
    }
  }

  createBounds(): any {
    const radius = 1000; // Specify the radius in meters
    const bounds = new google.maps.LatLngBounds();

    bounds.extend(new google.maps.LatLng(this.currentLocation?.lat + (radius / 111000), this.currentLocation?.lng + (radius / (111000 * Math.cos(this.currentLocation?.lat * Math.PI / 180)))));
    bounds.extend(new google.maps.LatLng(this.currentLocation?.lat - (radius / 111000), this.currentLocation?.lng - (radius / (111000 * Math.cos(this.currentLocation?.lat * Math.PI / 180)))));

    return bounds;
  }

}
