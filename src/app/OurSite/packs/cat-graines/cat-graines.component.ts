import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PackserviceService} from '../pack/packservice.service';
import {ServicesService} from '../../../AdminArea/services/services.service';
import {DOCUMENT} from '@angular/common';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-cat-graines',
  templateUrl: './cat-graines.component.html',
  styleUrls: ['./cat-graines.component.css']
})
export class CatGrainesComponent implements OnInit, OnDestroy {
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    interval: 2000,
    nav: true,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 4
      },
      740: {
        items: 5
      },
      940: {
        items: 5
      }
    }
  }
  url;
  cat_meil: any[] = [];
  subs: Subscription;
  pupdata:any[] = [];
  pupupcart: any[] = [];
  coloseemodule = false;
  added = false;
  cat_id;
  boutique_id;
  showModules = false;
  detaul_data: any = [];
  pro_id_fo_detai_pro = null;
  poidspoids = null;
  poidsprice = null;
  prixp = null;
  qtypoids = null;
  poids: any[] = [];
  proID;
  QuickDetail: any = [];
  PoidsQuick: any[] = [];
  subs4: Subscription;
  constructor(private serv: PackserviceService,private serv2: ServicesService,  @Inject(DOCUMENT) private document: Document, private MatSnakbar: MatSnackBar) { }

  ngOnInit(): void {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.subs = this.serv.getcat_graines().subscribe(data => {
      this.cat_meil = data.data;
      this.cat_id = data.data[0].category_id;
      this.boutique_id = data.data[0].id_boutique;
    })
  }
  getproPoids(id) {
  this.serv2.gettingpoids(id);
  this.subs4 = this.serv2.emitPoidspro().subscribe(data => {
    this.PoidsQuick = data;
  });
 }
 show_quicks(id) {
  this.proID = id;
  // this.show_quick = 'show_quick';
  this.serv.get_quick_detail(id).subscribe(data => {
    this.QuickDetail = data.data;
    this.getproPoids(id);
  });
 }

  addtocart(product_id,title,poids?){
    //...
    this.serv2.addtoocart(product_id, poids);
    this.added = true;
    this.serv2.gettotaleitem();
    this.serv2.getitemincart();
    this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});

    setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
      this.pupdata = data;
      const newdata =  this.pupdata.filter(key => key.product_id ==product_id);
      this.pupupcart = newdata;
      if(this.pupupcart.length > 0) {
        this.coloseemodule = true;
      }
      for(let i = 0 ; i < data.length ; i++) {
        if (data[i].product_id == product_id) {
          if (data[i].quantity == 0 || data[i].qtypoids == 0) {
            // this.msg = 'sorry we don\'t have more quantities';
            // setTimeout(() => { this.checkbtn = false; }, 3000);
          }
        }
      }
    },1000);
  }
  addtocart2(product_id ,poids, poidspoids , poidsprice , prixp , qtypoids ) {
    if(poidsprice && poidspoids){
      const poids = poidsprice.trim();
      this.serv2.addtoocart(product_id, poids, poidspoids, prixp, qtypoids);
      setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
        this.pupdata = data;
        const newdata =  this.pupdata.filter(key => key.product_id == product_id);
        this.pupupcart = newdata;
        if(this.pupupcart) {
          this.coloseemodule = true;
        }
      },1000);
    }else{
      this.serv2.addtoocart(product_id,poids);
      setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
        this.pupdata = data;
        const newdata =  this.pupdata.filter(key => key.product_id ==product_id);
        this.pupupcart = newdata;
        if(this.pupupcart) {
          this.coloseemodule = true;
        }
      },1000);
    }
    this.serv2.gettotaleitem();
    this.serv2.getitemincart();
  }
  quick_view(product_id) {
    this.pro_id_fo_detai_pro = product_id;
    this.showModules = true;
    this.serv2.getsinglepro(product_id).subscribe(data => {
      this.detaul_data = data;
      this.getproPois();
    })

    console.log(product_id);
  }
  getproPois() {
    console.log(this.pro_id_fo_detai_pro);
    this.serv2.gettingpoids(this.pro_id_fo_detai_pro);
    this.subs = this.serv2.emitPoidspro().subscribe(data => {
      this.poids = data;
    });
  }
  click(event ,pricepoids ,qtypoids,prixa,prixp ,id, poids){
    this.poidspoids = poids;
    this.poidsprice = pricepoids;
    this.prixp = prixp;
    this.qtypoids = qtypoids;
    console.log(event ,pricepoids ,qtypoids,prixa,prixp ,id, poids);
  }
  ngOnDestroy(): void {
    //..
    if(this.subs) {
      this.subs.unsubscribe();
    }
  }


}
