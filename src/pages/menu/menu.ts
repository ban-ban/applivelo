import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { CartPage } from '../cart/cart';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class Menu {

  homePage: any;
  WooCommerce : any;
  categories : any[];
  loggedIn : boolean ;
  user : any ; //contains the info obtained after log in

  @ViewChild('content') childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl : ModalController, public alertCtrl : AlertController) {
   this.homePage = HomePage ;
   this.categories = [];
   this.loggedIn = false ;
   this.user = {};

    this.WooCommerce = WC({
      url:"http://parolia.net/index.php",
      consumerKey: "ck_f036d85d070370aac81528499965f9d9b6b96830",
      consumerSecret:"cs_52abddeacb5c5a4ccbf9df912ecfee77cd5f3702",
      wpAPI: true,
      version: "wc/v2",
      queryStringAuth: true // Force Basic Authentication as query string true and using under HTTPS
    });

    this.WooCommerce.getAsync("products/categories").then( (data) => {
      console.log("categories", JSON.parse(data.body));
      //this.categories = JSON.parse(data.body);
      // si il existe des sous-categories, on ne garde que les principales
      let temp: any[] = JSON.parse(data.body);
      // we jump category "uncategorized"
      for (let i = 1; i < temp.length; i++ ){
       	if (temp[i].parent == 0){
      		
      		//Pb avec push, il fallait initialiser this.categories
      		this.categories.push(temp[i]);
   	
      	};
      };
      console.log("categories parent", this.categories);
    },(err)=>{
      console.log(err);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Menu');
//    this.storage.ready().then( ()=>{
//      this.storage.get("userLoginInfo").then( (userLoginInfo) => {
//        if (userLoginInfo !=null) {
//          console.log("user already logged in");
//          this.user=userLoginInfo.user; //on remplit la var user avec les infos du login
//          console.log(this.user);
//          this.loggedIn=true;
//        }
//        else {
//          console.log("no user logged");
//          this.user = {};
//          this.loggedIn=false;
//        }
//      })
//    });
  }

  ionViewDidEnter() {
    console.log('did enter Menu');
    this.storage.ready().then( ()=>{
      this.storage.get("userLoginInfo").then( (userLoginInfo) => {
        if (userLoginInfo !=null) {
          console.log("user already logged in");
          this.user=userLoginInfo.user; //on remplit la var user avec les infos du login
          console.log(this.user);
          this.loggedIn=true;
        }
        else {
          console.log("no user logged");
          this.user = {};
          this.loggedIn=false;
        }
      })
    });
  }

  openCategoryPage(categoryid, categoryslug){
    console.log("entre opencategory page", categoryid);
    this.childNavCtrl.setRoot(ProductsByCategoryPage,{"categoryid" :categoryid, "categoryslug":categoryslug});
  }

  openHomePage(){
    console.log("entre openHomePage");
    this.navCtrl.push(HomePage);
  }
 
  openSignupPage(){
    console.log("entre openSignupPage");
    this.navCtrl.push(SignupPage);
  }

  openLoginPage(){
    console.log("entre openLoginPage");
    this.navCtrl.push(LoginPage);
  }
  openCartPage(){
    console.log("entre openCartPage");
    this.navCtrl.push(CartPage);
  }
  openLogoutPage(){
    console.log("entre openLogoutPage");
    this.storage.remove("userLoginInfo").then( ()=> {
      this.user={};
      this.loggedIn=false;
      
    });
    this.alertCtrl.create({
            title:"Log out",
            message: "you are logged out",
            buttons:[{
              text:"Ok",
              handler : ()=>{
                //this.navCtrl.push(MenuPage);
                //how to refresh the page?
              }
            }]
          }).present();
  }
}
