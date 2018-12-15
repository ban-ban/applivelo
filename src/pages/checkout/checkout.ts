import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { InAppBrowser } from '@ionic-native/in-app-browser' ;
import { NavController, NavParams, AlertController,ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { HomePage } from '../home/home' ;
import { EditDetailsPage} from '../edit-details/edit-details' ;

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  newOrder : any;
//  paymentMethods : any[];
  paymentMethod: string ;
  paymentTitle: string;
  billing_equals_shipping : boolean ;
  WooCommerce : any;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public toastCtrl : ToastController, private payPal: PayPal, private inAppBrser : InAppBrowser) {
  this.newOrder={};
  this.newOrder.billing={};
  this.newOrder.shipping={};  
  this.paymentMethod="";
  this.paymentTitle="";
  this.userInfo={};
 // this.paymentMethods=[
 // {method_id:"cheque", method_title:"Chèque"},
 // {method_id:"paypal", method_title:"PayPal"}]; 
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
   		this.userInfo=userLoginInfo.user; //used in placeorder()
   		//let email=this.user.email;
    	this.WooCommerce.getAsync("customers?email="+userLoginInfo.user.email).then((data)=>{
    		console.log("userLoginInfo", JSON.parse(data.body));
    		this.newOrder=JSON.parse(data.body)[0];
    	});
    });
  } //


  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage populate newOrder');
  }


  fillShipping(){
    this.billing_equals_shipping =!this.billing_equals_shipping ;
  }

  

  placeOrder() {


  console.log('placing order');
  let orderItems: any[] = [];
 	let orderData: any = {};

 	orderData={
  			payment_details : {
  				method_id : this.paymentMethod,
  				method_title : this.paymentTitle,
  				paid : true 
  			},
  			billing : this.newOrder.billing,
 	   		shipping: this.newOrder.shipping,
 	   		customer_id : this.userInfo.id || "", 
	  		line_items : orderItems  // list of products to be get from storage / "cart"
	};

	console.log('orderData', orderData);

  	 // If billing fields are not empty
    if (this.newOrder.email&&this.newOrder.first_name&&this.newOrder.last_name
      &&this.newOrder.username
      &&this.newOrder.billing.address_1
      &&this.newOrder.billing.city&&this.newOrder.billing.postcode&&this.newOrder.billing.country
      &&this.newOrder.billing.phone) {
        
          if (this.billing_equals_shipping==true){
            
    //              orderData.shipping.first_name= this.newOrder.billing.first_name;
    //              orderData.shipping.last_name= this.newOrder.billing.last_name;
    //              orderData.shipping.company= "";
    //              orderData.shipping.address_1= this.newOrder.billing.address_1;
    //              orderData.shipping.address_2= this.newOrder.billing.address_2;
    //              orderData.shipping.city= this.newOrder.billing.city;
    //              orderData.shipping.state= "";
    //              orderData.shipping.postcode= this.newOrder.billing.postcode;
    //              orderData.shipping.country= this.newOrder.billing.country;
    //              orderData.shipping.phone= this.newOrder.billing.phone;
                
            
          } // end of if billing equals shipping
          else {
            //if shipping fields are fullfilled
            if (this.newOrder.shipping.first_name&&this.newOrder.shipping.last_name
            &&this.newOrder.shipping.address_1
            &&this.newOrder.shipping.city&&this.newOrder.shipping.postcode&&this.newOrder.shipping.country
            &&this.newOrder.shipping.phone){
              //billing and shipping already set from html
            } //end of if shipping fields are fullfilled 
            else {
              this.toastCtrl.create({
              message : "please fill all the shipping fields",
              duration : 2500
              }).present();
              return;
            }

          }
       
        
      } // end of if billing fields are not empty 
    else {
      
      this.toastCtrl.create({
        message : "please fill all the fields",
        duration : 2500
      }).present();
      return;
    };






    // every field ok, we check payment method



  if (this.paymentMethod=="paypal") { this.paymentTitle="PayPal";};
	if (this.paymentMethod=="cheque") { this.paymentTitle="Cheque";};
	if (this.paymentMethod==""){
		console.log("fill payment method");
		this.toastCtrl.create({
   	    	message : "please fill payment method",
    	    duration : 2500
   		}).present();
      return;
	}
	else {

//--------- alert to confirm the order---------------
     
    console.log('sending alert to checkOrder');

    let cartItems = [];
    let totalquantity = 0.0;
    let totalamount = 0.0;

    this.storage.ready().then(()=> {
      this.storage.get("cart").then((data)=> {
        
        if (data == null || data.length == 0){
          return ;
          }
        else
          {
          
          cartItems = data;
          cartItems.forEach((item, index) => {
            totalamount = totalamount + (item.product.price * item.qty) ;
            totalquantity = totalquantity + parseFloat(item.qty);
          });
          console.log ('total', totalamount, 'quantity', totalquantity);

          //the alert to confirm
          let alert = this.alertCtrl.create({
            title:  'Check Order' ,
            message: 'your order contains '+ totalquantity +' products for a total of ' + totalamount + ' euros' ,
      
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                  return ;
                }
              },
              {
                text: 'Place order',
                handler: () => { 

                  alert.dismiss().then(()=> {

                            //place order if ok pressed
                      
                    // --------------start sending paypal or cheque order ------------------

                      if (this.paymentMethod=="paypal") {
                      this.payPal.init({
                        PayPalEnvironmentProduction: 'AYKo7aLSdDwWCNeDMVQAAKygWmLkQn2wktro9oAgrsRiyWRMIB_MCyhl8vSXyVK5D4G0harZoOQbZ6ex',
                        PayPalEnvironmentSandbox: 'EL1jvhkWiI-bSaBRmzFaU54Uwo6jMVAoodVmBTjZTDNq7H5hQj7-NHnd9wF2Nt7n8bM8Wd-iWmVmbk3p'
                      }).then(() => {
                        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
                        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
                          // Only needed if you get an "Internal Service Error" after PayPal login!
                          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
                        })).then(() => {
                          this.storage.get("cart").then ((cart)=> {
                            
                            console.log("get cart for paypal");

                            let total=0.0 ;
                            cart.forEach((element, index) => {
                              orderItems.push({
                                product_id: element.product.id,
                                quantity: element.qty
                              });
                              total = total + (element.product.price * element.qty) ;
                            });

                            let payment = new PayPalPayment(total.toString(), 'EUR', 'Description', 'sale');
                            this.payPal.renderSinglePaymentUI(payment).then((responsePayPal) => {
                                // Successfully paid
                                console.log("response from paypal", JSON.parse(responsePayPal.body));
                            
                              orderData.line_items = orderItems ;

                              console.log("orderData after response from paypal", orderData);
                              this.WooCommerce.postAsync("orders",orderData).then( (data)=>{
                                console.log("data posted to WC when paypal",JSON.parse(data.body));
                                let response = JSON.parse(data.body);
                                this.alertCtrl.create( {
                                  title : "Order sent, N°:"+response.number,
                                  message :"Your products will be sent as soon as we receive Paypal confirmation.",
                                  buttons : [{
                                    text:"Ok",
                                    handler : ()=>{
                                      this.navCtrl.setRoot(HomePage);
                                    }
                                  }]
                                }).present();
                              }); //end postAsync

                          }, () => {
                                  // Error or render dialog closed without being successful
                            }); // end renderSinglePaymentUI
                          }); //end get cart

                          
                        }, () => {
                          // Error in configuration
                        }); //end preparetorender

                      }, () => {
                        // Error in initialization, maybe PayPal isn't supported or something else
                      }); // end init PayPal

                      }  //end if

                      else {
                        this.storage.get("cart").then ((cart)=> {
                          console.log("Get cart if cheques");
                          cart.forEach((element, index) => {
                            orderItems.push({
                              product_id: element.product.id,
                              quantity: element.qty
                            });

                          });
                          // equivalent to orderItems=cart witout the amount and with keyword quantity instead od qty
                          console.log("orderItems when cheques", orderItems);  
                          orderData.line_items = orderItems ;

                      //    let orderData : any ={};
                      //    orderData.order=datainOrder; //because WooCommmerce structure is orderData.order
                          console.log("orderData when cheques", orderData);
                          this.WooCommerce.postAsync("orders",orderData).then( (data)=>{
                            console.log("post orders when cheques",JSON.parse(data.body));
                            let response = JSON.parse(data.body);
                            this.alertCtrl.create( {
                              title : "Order sent, N°:"+response.number,
                              message :"Your products will be sent as soon as we receive your check.",
                              buttons : [{
                                text:"Ok",
                                handler : ()=>{
                                  this.navCtrl.setRoot(HomePage);
                                }
                              }]
                            }).present();
                          });
                        }); //end get cart

                      
                        } // end else


                  }); //end alert.dismiss
                  return false;

                } //end handler
              }
            ]  //end buttons
          }); // end alert.create
          alert.present();
  
          } //fin else
        
        
      }); //fin get cart
    }); //fin storage

 
    
  
    

    
  	}// end else 

    
  } // end placeorder

  editDetails(){
  	this.navCtrl.push(EditDetailsPage);
  }

  openWebSite(){
//open woocommerce website : 
//url:"http://parolia.net/index.php/my-account/edit-account/?insecure=cool&username="
//  		+this.theUser.username+"&password="+this.password,
	let url = "http://parolia.net/index.php/my-account/edit-account/?insecure=cool&username="
  		+this.newOrder.username+"&password="+this.newOrder.password ;
	const browser=this.inAppBrser.create(url, '_self', );
  }

}
