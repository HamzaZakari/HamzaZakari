import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { ServicesService } from '../../AdminArea/services/services.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Cart } from '../../AdminArea/Models/cart';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit, OnDestroy {
  Produits: any[] = [];
  Produits2: any[] = [];
  dataFilter: any[] = [];
  pupupcart: any[] = [];
  pupdata:any[] = [];
  subs: Subscription;
  coloseemodule = false;
  totalproduit = 5;
  produitperpage = 50;
  currentpage = 1;
  pageSize = [20, 30, 40, 60];
  newdate = new Date();
  subs1: Subscription;
  subs2: Subscription;
  slidevalue;
  maxval = 500;
  minval = 1;
  checkbtn = false;
  msg = '';
  cart: Cart[] = [];
  total;
  isloading = false;
  epuisee;
  url;

  constructor(private sevices: ServicesService,  @Inject(DOCUMENT) private document: Document) { }
  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.isloading = true;
    this.sevices.getProduct();
    this.subs1 = this.subs = this.sevices.emitDatapro().subscribe(data => {
      this.Produits2 = data;
      this.dataFilter = this.Produits2;
      this.totalproduit = this.Produits2.length;
    });
  this.datapaginate();
  }
datapaginate(){
  this.sevices.paginationsallpro(this.produitperpage, this.currentpage);
  this.subs = this.sevices.emitpaginat().subscribe(data => {
    this.Produits = data;
    this.Produits.map(key => {
      if(key.quantity == 0) {
        this.epuisee = 'epuisee';
      }
    });
    this.isloading = false;
    this.total = this.Produits.length;
  });
}
  search(keybord) {
    if(keybord == '') {
      this.sevices.paginationsallpro(this.produitperpage, this.currentpage);
      this.subs = this.sevices.emitpaginat().subscribe(data => {
        this.Produits = data;
        this.isloading = false;
        this.total = this.Produits.length;
      });
    }else {
      this.isloading = true;
      const datasearch = this.dataFilter.filter(key => key.title.toLocaleLowerCase().match(keybord.toLocaleLowerCase())
        || key.titlearab.match(keybord) || key.titleengalish.toLocaleLowerCase().match(keybord.toLocaleLowerCase()));
      if (datasearch !== null) {
        this.Produits = datasearch;
        this.isloading = false;
      }
    }
  }
  onChangePage(event: PageEvent) {
    this.currentpage = event.pageIndex + 1;
    this.produitperpage = event.pageSize;
    event.length = this.totalproduit;
    this.sevices.paginationsallpro(this.produitperpage, this.currentpage);
  }


  addtocart(id: string,poids) {
    this.sevices.addtoocart(id,poids);
    this.sevices.gettotaleitem();
    this.sevices.getitemincart();
    setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
        this.pupdata = data;
        const newdata =  this.pupdata.filter(key => key.product_id ==id);
        this.pupupcart = newdata;
        if(this.pupupcart.length > 0) {
          this.coloseemodule = true;
        }
      for(let i = 0 ; i < data.length ; i++) {
        if (data[i].product_id == id) {
          if (data[i].quantity == 0 || data[i].qtypoids == 0) {
            this.checkbtn = true;
            this.msg = 'sorry we don\'t have more quantities';
            setTimeout(() => { this.checkbtn = false; }, 3000);
          }
        }
      }
      },1000);


  }
  paginationsallpro
  // onTouched: (event: any) => {
  // }
  formatLabel(value: number) {
    this.slidevalue = value;
    if (value >= 1) {
      return Math.round(this.slidevalue) + 'dh';
    }

    return this.slidevalue;
  }

  slider(event) {
    this.isloading = true;
    const slideData = this.dataFilter.filter(key => key.price >= event && key.price <= this.maxval);
    if (slideData !== null) {
      this.Produits = slideData;
      this.isloading = false;
    }


  }
  close() {
    this.checkbtn = false;
  }
  closemode(){
    this.coloseemodule = false;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.subs1.unsubscribe();
  }
}
