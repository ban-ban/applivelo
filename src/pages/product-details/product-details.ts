import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  
  product: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage : Storage, public toastCtrl: ToastController, public modalCtrl: ModalController) {
  	this.product = this.navParams.get("product");
  	//console.log (this.product);
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product) {
    this.storage.get("cart").then ( (data) => {
     // console.log(data);
     
     if (data == null || data.length == 0) {
       data = [];
       data.push({
         "product": product,
         "qty": 1,
         "amount":parseFloat(product.price)
       });
     } else {

       let added=0;
       for (let i = 0; i < data.length; i++){
         if (product.id == data[i].product.id) {
           console.log("produit déjà dans le panier");
           let qty=data[i].qty;
           data[i].qty=qty+1;
           data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
           added = 1
          }
       }

       if (added == 0) {
         data.push({
         "product": product,
         "qty": 1,
         "amount":parseFloat(product.price)
         });
       }   
     }//fin du else

     this.storage.set("cart", data).then ( ()=> {
       console.log("cart updated");
       console.log(data);

       this.toastCtrl.create({
         message : "produit ajouté au panier",
         duration : 2500
       }).present();

     }); //fin du set
    }); //fin du get
  } //fin de addToCart

  openCart(){
    this.navCtrl.push(CartPage);
 //   this.modalCtrl.create(CartPage).present();
  }

}
