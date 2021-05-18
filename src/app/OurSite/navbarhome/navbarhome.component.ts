import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/AdminArea/Models/category';
import { ServicesService } from 'src/app/AdminArea/services/services.service';

@Component({
  selector: 'app-navbarhome',
  templateUrl: './navbarhome.component.html',
  styleUrls: ['./navbarhome.component.css']
})
export class NavbarhomeComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  search = false;
  shrink;
  coloapse = '';
  checknave = true;
  checknave2 = false;
  openres = '';
  changenav = '';
  cartnav = '';
  links = '';
  iconsearch = '';
  cartnavcart = '';
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
  cartPro: any[] = [];
  Category: Category[] = [];
  totalprice = 0;
  open = false;
  cart = false;
  messagecart = '';
  totoprice;
  constructor(@Inject(DOCUMENT) private document: any, private services: ServicesService) {
  }

  ngOnInit() {
    this.open = true;
    this.subs = this.services.emitcart().subscribe(datap => {
      this.totalprice = datap.items;
      this.total = datap.total;

      this.subs1 = this.services.emititemincart().subscribe(datapro => {
        this.cartPro = datapro;
      });
      this.services.getitemincart();
    });
    this.services.gettotaleitem();
    this.services.getCategories();
    this.subs2 = this.services.emitcategory().subscribe(data => {
      this.Category = data;
    });
  }

  openresopnsivenave() {

    this.checknave2 = !this.checknave2;
    if (this.checknave2 == true) {
      this.coloapse = 'openmycart';
    } else {
      this.coloapse = '';
    }}
  some() {
    this.cart = !this.cart;
  }

  @HostListener('window:scroll', [])

  onWindowScroll() {
    const number = window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;
    if (number >= 80) {
      this.changenav = 'changenav';
      this.cartnav = 'cartnav';
      this.links = 'navlinks';
      this.iconsearch = 'iconsearch';
      this.cartnavcart = 'cartnavcart';

    } else {
      this.changenav = '';
      this.cartnav = '';
      this.cartnavcart = '';
      this.links = '';
      this.iconsearch = '';
    }

  }
  ngOnDestroy(): void {
    if (this.subs && this.subs2 && this.subs1) {
      this.subs.unsubscribe();
      this.subs1.unsubscribe();
      this.subs2.unsubscribe();
    }
  }
}
