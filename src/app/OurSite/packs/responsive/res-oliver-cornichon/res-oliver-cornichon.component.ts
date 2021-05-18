import {Component, Inject, OnInit} from '@angular/core';
import {PackserviceService} from '../../pack/packservice.service';
import {ServicesService} from '../../../../AdminArea/services/services.service';
import {DOCUMENT} from '@angular/common';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-res-oliver-cornichon',
  templateUrl: './res-oliver-cornichon.component.html',
  styleUrls: ['./res-oliver-cornichon.component.css']
})
export class ResOliverCornichonComponent implements OnInit {
  PoidsQuick: any[] = [];
  QuickDetail: any = [];
  proID;
  subs4: Subscription;
  meil1: any[] = [];
  meil2: any[] = [];
  url;
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
  constructor(private pack: PackserviceService,private serv2: ServicesService ,private MatSnakbar: MatSnackBar,private services: ServicesService,@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.pack.getcat_oliver_cornichon().subscribe(data => {
      this.meil1 = data.data.slice(0,2);
      this.meil2 = data.data.slice(2,4);
      this.cat_id = data.data[0].category_id;
      this.boutique_id = data.data[0].id_boutique;
    })
  }
  getproPoids(id) {
    this.services.gettingpoids(id);
    this.subs4 = this.services.emitPoidspro().subscribe(data => {
      this.PoidsQuick = data;
    });
  }
  show_quicks(id) {
    this.proID = id;
    this.pack.get_quick_detail(id).subscribe(data => {
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
  addtocart2(product_id ,title,poids, poidspoids , poidsprice , prixp , qtypoids ) {
    if(poidsprice && poidspoids){
      const poids = poidsprice.trim();
      this.services.addtoocart(product_id, poids, poidspoids, prixp, qtypoids);
      this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});

      setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
        this.pupdata = data;
        const newdata =  this.pupdata.filter(key => key.product_id == product_id);
        this.pupupcart = newdata;
        if(this.pupupcart) {
          this.coloseemodule = true;
        }
      },1000);
    }else{
      this.services.addtoocart(product_id,poids);
      this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});

      setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
        this.pupdata = data;
        const newdata =  this.pupdata.filter(key => key.product_id ==product_id);
        this.pupupcart = newdata;
        if(this.pupupcart) {
          this.coloseemodule = true;
        }
      },1000);
    }
    this.services.gettotaleitem();
    this.services.getitemincart();
  }
  quick_view(product_id) {
    this.pro_id_fo_detai_pro = product_id;
    this.showModules = true;
    this.services.getsinglepro(product_id).subscribe(data => {
      this.detaul_data = data;
      this.getproPois();
    })

    console.log(product_id);
  }
  getproPois() {
    console.log(this.pro_id_fo_detai_pro);
    this.services.gettingpoids(this.pro_id_fo_detai_pro);
    this.subs = this.services.emitPoidspro().subscribe(data => {
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
}
