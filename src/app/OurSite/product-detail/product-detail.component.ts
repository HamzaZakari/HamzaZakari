import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ServicesService } from '../../AdminArea/services/services.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Products } from '../../AdminArea/Models/products';
import { ManagePoids } from '../../AdminArea/Models/manage-poids';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  checkbtn = false;
  poidspoids;
  imagemy;
  msg = '';
  proId: string;
  produit: any;
  poids: Products[] = [];
  CategoryProduit: any[] = []
  detilPoids: any[] = [];
  image: string;
  poidprice: number;
  pricea: number;
  qtypoids: number;
  pricep: number;
  poidschange: any;
  images: any[] = [];
  previewImage;
  checkimage = false;
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  subs5: Subscription;
  subs6: Subscription;
  isloading = false;
  newdate = new Date();
  pupupcart: any[] = [];
  pupdata:any[] = [];
  coloseemodule = false;
  url;
  constructor(private service: ServicesService, private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document, private MatSnakbar: MatSnackBar) {
  }
  ngOnInit() {
    if(document.location.hostname =='localhost'){
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    } else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.previewImage= null;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('proId')) {
        this.proId = paramMap.get('proId');
        this.subs1 = this.service.getsinglepro(this.proId).subscribe(proData => {
          const product = {
            id: proData[0].product_id,
            catid: proData[0].category_id,
            title: proData[0].title,
            titlearab: proData[0].title_arab,
            descreption: proData[0].descreption,
            image: proData[0].image,
            price: proData[0].price,
            poids: proData[0].poids ? proData[0].poids : null,
            quantity: proData[0].quantity,
            prixv: proData[0].poidsprice,
            prixa: proData[0].prixAchats,
            qtypoids: proData[0].qtypoids,
            prixPromo: proData[0].prixPromo,
            Libele: proData[0].Libele,
            catId: proData[0].cat_id,
            state: proData[0].state
          };
          this.produit = product;
          this.previewImage = this.produit.image;
        });
      }
      this.subs2 = this.service.gettingDetailProducts(this.proId).subscribe(data => {
        this.detilPoids = data.data;
        this.getProductImages();
        this.getproPois();
        this.isloading = true;
        if (this.produit) {
          this.subs3 = this.service.gettingallproforsingleprodetail(this.produit.catId, this.proId).subscribe(datapro => {
            this.CategoryProduit = datapro.data;
            if(this.CategoryProduit) {
            }else{
// same here
            }
            this.isloading = false;
          })
        }
      });


    });

  }

  getProductImages() {
    this.subs5 = this.service.getImagePro(this.proId).subscribe(data => {
      this.images = data.data;
      this.imagemy = this.images[0].images;
    });
  }

  getproPois() {
    this.service.gettingpoids(this.proId);
    this.subs4 = this.service.emitPoidspro().subscribe(data => {
      this.poids = data;
    });
  }
  showImage(image, id) {
    this.checkimage = true;
      this.previewImage = image;
  }
  close() {
    this.checkbtn = false;
  }
  click(event, pricev, qty, pricea, pricep, id?, poids?) {
    this.poidschange = event.target.innerHTML;
    if (event) {
      this.poidspoids = poids;
      this.poidprice = pricev;
      this.qtypoids = qty;
      this.pricea = pricea;
      this.pricep = pricep;
    } else {
      return;
    }
  }

  addtocart(id: string,title,poids?: any, poidprice?: any, poidschange?: any, pricepromo?: any, qty?: any) {
if(poidprice && poidschange){
  const poids = poidprice.trim();
  this.service.addtoocart(id, poids, poidschange, pricepromo, qty);
  this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});

  setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
    this.pupdata = data;
    const newdata =  this.pupdata.filter(key => key.product_id ==id);
    this.pupupcart = newdata;
    if(this.pupupcart) {
      this.coloseemodule = true;
    }
    for(let i = 0 ; i < data.length ; i++) {
      if (data[i].product_id == id) {
        if (data[i].quantity == 0 || data[i].qtypoids == 0) {
          this.checkbtn = true;
          this.msg = 'sorry we don\'t have more quantities';
          this.MatSnakbar.open('le produit est epuisé', 'x', {panelClass: 'error', verticalPosition: 'bottom', duration: 2000});

          setTimeout(() => { this.checkbtn = false; }, 3000);
        }
      }
    }
  },1000);
}else{
  this.service.addtoocart(id,poids);
  this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});

  setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
    this.pupdata = data;
    const newdata =  this.pupdata.filter(key => key.product_id ==id);
    this.pupupcart = newdata;
    if(this.pupupcart) {
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
    this.service.gettotaleitem();
    this.service.getitemincart();
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
  ngOnDestroy(): void {
    if(this.subs1 && this.subs2  && this.subs3 && this.subs4 && this.subs5) {
      this.subs1.unsubscribe();
      this.subs2.unsubscribe();
      this.subs3.unsubscribe();
      this.subs4.unsubscribe();
      this.subs5.unsubscribe();
    }
  }
}
