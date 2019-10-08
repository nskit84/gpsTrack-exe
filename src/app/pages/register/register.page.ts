import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController, ToastController } from '@ionic/angular';

import { BackendService } from  '../../services/backend.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public onRegisterForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private backendService: BackendService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      'fullName': [null, Validators.compose([
        Validators.required
      ])],
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  async signUp() {
    console.warn(this.onRegisterForm.value);

    const loader = await this.loadingCtrl.create({
      //duration: 4000
    });
    loader.present();

    const toast =  await this.toastCtrl.create({
      showCloseButton: true,
      message: 'Registered successfully.',
      duration: 4000,
      position: 'top'
    });

    this.backendService.createUser(this.onRegisterForm).then(
      (sucess) => {     

        toast.present().then( () => {       
        loader.remove()});
        this.navCtrl.navigateRoot('/login');
      },
      (error) => {
        console.error(error);
        loader.remove();
      }
    )
   
   /* loader.onWillDismiss().then(() => {
      this.navCtrl.navigateRoot('/login');
    });*/

    
  }

  // // //
  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }
  

}
