import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import { ServicesService } from '../../AdminArea/services/services.service';
import { Category } from '../../AdminArea/Models/category';
import { Subscription } from 'rxjs';
import { Products } from '../../AdminArea/Models/products';
import { ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import {OfersComponent} from '../ofers/ofers.component';
import {MatBottomSheet} from '@angular/material';
import {AuthservisesService} from '../../AdminArea/authservises.service';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  subs3: Subscription;
  imagesS: {id_slider: number,images: any, product_id: number, cat_id: number, boutique_id: number, date: any}[] = [];
  checkbtn = false;
  msg = '';
  dataFilter: any[] = [];
  pupupcart: any[] = [];
  coloseemodule = false;
  pupdata:any[] = [];
  height: string;
  tele: string;
  opend: string;
  Category: Category[] = [];
  Produits: any[] = [];
  subs: Subscription;
  subs2: Subscription;
  added = false;
  alert = false;
  alerttext = '';
  alertmessage = '';
  proimagealert;
  Palert = false;
  ProPanier: Products;
  isloading = false;
  isloading2 = false;
  imagesdata: any[] = [];
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  url;
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  slides: any = [[]];
  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }
  constructor(private services: ServicesService,private _bottomSheet: MatBottomSheet, private route: Router,
              private serv: AuthservisesService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.isloading2 = true;
    this.services.getCategories();
    this.subs = this.services.emitcategory().subscribe(data => {
      this.Category = data;
        this.isloading2 = false;
      // this.services.getall_image().subscribe( data=>{
      //   this.imagesdata = data.data;
      //   console.log(this.imagesdata);
      // });
    });
    setTimeout(() => {
      this.isloading = true;
      this.services.getNewProduct();
      this.subs2 = this.services.emitdatanew().subscribe(data => {
        this.Produits = data;
        this.isloading = false;
      });
      this.subs3 = this.serv.getAllsliderimages().subscribe(data => {
        this.imagesS = data.data;
        // this.updateimages();
      })
    }, 1000)
  }
 //  updateimages() {
 //    console.log('hamza');
 //  for(let i =0 ; i < this.imagesdata.length ;i++) {
 //    this.services.upimages(this.imagesdata[i].id_image, this.imagesdata[i].images.slice(33,1000)).subscribe(data =>{
 //      console.log(data.data);
 //    });
 //  }
 // }
  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;

  }
  sliderroute(prod, cat, boutique_id) {
    if(prod !== 0) {
      this.route.navigate(['/product_detail', prod]);
    } else if(prod === 0 && cat !== 0) {
      this.route.navigate(['/products', boutique_id ,cat]);
    } else {
      return;
    }
  }
  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
  // getcatpro(catId) {
  //   console.log(catId);
  // }
  open() {
    this.opend = 'open';
  }
  closebtn() {
    this.checkbtn = false;
  }

  close() {
    this.alerttext = 'fadeclass';
    setTimeout(() => {
      this.alerttext = '';
      this.alert = true;
    }, 2000);
  }
  addtocart(id: string, poids?: any) {
    this.services.addtoocart(id, poids);
    this.added = true;
    this.services.gettotaleitem();
    this.services.getitemincart();
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
  closemode(){
    this.coloseemodule = false;
  }
  gotowhatsap() {
    if(window.innerWidth > 900) {
      window.open('https://web.whatsapp.com/send?phone=212 701232223&text=');
    } else {
      window.open('https://api.whatsapp.com/send?phone=212 701232223&text=');
    }
  }
  cat_event(idb, idc) {
    this.route.navigate(['/products', idb, idc]);
  }
  ngOnDestroy(): void {
    if (this.subs && this.subs2 && this.subs3) {
      this.subs.unsubscribe();
      this.subs2.unsubscribe();
      this.subs3.unsubscribe();
    }
  }
}

