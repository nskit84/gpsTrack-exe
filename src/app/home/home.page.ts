import { Component, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';

import * as watermark from 'watermarkjs';

import { BackendService } from '../services/backend.service';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //showCurrentLocation: boolean = false;
  userData;
  //title = 'My first AGM project';
  //lat = 51.678418;
  //lng = 7.809007;

  //locationCoords: any;
  //timetest: any;

  @ViewChild('waterMarkedImage',{static:false}) waterMarkImage: ElementRef;
 
  originalImage = null;
  blobImage = null;
  locationCordinates:any;
  loadingLocation:boolean;
  dataSource:any;
  inRange: boolean;

  cameraOptions: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    //destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    cameraDirection: this.camera.Direction.FRONT 
    //allowEdit: true,
    //correctOrientation: true
  }


  @ViewChild('map',{static:false}) mapElement: ElementRef;
  map: any;
  address:string;

  locationCoords: any;
  timetest: any;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private camera: Camera,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private locationAccuracy: LocationAccuracy,
    private backendService: BackendService
   ) {
      this.locationCoords = {
        latitude: "",
        longitude: "",
        accuracy: "",
        timestamp: ""
      }
      this.timetest = Date.now();
     
    }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }
    
  ngOnInit() {
    this.userData = {
      email: localStorage.getItem("email"),
      uid:  localStorage.getItem("uid"),
      gpsLoc : {
        "lat": null,
        "lng": null
      },
      dttm: new Date()
    };
   // this.getUserLocation();
   // this.showCurrentLocation = true;
   //this.checkGPSPermission();
   this.loadMap();
   this.getLatLong();
  // this.checkInRange();
  this.inRange = true;
  }

  takeSnap() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      this.originalImage = 'data:image/jpeg;base64,' + imageData;
      //this.originalImage = imageData;
      this.waterMarkImage.nativeElement.src = this.originalImage;

     /* fetch(this.originalImage)
        .then(res => res.blob())
        .then(blob => {
          this.blobImage = blob;
          this.watermarkImage()
        }); */
        if (confirm("Are you sure want to Submit your attendance ?")) {
          this.backendService.setAttendance('NA', this.userData,this.originalImage);        
        }
    }, (error) => {
       console.log(error);      
    });
  }

  getLatLong() {
    this.loadingLocation = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.locationCordinates = resp.coords;
      this.userData.gpsLoc.lng = resp.coords.longitude;
      this.userData.gpsLoc.lat = resp.coords.latitude;
      this.loadingLocation = false;
    }).catch((error) => {
      this.loadingLocation = false;
      console.log('Error getting location', error);
    });
  }

  watermarkImage() {
    watermark([this.blobImage])
    .image(watermark.text.lowerLeft("(-35.117662, 148.457107)", '200px Arial', '#F5A905', 0.8))
      .then(img => {
        this.waterMarkImage.nativeElement.src = img.src;
      });
  }
  
 /* getUserLocation() {
    const positionOption = { enableHighAccuracy: false, maximumAge: Infinity, timeout: 60000 };
          const gpsSunccuss = function (currentPosition) {
              // use gps position
          };
          const gpsFailed = function () {
              // use some 3rd party position solution(get position by your device ip)
              // getPositionBy3rdParty();
          };
  
          /// locate the user
          if (navigator.geolocation) {
              // navigator.geolocation.watchPosition((position => {
                  navigator.geolocation.getCurrentPosition((position => {
                  // call these two lines from another function at settime interval, only capture new GPS coords here through watchPosition
                      this.userData.gpsLoc.lat = position.coords.latitude;
                      this.userData.gpsLoc.lng = position.coords.longitude;
                  return this.userData;
              }), gpsFailed, positionOption);
          }
  }

  image:any=''
  openCam(){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     //alert(imageData)
     this.image=(<any>window).Ionic.WebView.convertFileSrc(imageData);
    }, (err) => {
     // Handle error
     alert("error "+JSON.stringify(err))
    });

  }
*/

loadMap() {
  this.geolocation.getCurrentPosition().then((resp) => {
    this.userData.gpsLoc.lat = resp.coords.latitude;
    this.userData.gpsLoc.lng = resp.coords.longitude;
    let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.map.addListener('tilesloaded', () => {
      console.log('accuracy',this.map);
      this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
    });

  }).catch((error) => {
    console.log('Error getting location', error);
  });
}

  
  //Check if application having GPS access permission  
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
 
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
 
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }
 
  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }
 
  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }
 
  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }
 
  setAttendance() {
    if (confirm("Are you sure want to Submit your attendance ?")) {
      this.backendService.setAttendance('NA', this.userData,'No Image');
    
    }
  }

  getHistLocation() {
    this.backendService.getAttendance()
        .subscribe(members => {
            this.dataSource = members;
        });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value);
 
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      });
 
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
   deg2rad(deg) {
    return deg * (Math.PI/180)
  }


  async checkInRange() {
    const alerts = await this.alertCtrl.create({
      header: 'Provide Lattitude and longitude',
      message: 'Provide lattitude and longitude value where you need to give access.(its for only testing inRage feature. Prodution this value capture in database for each user.)',
      inputs:[
        {
          name:'lattitude',
          type: 'number',
          placeholder: 'Lattitude'
        },
        {
          name:'longitude',
          type: 'number',
          placeholder: 'Longitude'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Confirm',
          handler: async (data) => {

         var distance =   this.getDistanceFromLatLonInKm(data.lattitude,data.longitude, this.userData.gpsLoc.lat,this.userData.gpsLoc.lng)
          alert("Distance: "+distance);
         if (distance < 1){
           this.inRange = true;

         }else {
          this.inRange = false; 
          alert("Your not in the range. To provide attends")

         }
           
            
          }
        }
      ]
    });

    await alerts.present();
  }

}
