import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details';
import { Menu } from '../menu/menu' ;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;
  
  @ViewChild('productSlides') productSlides: Slides ;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

    this.page= 1;
    
    this.WooCommerce = WC({
      url:"http://parolia.net/index.php",
      consumerKey: "ck_f036d85d070370aac81528499965f9d9b6b96830",
      consumerSecret:"cs_52abddeacb5c5a4ccbf9df912ecfee77cd5f3702",
      wpAPI: true,
      version: "wc/v2",
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then( (data) => {
      console.log("products",JSON.parse(data.body));
      this.products = JSON.parse(data.body);
      // console.log(this.products);
    },(err)=>{
      console.log(err);
    });
  }

  ionViewDidLoad(){
    setInterval(()=>{
      if(this.productSlides.getActiveIndex() == this.productSlides.length() - 1){
        this.productSlides.slideTo(0);
      }
      this.productSlides.slideNext();
    },3000) 
  }

  loadMoreProducts(event){
    
    console.log("entre_loadmoreproducts");

    if (event == null) {
      this.page = 1;
      this.moreProducts = [];
      console.log("entre_constructor_null", this.page);
    }
    else {
        this.page ++ ;
        console.log("entre_deuxieme_fois", this.page);
      }

    this.WooCommerce.getAsync("products?page="+this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      console.log("moreproducts", this.page);
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body));
      // console.log(this.moreProducts);

      if (event != null) {
        console.log("fin event");
        event.complete();
      }

      if (JSON.parse(data.body).length < 10) {
        event.enable(false);

   //     this.toastCtrl.create({
   //       message: "pas d'autre produit",
   //       duration: 2500
   //     }).present();

      }
      
    }, (err) => {
      console.log(err);
    });
    //fin getAsync
  }//fin loadmoreproducts

  openProductPage (product){
    console.log(product);
    this.navCtrl.push(ProductDetailsPage, {"product" : product});
  }

  openMenuPage (){
    this.navCtrl.push(Menu);
  }
}
// fin export