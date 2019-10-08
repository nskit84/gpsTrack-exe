import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(public navCtrl: NavController, public menuCtrl: MenuController,private backendService: BackendService) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }


  ngOnInit() {
  }

  logout() {
    this.backendService.userLogout()
    .then( res =>{
    window.localStorage.removeItem("uid");
    window.localStorage.removeItem("displayName");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("picture"); 
    this.navCtrl.navigateRoot('/login');
    },
    err => {
        console.log(err);
        alert("Error, While logout!");
    
  });
  }

}
