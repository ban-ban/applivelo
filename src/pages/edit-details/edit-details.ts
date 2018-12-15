import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { HomePage } from '../home/home' ;

@Component({
  selector: 'page-edit-details',
  templateUrl: 'edit-details.html',
})

export class EditDetailsPage {

  theUser : any;
  billing_equals_shipping : boolean ;
  WooCommerce : any;
  password : any;
//  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public storage: Storage, public alertCtrl: AlertController, public toastCtrl : ToastController) {
  this.theUser={};
  this.theUser.billing={};
  this.theUser.shipping={};  
  this.password="qqqdddrrr444";
 // this.userInfo={};
  this.billing_equals_shipping= false ;

  this.WooCommerce = WC({
      url:"http://parolia.net/index.php",
      consumerKey: "ck_f036d85d070370aac81528499965f9d9b6b96830",
      consumerSecret:"cs_52abddeacb5c5a4ccbf9df912ecfee77cd5f3702",
      wpAPI: true,
      version: "wc/v2",
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });
   this.storage.get("userLoginInfo").then( (userLoginInfo)=> {
  // 		this.userInfo=userLoginInfo.user; //used in placeorder()
   		this.WooCommerce.getAsync("customers?email="+userLoginInfo.user.email).then((data)=>{
    		console.log("userLoginInfo", JSON.parse(data.body));
    		this.theUser=JSON.parse(data.body)[0];
    		//this.password=this.theUser.password;

    	});
    });
  } //


  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage populate newOrder');
    console.log(this.password);
  }


  fillShipping(){
    this.billing_equals_shipping =!this.billing_equals_shipping ;
  }


  cancelUpdateDetails(){
  	this.navCtrl.pop();
  }


  updateDetails(){
    let customerData = {
      customer : {}
    } ;

     // If billing fields are not empty
    if (this.theUser.email&&this.theUser.first_name&&this.theUser.last_name
      &&this.theUser.username&&this.theUser.password&&this.theUser.confirm_password
      &&this.theUser.billing.address_1&&this.theUser.billing.address_2
      &&this.theUser.billing.city&&this.theUser.billing.postcode&&this.theUser.billing.country
      &&this.theUser.billing.phone) {
        if (this.theUser.confirm_password == this.theUser.password) {
          if (this.billing_equals_shipping==true){
            customerData.customer = {
                // "email": this.theUser.email,
                "first_name": this.theUser.first_name,
                "last_name": this.theUser.last_name,
                //"username": this.theUser.username,
                "password" : this.password,
                "billing": {
                  "first_name": this.theUser.first_name,
                  "last_name": this.theUser.last_name,
                  "company": "",
                  "address_1": this.theUser.billing.address_1,
                  "address_2": this.theUser.billing.address_2,
                  "city": this.theUser.billing.city,
                  "state": "",
                  "postcode": this.theUser.billing.postcode,
                  "country": this.theUser.billing.country,
                  //"email": this.theUser.email,
                  "phone": this.theUser.billing.phone
                },
                "shipping": {
                  "first_name": this.theUser.first_name,
                  "last_name": this.theUser.last_name,
                  "company": "",
                  "address_1": this.theUser.billing.address_1,
                  "address_2": this.theUser.billing.address_2,
                  "city": this.theUser.billing.city,
                  "state": "",
                  "postcode": this.theUser.billing.postcode,
                  "country": this.theUser.billing.country,
                  "phone": this.theUser.billing.phone
                } 
            }
          } // end of if billing equals shipping
          else {
            //if shipping fields are fullfilled
            if (this.theUser.shipping.first_name&&this.theUser.shipping.last_name
            &&this.theUser.shipping.address_1&&this.theUser.shipping.address_2
            &&this.theUser.shipping.city&&this.theUser.shipping.postcode&&this.theUser.shipping.country
            &&this.theUser.shipping.phone){
              customerData.customer = {
                 //"email": this.theUser.email,
                "first_name": this.theUser.first_name,
                "last_name": this.theUser.last_name,
                //"username": this.theUser.username,
                "password" : this.password,
                "billing": {
                  "first_name": this.theUser.first_name,
                  "last_name": this.theUser.last_name,
                  "company": "",
                  "address_1": this.theUser.billing.address_1,
                  "address_2": this.theUser.billing.address_2,
                  "city": this.theUser.billing.city,
                  "state": "",
                  "postcode": this.theUser.billing.postcode,
                  "country": this.theUser.billing.country,
                  //"email": this.theUser.email,
                  "phone": this.theUser.billing.phone
                },
                "shipping": {
                  "first_name": this.theUser.shipping.first_name,
                  "last_name": this.theUser.shipping.last_name,
                  "company": "",
                  "address_1": this.theUser.shipping.address_1,
                  "address_2": this.theUser.shipping.address_2,
                  "city": this.theUser.shipping.city,
                  "state": "",
                  "postcode": this.theUser.shipping.postcode,
                  "country": this.theUser.shipping.country,
                  "phone": this.theUser.shipping.phone
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

    // every field ok, we post the data to update
    let WooCommerce2 = WC({
      url:"http://parolia.net/index.php/my-account/edit-account/?insecure=cool&username="
  		+this.theUser.username+"&password="+this.password,
      consumerKey: "ck_f036d85d070370aac81528499965f9d9b6b96830",
      consumerSecret:"cs_52abddeacb5c5a4ccbf9df912ecfee77cd5f3702",
      wpAPI: true,
      version: "wc/v2",
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });
    this.http.get("http://parolia.net/index.php/api/auth/generate_auth_cookie/?insecure=cool&username="
  		+this.theUser.username+"&password="+this.password).subscribe( (res) => {
  		console.log("login in edit-details", res.json());
	    WooCommerce2.postAsync("last_name","Dodo").then( (data)=> {
	      console.log("customer dodo updated",data.json());

	      let response = data.json(); //JSON.parse(data.body);

	      //console.log("recup customer", response.email, response.role);
	      if (response.role == "last_name"){

	        this.alertCtrl.create({
	          title:"Details updated",
	          message:"Your details have been updated.",
	          buttons:[{
	            text:"Ok",
	            handler:()=>{
	               this.navCtrl.pop(); 
	                  
	            }
	          }]
	        }).present();
	      }
	      else {
	      	console.log("pb response");
	        if (response.error) {
	        this.toastCtrl.create({
	          message : response.error,
	          showCloseButton : true
	        }).present();
	        };
	      }

	    });//end of postAsync
    }); //end of http.get  
  } // end of updateDetails

  


checkEmail() {
  	let validEmail = false ;
  	let reg = /^\S+@\S+\.\S+$/ ;
 // 	let reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ ;
 // 	let reg = (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]) ;

	if (reg.test(this.theUser.email)) {
		//emails looks valid

		this.WooCommerce.getAsync("customers?email="+this.theUser.email).then((data)=> {
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


confirmPassword(){
  if (this.theUser.confirm_password == this.theUser.password) {
    
  }
  else {
    this.toastCtrl.create({
            message:"confirm_password does not match password. Please write again.",
            //showCloseButton : true
            duration: 3000
          }).present();
    
  };
  
}



  editDetails(){
  	this.navCtrl.push(EditDetailsPage);
  }



}
