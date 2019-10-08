import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
//import { async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
//import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit  {
  public onLoginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    private backendService: BackendService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {

    this.onLoginForm = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  ngAfterViewInit() {
    if (!localStorage.getItem("uid")) {
      this.afAuth.user.subscribe(res => {
        if (res) {
          window.localStorage.setItem("uid", res.uid);
          window.localStorage.setItem("displayName", res.displayName);
          window.localStorage.setItem("email", res.email);
          window.localStorage.setItem("picture", res.photoURL);
        }
      });
    }
  }

  login(loginType) {
    
   this.backendService.login(loginType, this.onLoginForm).then(
        res => {
          console.log(res);
          alert("Successfully Logged In!");
          this.navCtrl.navigateRoot('/tabs'); 
        },
        err => {
          console.log(err);
          alert("Error, Not able to login.");
        });
    /*{
    //this.navCtrl.navigateRoot('/home'); 
    this.navCtrl.navigateRoot('/tabs'); 
   }
  .then(
      (succes) => {
        this.navCtrl.navigateRoot('/home');
      },
      (error) => {
        console.error(error);
      });*/
  }

  

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs:[
        {
          name:'email',
          type: 'email',
          placeholder: 'Email'
        }
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

            this.backendService.sendPasswordResetEmail(data.email);
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            })
          }
        }
      ]
    });

    await alert.present();
  }

  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home-results');
  }

}
