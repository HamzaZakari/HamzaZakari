import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AuthservisesService} from '../authservises.service';
import {LivServiceService} from './liv-service.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ServicesService} from '../services/services.service';
import {Category} from '../Models/category';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-genirate-livraiosn',
  templateUrl: './genirate-livraiosn.component.html',
  styleUrls: ['./genirate-livraiosn.component.css']
})
export class GenirateLivraiosnComponent implements OnInit,OnDestroy {
Product: any[] = [];
FilterProduct: any[] = [];
subs: Subscription;
subs1: Subscription;
Category: Category[] = [];
poids: any[] = [];
isloading = false;
isloading1 = false;
idord;
selected = false;
ids = [];
id;
showall = 'all';
poidsmy;
pricepoidsmy;
priceachatsmy;
mytrue = false;
  checkpoids = false;
ProforCMD:{id_orders,product_id: any,poids: any, pricev: any,pricea: any , qty: any, image: any, title: any, arabtitle: any}[] = [];
ProforCMDFilter:{id_orders,product_id: any,poids: any, pricev: any,pricea: any , qty: any, image: any, title: any, arabtitle: any}[] = [];
produitCMD= [];
selectpoids = false;
url;
  constructor(private serv: LivServiceService, private route: ActivatedRoute, private routes: Router, private servs: ServicesService,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.route.paramMap.subscribe((param:ParamMap) => {
      if (param.has('orid')) {
        this.idord = param.get('orid');
        console.log(this.idord);
    }
    });
    this.isloading = true;
    this.serv.getallprod();
    this.subs = this.serv.emitdatapro().subscribe(data => {
      this.Product = data;
      this.FilterProduct = this.Product;
      if(this.Product) {
        this.isloading = false;
      }
      // this.getpoidsParpro(184);
    })
    this.servs.getCategories();
    this.subs1 = this.servs.emitcategory().subscribe(data => {
      this.Category = data;
    });
    const datas = JSON.parse(sessionStorage.getItem('Admin'));
    if(datas) {
      if (datas[0].Role == 'super admin' || datas[0].Role == 'admin' || datas[0].Role == 'service clients') {
        return;
      } else {
        this.routes.navigate(['/Authentifications']);
      }
    }else {
      this.routes.navigate(['/Authentifications']);
    }
  }
 getpoidsParpro(id) {
this.serv.gettingpoidsparpro(id).subscribe(data => {
  console.log(data);
});
  }
  infopro(product_id,price,poids,priceAchette,prixp, title ,imag , arabtitle){
    const prix = prixp != null?prixp:price;

    var qtypro = 1;
    const data = {
      id_orders: +this.idord,
      product_id: product_id,
      poids: this.poidsmy != null?this.poidsmy:poids,
      pricev: this.pricepoidsmy != null?this.pricepoidsmy:prix,
      pricea: this.priceachatsmy != null?this.priceachatsmy:priceAchette,
      qty: qtypro,
      image: imag,
      title: title,
      arabtitle: arabtitle
    };
 let found = false;
     for(let pro of this.ProforCMD){
       if(pro.product_id != product_id){
         found = false;
         break;
       }else{
         if(pro.product_id == product_id && pro.poids == data.poids && data.poids == this.poidsmy) {
           found = true;
           break;
         }else if(pro.product_id == product_id && pro.poids != data.poids && data.poids != this.poidsmy ){
           found = false;
           break;
         }
       }
     }
     if(this.ProforCMD.length !=0) {
       if (found == false) {
         this.ProforCMD.push(data);
       }
     }
     else{
       this.ProforCMD.push(data);
     }
    this.poidsmy = null;
    this.pricepoidsmy =  null;
    this.priceachatsmy = null;
    console.log(this.ProforCMD);
     this.ProforCMDFilter = this.ProforCMD;
  }
remove(proid, poids){
    const data = this.ProforCMDFilter.filter(key => key.product_id != proid || key.poids != poids );
    this.ProforCMD= data;
    this.ProforCMDFilter = this.ProforCMD;
    console.log(this.ProforCMD);
}
  getpoids(pro_id) {
    this.poidsmy = null;
    this.pricepoidsmy =  null;
    this.priceachatsmy = null;
    this.serv.gettingpoidsparpro(pro_id).subscribe(data => {
      this.poids = data.data;
      if(data.data){
        this.checkpoids = true;
        for (let poid of this.poids) {
          if(poid.product_id == pro_id) {
            this.id = poid.product_id;
          }
        }
      }
    })
  }
  allpoids(product_id, poids,pricepoids,prixAchats){
    if(this.id == product_id) {
      this.poidsmy = poids;
      this.pricepoidsmy =  pricepoids;
      this.priceachatsmy = prixAchats;
    }
}
  ajouterAucmd() {
    this.isloading1 = true;
    var toprixcmd = 0;
    var toprixAchette = 0;
    for (let pro of this.ProforCMD) {
      toprixcmd += pro.pricev;
      toprixAchette +=pro.pricea;
      this.serv.insertnewCMDPRO(this.idord,pro.product_id,pro.qty,pro.poids,pro.pricev, pro.pricea);
      this.servs.updatingqtafterdelete(pro.product_id,pro.qty,pro.poids).subscribe(data => {console.log(data)});
    }
    const prixv = toprixcmd;
    const prixa = toprixAchette;
    this.serv.upditingcmd(this.idord,toprixcmd,toprixcmd,prixa,this.ProforCMD.length);
    setTimeout(()=>{this.routes.navigate(['/dashboard/detail_Order/',this.idord]);this.isloading1 = false;},1000);

  }
  filter(id_cat){
    this.isloading = true;
    if(id_cat !=null) {
      const data = this.FilterProduct.filter(key => key.category_id == id_cat);
      this.Product = data;
      this.isloading = false;
      // this.FilterProduct = this.Product;
      console.log(id_cat);
    }
  }
  getall(){
    this.isloading = true;
    this.serv.getallprod();
    this.serv.emitdatapro().subscribe(data => {
      this.Product = data;
      this.FilterProduct = this.Product;
      if(this.Product) {
        this.isloading = false;
      }
    })
  }
ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.subs1.unsubscribe();
}
}
