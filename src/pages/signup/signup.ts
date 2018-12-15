import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {

  WooCommerce : any;
  newUser : any ;
  billing : any ;
  shipping : any ;
  billing_equals_shipping : boolean ;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl : ToastController, public alertCtrl : AlertController, public storage : Storage) {


  	this.newUser = {};
    this.newUser.password="qqqdddrrr444";
  	this.newUser.billing = {} ;
  	this.newUser.shipping = {} ;
  	this.billing_equals_shipping = true ;
  
  	this.WooCommerce = WC({
      url:"http://parolia.net/index.php",
      consumerKey: "ck_f036d85d070370aac81528499965f9d9b6b96830",
      consumerSecret:"cs_52abddeacb5c5a4ccbf9df912ecfee77cd5f3702",
      wpAPI: true,
      version: "wc/v2",
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });

  } //end constructor

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
 
  fillShipping(){
    this.billing_equals_shipping =!this.billing_equals_shipping ;
  }

  

  signUp(){
    let customerData = {
      customer : {}
    } ;

     // If billing fields are not empty
    if (this.newUser.email&&this.newUser.first_name&&this.newUser.last_name
      &&this.newUser.username&&this.newUser.password&&this.newUser.confirm_password
      &&this.newUser.billing.address_1&&this.newUser.billing.address_2
      &&this.newUser.billing.city&&this.newUser.billing.postcode&&this.newUser.billing.country
      &&this.newUser.billing.phone) {
        if (this.newUser.confirm_password == this.newUser.password) {
          if (this.billing_equals_shipping==true){
            customerData.customer = {
                 "email": this.newUser.email,
                "first_name": this.newUser.first_name,
                "last_name": this.newUser.last_name,
                "username": this.newUser.username,
                "password" : this.newUser.password,
                "billing": {
                  "first_name": this.newUser.first_name,
                  "last_name": this.newUser.last_name,
                  "company": "",
                  "address_1": this.newUser.billing.address_1,
                  "address_2": this.newUser.billing.address_2,
                  "city": this.newUser.billing.city,
                  "state": "",
                  "postcode": this.newUser.billing.postcode,
                  "country": this.newUser.billing.country,
                  "email": this.newUser.email,
                  "phone": this.newUser.billing.phone
                },
                "shipping": {
                  "first_name": this.newUser.first_name,
                  "last_name": this.newUser.last_name,
                  "company": "",
                  "address_1": this.newUser.billing.address_1,
                  "address_2": this.newUser.billing.address_2,
                  "city": this.newUser.billing.city,
                  "state": "",
                  "postcode": this.newUser.billing.postcode,
                  "country": this.newUser.billing.country,
                  "phone": this.newUser.billing.phone
                } 
            }
          } // end of if billing equals shipping
          else {
            //if shipping fields are fullfilled
            if (this.newUser.shipping.first_name&&this.newUser.shipping.last_name
            &&this.newUser.shipping.address_1&&this.newUser.shipping.address_2
            &&this.newUser.shipping.city&&this.newUser.shipping.postcode&&this.newUser.shipping.country
            &&this.newUser.shipping.phone){
              customerData.customer = {
                 "email": this.newUser.email,
                "first_name": this.newUser.first_name,
                "last_name": this.newUser.last_name,
                "username": this.newUser.username,
                "password" : this.newUser.password,
                "billing": {
                  "first_name": this.newUser.first_name,
                  "last_name": this.newUser.last_name,
                  "company": "",
                  "address_1": this.newUser.billing.address_1,
                  "address_2": this.newUser.billing.address_2,
                  "city": this.newUser.billing.city,
                  "state": "",
                  "postcode": this.newUser.billing.postcode,
                  "country": this.newUser.billing.country,
                  "email": this.newUser.email,
                  "phone": this.newUser.billing.phone
                },
                "shipping": {
                  "first_name": this.newUser.shipping.first_name,
                  "last_name": this.newUser.shipping.last_name,
                  "company": "",
                  "address_1": this.newUser.shipping.address_1,
                  "address_2": this.newUser.shipping.address_2,
                  "city": this.newUser.shipping.city,
                  "state": "",
                  "postcode": this.newUser.shipping.postcode,
                  "country": this.newUser.shipping.country,
                  "phone": this.newUser.shipping.phone
                }
              }
            } //end of if shipping fields are fullfilled 
            else {
              this.toastCtrl.create({
              message : "please fill all the shipping fields",
              duration : 2500
              }).present();
              return;
            }

          }
        } //end of if confirm_password
        else {
          this.toastCtrl.create({
            message:"confirm_password does not match password. Please write again.",
            //showCloseButton : true
            duration: 3000
          }).present();
          return;
        }  
      } // end of if billing fields are not empty 
    else {
      
      this.toastCtrl.create({
        message : "please fill all the fields",
        duration : 2500
      }).present();
      return;
    };

    // every field ok, we post the data
    this.WooCommerce.postAsync("customers", customerData.customer).then( (data)=> {
      console.log("customer poste", JSON.parse(data.body));

      let response = JSON.parse(data.body);

      //console.log("recup customer", response.email, response.role);
      if (response.role == "customer"){

        this.alertCtrl.create({
          title:"Compte créé",
          message:"Veuillez vous loguer.",
          buttons:[{
            text:"Ok",
            handler:()=>{
             
              this.navCtrl.push(LoginPage); 
                  
            
            }
          }]
        }).present();
      }
      else {
        if (response.message) {
        this.toastCtrl.create({
          message : "email or username already exists",
          showCloseButton : true
        }).present();
        };
      }

    });//end of postAsync  
  } // end of signUp

  


  checkEmail() {
  	let validEmail = false ;
  	let reg = /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/ ;
 // 	let reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ;
 //	let reg = (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]) ;

	if (reg.test(this.newUser.email)) {
		//emails looks valid

		this.WooCommerce.getAsync("customers?email="+this.newUser.email).then((data)=> {
//pb avec customers/email : no route was found
//pb avec customers?email : ne renvoie pas d'erreur si email n'existe pas
			console.log("objet get customer email", JSON.parse(data.body));
			
			let response = JSON.parse(data.body) ;

			if (response.length == 0){
				//there is no response if email does not exist
				validEmail = true ;
				console.log("email n existe pas dans WC"); 
				this.toastCtrl.create({
					message : "email valide",
					duration : 2500
				}).present();


			}	
			else {
				validEmail = false ;
				console.log("email existe deja");
				this.toastCtrl.create({
					message : "email existe deja",
					showCloseButton : true
					//duration : 2500
				}).present();
			}
		}, (err) => {
            console.log(err);
        }); // fin getAsync

	} else {
		validEmail = false ;
		console.log("email mal ecrit");
//		this.toastCtrl.create({
//					message : "email mal ecrit",
//					showCloseButton : true
//				}).present();
	}; // end else
  } //end Checkmail

//essai de verif que confirmpassword est identique à password (d'apres stackonflow)
//  passwordWatchOnblur = () => {
//    this.hide =  typeof this.newUser.confirmPassword === 'undefined' || this.newUser.confirmPassword === null || this.newUser.password == this.newUser.confirmPassword;
//}

confirmPassword(){
  if (this.newUser.confirm_password == this.newUser.password) {
    
  }
  else {
    this.toastCtrl.create({
            message:"confirm_password does not match password. Please write again.",
            //showCloseButton : true
            duration: 3000
          }).present();
    
  };
  
}

popoverMore(){

}



} //end export?

