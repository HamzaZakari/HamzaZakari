import { Component, HostListener, Inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Category } from 'src/app/AdminArea/Models/category';
import { ServicesService } from 'src/app/AdminArea/services/services.service';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-secondnavbar',
  templateUrl: './secondnavbar.component.html',
  styleUrls: ['./secondnavbar.component.scss']
})
export class SecondnavbarComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  search = false;
  shrink;
  coloapse = '';
  checknave = true;
  checknave2 = false;
  openres = '';
  changenav = 'navbar';
  cartnav = '';
  links = '';
  iconsearch = '';
  cartnavcart = '';
  res_nav = '';
  public navIsFixed: boolean = false;
  height: string;
  opencart = false;
  navcart: string;
  ip: any;
  total: any;
  myClass = '';
  check = false;
  subs: Subscription;
  subs1: Subscription;
  subs2: Subscription;
  subs9: Subscription;
  cartPro: any[] = [];
  Category: Category[] = [];
  totalprice = 0;
  open = false;
  cart = false;
  car_resp = '';
  messagecart = '';
  totoprice;
  close_side_nav = '';
  openpupuspanier = '';
  panier;
  url;
  Thetotalprice = 0;
  constructor(@Inject(DOCUMENT) private document: any, private services: ServicesService, private route: Router) {
  }

  ngOnInit() {
    if(document.location.hostname =='localhost'){
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    } else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.open = true;
    this.subs = this.services.emitcart().subscribe(datap => {
      this.totalprice = datap.items;
      this.total = datap.total;

      this.subs1 = this.services.emititemincart().subscribe(datapro => {
        this.cartPro = datapro;
        let total = 0;
        this.cartPro.forEach(key => {
          console.log(key.price, this.Thetotalprice);
          total +=(key.price * key.qtyPanier);
        })
        this.Thetotalprice = total;
      });
      this.services.getitemincart();
    });
    this.services.gettotaleitem();
    this.services.getCategories();
    this.subs2 = this.services.emitcategory().subscribe(data => {
      this.Category = data;
    });
  }
   openpupus() {
    this.openpupuspanier = 'openclass';
   }
  closepupus(){
    this.openpupuspanier = '';
  }
  openresopnsivenave() {

    this.checknave2 = !this.checknave2;
    if (this.checknave2 == true) {
      this.coloapse = 'openmycart';
    } else {
      this.coloapse = '';
    }
  }
  removetocart(id: string, qte, qtypoids, restqty, price, poids?) {
    const upqty = qtypoids + restqty;
    // this.services.updatingqtafterdelete(id, upqty, poids);
    this.subs2 = this.services.emitlocatstorage().subscribe(data => {
      this.cartPro = data;
    });
    this.Thetotalprice = this.Thetotalprice - (price * qte);
    console.log(this.Thetotalprice, price, qte);
    this.services.removeproincart(id, poids);
    this.total = this.cartPro.length;
  }
  @HostListener('window:scroll', [])

  onWindowScroll() {
    const number = window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;
    if (number >= 50) {
      this.changenav = 'scrollnav';
      this.cartnav = 'cartnav';
      this.links = 'navlinks';
      this.iconsearch = 'iconsearch';
      this.cartnavcart = 'cartnavcart';

    } else {
      this.changenav = 'navbar';
      this.cartnav = '';
      this.cartnavcart = '';
      this.links = '';
      this.iconsearch = '';
    }
    if (window.innerWidth <= 500 && number > 20) {
      this.res_nav = 'responsive_nav';
      this.car_resp = 'cart-resp';
    } else {
      this.res_nav = '';
      this.car_resp = '';
    }

  }

  scrollto() {
    if (document.location.href === 'https://chia.ma' || document.location.href === 'http://localhost:4200') {
      window.scrollTo(0, 599);
    } else {
      this.route.navigate(['/']);
      setTimeout(() => {
        window.scrollTo(0, 599);
      }, 900)
    }
  }

  closesidenav() {
    this.close_side_nav = 'close';
  }

  opensidenav() {
    this.close_side_nav = 'opensidenav';
  }
  click_logo() {
    this.route.navigate(['/']);
    window.scrollTo(0,0);
  }
  Acheter() {
    localStorage.setItem('total', JSON.stringify(this.Thetotalprice));
    setTimeout(() => {
      this.route.navigate(['/checkout']);
    }, 200)
  }
  ngOnDestroy(): void {
    if (this.subs && this.subs2 && this.subs1) {
      this.subs.unsubscribe();
      this.subs1.unsubscribe();
      this.subs2.unsubscribe();
    }
  }
}
