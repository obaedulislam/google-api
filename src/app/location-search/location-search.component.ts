import { Component, OnInit, NgZone, ViewChild } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  currentLocation: { lat: number, lng: number } | undefined;
  currentLocationName!: string;

  inputFields = [
    {
      id: "pick-up",
      placeholder: "Pickup Location",
    },
    {
      id: "drop-off",
      placeholder: "Drop Off Location",
    }
  ]

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

  initializeAutocomplete() {
    this.zone.run(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const mapOptions = {
            zoom: 15,
            center: this.currentLocation
          };

          const map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);

          const pickUpInput = document.getElementById('pick-up') as HTMLInputElement;
          const dropOffInput = document.getElementById('drop-off') as HTMLInputElement;

          const pickUpField = new google.maps.places.Autocomplete(
            pickUpInput,
            {
              types: ['geocode'],
              bounds: this.createBounds()
            }
          );

          const dropOffField = new google.maps.places.Autocomplete(
            dropOffInput,
            {
              types: ['geocode'],
              bounds: this.createBounds()
            }
          );

          google.maps.event.addListener(pickUpField, 'place_changed', () => {
            const pickUpPlace = pickUpField.getPlace();
            console.log(pickUpPlace);

            map.setCenter(pickUpPlace.geometry.location);

            const marker = new google.maps.Marker({
              position: pickUpPlace.geometry.location,
              title: pickUpPlace.name
            });

            marker.setMap(map);

            if (this.currentLocation) {
              dropOffField.setBounds(this.createBounds(pickUpPlace.geometry.location));
            }
          });

          google.maps.event.addListener(dropOffField, 'place_changed', () => {
            const dropOffPlace = dropOffField.getPlace();
            console.log('Drop-off location:', dropOffPlace);
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
    if (google && google.maps && google.maps.Geocoder) {
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

  addInputField() {
    const newIndex = this.inputFields.length;
    const newField = {
      id: `stop-${newIndex}`,
      placeholder: `Stop location `,
    };
    this.inputFields.push(newField);
  }

  removeInputField() {
    if (this.inputFields.length > 2) {
      this.inputFields.pop();
    }
  }

  createBounds(center?: { lat: number, lng: number }): any {
    if (center) {
      const radius = 5000;
      const bounds = new google.maps.Circle({ center, radius }).getBounds();
      return bounds;
    }
    return null;
  }
}
