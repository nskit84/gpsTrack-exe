import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule, HttpClient } from '@angular/common/http';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Angular Firebase settings
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AgmCoreModule } from '@agm/core';
//import { FileUploadComponent } from './shared/dropzone/fileupload.component';
//import { DropZoneDirective } from './shared/dropzone/dropzone.directive';
//import { FileSizePipe } from './shared/dropzone/filesize.pipe';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import * as firebase from 'firebase';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AppRoutingModule,  
            HttpClientModule,
            AgmCoreModule.forRoot({
              apiKey: environment.googleMapsKey
            }),
            //AngularFireModule.initializeApp(environment.firebase, 'Attendance-APP'), // imports firebase/app needed for everything
            AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
            AngularFirestoreModule, // imports firebase/firestore, only needed for database features
            AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
            AngularFireStorageModule // imports firebase/storage only needed for storage features  
           ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    AndroidPermissions,
    Geolocation,
    NativeGeocoder,
    LocationAccuracy,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
