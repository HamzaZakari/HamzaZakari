import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ServicesService} from '../services/services.service';
import {Products} from '../Models/products';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Category} from '../Models/category';
import {NewserviceforproductService} from './newserviceforproduct.service';
import {DOCUMENT} from '@angular/common';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-allproduct',
  templateUrl: './allproduct.component.html',
  styleUrls: ['./allproduct.component.css']
})
export class AllproductComponent implements OnInit , OnDestroy {
  epuisee = false;

  id;
  role;
products: Products[] = [];
searchpro: Products[] = [];
Category: Category[] = [];
subs: Subscription;
subs1: Subscription;
staticAlertClosed = true;
message = '';
datarecap: any[] = [];
  times: any;
  isloding = false;
  countProduit;
  nav = true;
  url;
  constructor(private servise: ServicesService,
              private serv: NewserviceforproductService,
    private route: Router, @Inject(DOCUMENT) private document: Document,
  private SnackBar: MatSnackBar) { }

  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.times = new Date();
    this.isloding = true;
    this.servise.getProduct();
    this.subs = this.servise.emitDatapro().subscribe((data: Products[] ) => {
      this.products = data;
      this.searchpro = this.products;
      this.isloding = false;
      this.countProduit = this.products.length;
    });
    this.servise.getCategories();
    this.subs1 = this.servise.emitcategory().subscribe(data => {
      this.Category = data;
      this.isloding = false;
    });
    const datass = JSON.parse(sessionStorage.getItem('Admin'));
    if(datass) {
      this.role = datass[0].Role;
      if (datass[0].Role == 'super admin') {
        return;
      }else if (datass[0].Role == 'admin' || datass[0].Role == 'service clients') {
        return;
      } else {
        alert(datass[0].Role);
        this.route.navigate(['/Authentifications']);
      }
    }else {
      alert(datass[0].Role +'hahhaha');
      this.route.navigate(['/Authentifications']);
    }
  }
  delete(proId: string, image) {
    console.log(image);
  this.servise.deletePro(proId, image);
  this.staticAlertClosed = false;
  }
  filterparCat(id) {
    console.log(id);
    if (id != null) {
      const data = this.searchpro.filter(key => key.catid ==id);
      this.products = data;
    }else {
      this.ngOnInit();
    }
  }
  showall(){
    this.isloding = true;
    this.servise.getProduct();
    this.servise.emitDatapro().subscribe((data: Products[] ) => {
      this.products = data;
      this.searchpro = this.products;
      this.isloding = false;
      this.countProduit = this.products.length;
    });

  }
// search products
  search(event) {
    console.log(event);
    console.log(event.target.value);
    if (event.target.value !== '') {
      this.isloding = true;
      const searchdata = this.searchpro.filter(key => key.title.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) ||
        key.titleengalish.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) ||
        key.titlearab.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()));
      this.products = searchdata;
      this.isloding = false;
    } else if (event.target.value === '') {
      this.isloding = true;
      this.ngOnInit();
      this.isloding = false;
    }
  }
  managepoids(id){
    console.log(id);
  }
  epuise(id,poids) {
    this.epuisee = true;
    this.id = id;
    this.serv.epuiseepro(id,poids).subscribe(data => {
      console.log(data.data);
      if(data.data == 'epuise') {
        this.servise.getProduct();
        this.servise.emitDatapro().subscribe((data: Products[] ) => {
          this.products = data;
          this.searchpro = this.products;
          this.countProduit = this.products.length;
            this.epuisee = false;
        });
      }
    });

  }
  gotoADDpro() {
    this.route.navigate(['/dashboard/add_product']);
  }
// end search products
  ngOnDestroy(): void {
    if (this.subs && this.subs1) {
      this.subs.unsubscribe();
      this.subs1.unsubscribe();
    }
  }
}
