import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {PackserviceService} from '../pack/packservice.service';
import {Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {ServicesService} from '../../../AdminArea/services/services.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-top-selling-product',
  templateUrl: './top-selling-product.component.html',
  styleUrls: ['./top-selling-product.component.css']
})
export class TopSellingProductComponent implements OnInit, OnDestroy {
subs:Subscription;
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
top_sale_pro: any[] =[];
datas_pro: any[] = [];
  pupdata:any[] = [];
  pupupcart: any[] = [];
  coloseemodule = false;
  added = false;
  showModules = false;
  detaul_data: any = [];
  pro_id_fo_detai_pro = null;
  poidspoids = null;
  poidsprice = null;
  prixp = null;
  qtypoids = null;
  poids: any[] = [];
  PoidsQuick: any[] =[];
  QuickDetail: any = [];
  proID;
  subs4: Subscription;
  constructor(private serv: PackserviceService,private MatSnakbar: MatSnackBar,@Inject(DOCUMENT) private document: Document, private myserv: ServicesService) { }

  ngOnInit(): void {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.subs = this.serv.getting_top_selling_pro().subscribe(data=>{
        this.datas_pro = data.data;
    }, error => {
      console.log(error);

    })
  }
  getproPoids(id) {
    this.myserv.gettingpoids(id);
    this.subs4 = this.myserv.emitPoidspro().subscribe(data => {
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
    this.myserv.addtoocart(product_id, poids);
    this.added = true;
    this.myserv.gettotaleitem();

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
  addtocart2(product_id , title,poids, poidspoids , poidsprice , prixp , qtypoids ) {
    if(poidsprice && poidspoids){
      const poids = poidsprice.trim();
      this.myserv.addtoocart(product_id, poids, poidspoids, prixp, qtypoids);
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
      this.myserv.addtoocart(product_id,poids);
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
    this.myserv.gettotaleitem();
    this.myserv.getitemincart();
  }
  // quick_view(product_id) {
  //   this.pro_id_fo_detai_pro = product_id;
  //   this.showModules = true;
  //   this.myserv.getsinglepro(product_id).subscribe(data => {
  //     this.detaul_data = data;
  //     console.log(this.detaul_data);
  //     console.log(this.detaul_data);
  //     this.getproPois();
  //   })
  //
  //   console.log(product_id);
  // }
  getproPois() {
    console.log(this.pro_id_fo_detai_pro);
    this.myserv.gettingpoids(this.pro_id_fo_detai_pro);
    this.subs = this.myserv.emitPoidspro().subscribe(data => {
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
    //...
  if(this.subs) {
    this.subs.unsubscribe();
  }
}
}
