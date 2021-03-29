import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent {
  constructor(private zone: NgZone,
    private http: HttpClient) { 

    }



  apiKey = 'AIzaSyBslvcSbs-aDAZyfOv2UlqBWOsDeym2Rs0'
  title = 'Viaja desde Ferrol';
  latitude = 40.32114;
  longitude = -3.73801;
  zoom = 4;
  map: google.maps.Map;
  mapClickListener: google.maps.MapsEventListener;
  lastLocation = { lat: 0, lng: 0 };

  // Matrix API
  templateUrl: string = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Ferrol';
  origins = '&origins=Ferrol';
  destinations = '&destinations=';
  destino;
  key = '&key=AIzaSyBslvcSbs-aDAZyfOv2UlqBWOsDeym2Rs0'


  private mapReadyHandler(map: google.maps.Map) {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();  
      this.map = map;

      this.mapClickListener = this.map.addListener('click', (evt: google.maps.MapMouseEvent) => {
        
      
      this.zone.run(async () => {
        const lat = evt.latLng.lat(),
          lng = evt.latLng.lng();

        this.lastLocation = { lat, lng };

        this.destino = await this.getAddress(this.lastLocation);
        this.destino = this.destino.split(' ').join('');

        let ruta = await this.getRoute();
        // console.log(ruta);


      });

      directionsRenderer.setMap(map);
      this.calculateAndDisplayRoute(directionsService, directionsRenderer, this.lastLocation);
      
    });
  }

  private ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }

  private getAddress(location: Object) {
    return new Promise((resolve, reject) => {

      const lat = location['lat'],
        long = location['lng'];

      let templateUrl: string = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=true&key=${this.apiKey}`;


      // Http Call Geolocation API
      this.http.get(templateUrl)
        .subscribe((address) => {
          if (address['status'] == "OK") {
            resolve(address['results'][0]['formatted_address']);
          } else {
            reject(new Error());
          }
        });
    });
  }

  private getRoute() {

      return new Promise((resolve, reject) => {

        let templateUrl: string = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Ferrol,Spain&destinations=${this.destino}&key=${this.apiKey}`;


        // Http Call Geolocation API
       const service = new google.maps.DistanceMatrixService();
       service.getDistanceMatrix(
         {
           origins: ['Ferrol, Spain'],
           destinations: [this.destino],
           travelMode: google.maps.TravelMode.DRIVING,
           unitSystem: google.maps.UnitSystem.METRIC,
           avoidHighways: false,
           avoidTolls: false,
         },
         (response, status) => {
           if (status !== "OK") {
             alert("Error was: " + status);
           } else {
             console.log('RUTA: ', response);
             
             const originList = response.originAddresses,
                destinationList = response.destinationAddresses,
                outputDiv = document.getElementById("output") as HTMLDivElement;
            
             outputDiv.innerHTML = "";
     
             for (let i = 0; i < originList.length; i++) {
               const results = response.rows[i].elements;

     
               for (let j = 0; j < results.length; j++) {
                
                 outputDiv.innerHTML += `Desde <strong>${originList[i]}</strong> hasta <strong>${destinationList[j]}</strong>
                   <br>Distancia: 
                   <strong>${results[j].distance.text}</strong>
                   <br>Tiempo estimado:
                   <strong>${results[j].duration.text}</strong>`;
               }
             }
           }
         }
       );
    
  })
}

  private calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer,
    destination: Object
  ) {

    console.log(destination);
    
    directionsService.route(
      {
        origin: {lat: 43.483842, lng: -8.238722 }, // Ferrol
        destination: destination, // Madrid
        // @ts-ignore
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status == "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}