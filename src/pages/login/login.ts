import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, ToastController, AlertController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username : string ;
  password : string ;	

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl : ToastController, public alertCtrl : AlertController, public storage : Storage) {
  
  this.username="";
  this.password="";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
  	
  	this.password="qqqdddrrr444";
    
  	this.http.get("http://parolia.net/index.php/api/auth/generate_auth_cookie/?insecure=cool&username="
  		+this.username+"&password="+this.password).subscribe( (res) => {
  			console.log("login object", res.json());
  			let response= res.json();

  			if (response.error) {
  				this.toastCtrl.create({
  					message:response.error,
  					showCloseButton : true
  					//duration: 3000;
  				}).present();
  				return ; // exit http.get if invalid username/password
  			};

  			this.storage.set("userLoginInfo",response).then (() => {
  				this.alertCtrl.create({
  					title:"Login successfull",
  					message: "you are logged in",
  					buttons:[{
  						text:"Ok",
  						handler : ()=>{
  							if (this.navParams.get("next")){
  								this.navCtrl.push(this.navParams.get("next"));
  								//recupere la page stockée dans  next dans le checkout() de Cart.ts
  								}
  							else {
  								this.navCtrl.pop(); //we just close the loginPage and reenter Menu page
	  						}
	  					}
  					}]
  				}).present();
  			});


  		}); //end http.get


  }

  openSignupPage(){
    console.log("entre openSignupPage");
    this.navCtrl.push(SignupPage);
  }
}
