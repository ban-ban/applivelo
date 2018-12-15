import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CheckoutPage } from '../checkout/checkout' ;
import { LoginPage } from '../login/login' ;

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  
  cartItems: any[];
  quantity:any[];
  total: any;
  cartEmpty: boolean ;

  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public viewCtrl : ViewController, public alertCtrl:AlertController) {
  	
  	this.total = 0.0;
  	this.cartEmpty = false ;
  	this.cartItems = [] ;
    this.quantity =[];
    
  	
  	console.log("entre constructor cart");

  	this.storage.ready().then(()=> {
  		this.storage.get("cart").then((data)=> {
  			
  			if (data == null || data.length == 0){
  				this.cartEmpty = true;
  				}
  			else
  				{
  				this.cartEmpty = false ;
  				this.cartItems = data;
  				this.cartItems.forEach((item, index) => {
  					this.total = this.total + (item.product.price * item.qty) ;
            this.quantity[index]=item.qty;
  				});
  			}
  			
  			console.log("cart");
  			//console.log(this.cartItems);

  			
  			console.log(this.total);
  		}); //fin get
  	})


  }

  removeFromCart(item,i){

    let price = item.product.price;
    let qty = item.qty;

    this.cartItems.splice(i,1);

    this.storage.set("cart", this.cartItems).then(()=> {
      this.total = this.total - (price*qty) ;
    });

    if (this.cartItems.length == 0) {
      this.cartEmpty=true ;
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  updateQty(item,i,qty){

    console.log('updateQty');

    let price = item.product.price;
  //  let qty = item.qty;
    let oldsubtotal = item.amount;

    this.cartItems[i].amount =parseFloat(qty) * parseFloat(price) ;
    
    this.storage.set("cart", this.cartItems).then(()=> {
      this.total=this.total - oldsubtotal + this.cartItems[i].amount;
      console.log(this.total);
    });

     

 //   if (newqty == qty){}
 //   else{
 //     if (newqty > qty){
 //       this.cartItems[i].qty=newqty;
 //       this.storage.set("cart", this.cartItems).then(()=> {
 //         this.total = this.total + (price*(newqty-qty) ;
 //       });
 //     }
 //   };
  }

  modifyQty(item,i) {
    console.log('modifyQty');
 
    let alert = this.alertCtrl.create({
      title:  item.product.slug ,
      message: 'modify quantity :',
      inputs: [
        {
          name: 'qty',
          placeholder: this.cartItems[i].qty,
          type: 'number',
          min:'1',
          max:'9'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
           
            let oldsubtotal = this.cartItems[i].amount;
            this.cartItems[i].qty=data.qty;
            console.log('nouvelle quantite :', this.cartItems[i].qty);
            this.cartItems[i].amount =parseFloat(this.cartItems[i].qty) * parseFloat(this.cartItems[i].product.price) ;
    
            this.storage.set("cart", this.cartItems).then(()=> {
              this.total=this.total - oldsubtotal + this.cartItems[i].amount;
              console.log('nouveau total :',this.total);
            });
          }
        }
      ]
    });
    alert.present();
  }

  openCheckoutPage(){


    if (this.cartEmpty == false) {

 
      console.log("cart no Empty", this.cartEmpty);

      this.storage.get("userLoginInfo").then( (data) => {
        console.log("opencheckout");

        if (data!=null) {
          console.log("openCheckoutPage");
          //this.viewCtrl.dismiss();
          this.navCtrl.push(CheckoutPage);
        }
        else {
          console.log("openLoginPage first");
          //this.viewCtrl.dismiss();
          this.navCtrl.push(LoginPage, {next: CheckoutPage});
            }
       });

   }  //end if
  }

  

 //  closeModal() {
 //   this.viewCtrl.dismiss();
 // }

} // end export
