import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {
  
  WooCommerce: any;
  products2: any[];
  page: number;
  categoryid: any;
  categoryslug: any;
  scroll: boolean;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
 
  	this.page = 1;
  	this.scroll=true;
   // this.categoryid = 0;
    this.products2 = [];
    this.categoryid = this.navParams.get("categoryid");
    this.categoryslug = this.navParams.get("categoryslug");
  	console.log("get categoryid",this.categoryid);

	  this.WooCommerce = WC({
      url:"http://parolia.net/index.php",
      consumerKey: "ck_f036d85d070370aac81528499965f9d9b6b96830",
      consumerSecret:"cs_52abddeacb5c5a4ccbf9df912ecfee77cd5f3702",
      wpAPI: true,
      version: "wc/v2",
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });

    //this.loadMoreProducts(null);
  
    this.WooCommerce.getAsync("products?category="+this.categoryid+"&page="+this.page).then( (data) => {
      //console.log(JSON.parse(data.body));
      //console.log("products_apres_loadmoreproducts");
      this.products2 = JSON.parse(data.body);
      console.log("products2",this.products2);
      if (this.products2.length < 10) {
        this.scroll=false;
        console.log("coucou",this.products2.length);
    	};
    },(err)=>{
      console.log(err);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){
    
    if (this.scroll == false ) {
        event.complete();
        event.enable(false);
	     }
    else {   
        
    this.page ++ ;
    console.log("entre_deuxieme_fois2", this.page);
     

    this.WooCommerce.getAsync("products?category="+this.categoryid+"&page="+this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      console.log("moreproducts2", this.page);
      this.products2 = this.products2.concat(JSON.parse(data.body));
      // console.log(this.moreProducts);
      
      if (event != null) {
          console.log("fin event");
          event.complete();
          }

      if (JSON.parse(data.body).length < 10) {
         
          event.enable(false);
    //      this.toastCtrl.create({
     //      message: "pas d'autre produit",
     //       duration: 2500
     //     }).present();
          
        }
      }, (err) => {
      console.log(err);
    }); //fin getAsync

    } //fin else
  } //fin loadmoreproducts

  openProductPage (product){
    console.log(product);
    this.navCtrl.push(ProductDetailsPage, {"product" : product});
  }
} //fin export
