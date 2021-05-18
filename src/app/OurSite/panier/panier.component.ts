import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ServicesService } from '../../AdminArea/services/services.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {MatBottomSheet} from '@angular/material';
import {OfersComponent} from '../ofers/ofers.component';
import {DOCUMENT} from '@angular/common';
import {CategoryServService} from '../../AdminArea/services/cat_services/category-serv.service';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})

export class PanierComponent implements OnInit, OnDestroy {
  mydataqty: any;
  checkbtn = false;
  msg = '';
  isloading = false;
  Produit: any[] = [];
  Produit1: any[] = [];
  PROdara: any[] = [];
  Afterdeleting: any[] = [];
  aray = [];
  poids: any;
  myval = 0;
  id: string;
  subtotal = 0;
  subtotal1 = 0;
  subtotal2 = 0;
  check;
  proid: string;
  qte: any;
  subs: Subscription;
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  checksubtotal1 = false;
  checksubtotal2 = false;
  checkqty ;
  check_ofre = false;
  btnofre= true;
  url;
  orders_qty_data = [];
  constructor(private services: ServicesService, private route: Router,
              @Inject(DOCUMENT) private document: Document, private serv: CategoryServService) {
  }


  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.check_ofre = true;
    // setTimeout(()=>{ this._bottomSheet.dismiss(),10000});
    this.subs = this.services.emitcart().subscribe(datap => {
      this.myval = datap.items;
    });
    this.subs1 = this.services.emititemincart().subscribe(datapro => {
      this.Produit = datapro;
      this.Produit1 = datapro;
    });
    this.services.gettotaleitem();

    let data = JSON.parse(localStorage.getItem('panier'));
    let total = 0;
    let sum = 0;
    if(data) {
      for (let i = 0; i < data.length; i++) {
        const price: any = data[i].pricepoids?data[i].pricepoids:data[i].price;
        const qte: any = data[i].qtyPanier;
        this.proid = data[i].product_id;
        total = price * qte;

        sum += total;
        this.subtotal = sum;
      }
    }
    data.forEach(key => {
      this.serv.getrealqty(key.product_id, key.qtyPanier).subscribe(data => {
        this.orders_qty_data.push(data.data[0]);
      })
    })

  }
  // add(qty)  {
  //   qty++;
  // }
  // remove(qty) {
  //   qty--;
  // }
  keypress(event) {
    return event.charCode >= 48 && event.charCode <= 57;
  }

  sume(prId: string, myqte, price, poids?, event?) {
    this.checksubtotal2 = false;
    this.checksubtotal1 = true;
    let sub: any = 0;
    let price1: any = 0;
    let qte1: any = 0;
    let data = JSON.parse(localStorage.getItem('panier'));
    let found = false;
    for (let i = 0; i < data.length; i++){
      if (data[i].product_id == prId && data[i].poids == poids) {
        if(data[i].qtyPanier < 1  || myqte < 1) {
          // alert('hhhhhh');
          const datas = this.Produit1.filter(key => key.product_id == data[i].product_id);
          this.Produit = datas;
        }
        data[i].qtyPanier = +myqte<0?0:+myqte;
        data[i].priceqty = price;
        data[i].priceqty = myqte * price;
        data[i].perpoidsqty = data[i].qtyPanier;
        if (myqte > data[i].perpoidsqty) {
          if (data[i].qtypoids - (myqte - data[i].perpoidsqty) >= 0) {
            data[i].qtypoids = data[i].qtypoids - (myqte - data[i].perpoidsqty);
            // this.services.updatingqtafterdelete(prId, data[i].qtypoids, poids);
          } else if (data[i].qtypoids - (myqte - data[i].perpoidsqty) == 0 || data[i].qtypoids - (myqte - data[i].perpoidsqty)) {
            this.checkbtn = true;
            this.msg = 'désolé nous n\'avons pas plus de quantités';
            setTimeout(() => {
              this.checkbtn = false;
            }, 3000);
            break;
          }

        } else if (myqte < data[i].perpoidsqty) {
          data[i].qtypoids = data[i].qtypoids + (data[i].perpoidsqty - myqte);
          // this.services.updatingqtafterdelete(prId, data[i].qtypoids, poids);
        }

        localStorage.setItem('panier', JSON.stringify(data));
        found = true;
        break;
      }

    }

    for (let i = 0; i < data.length; i++) {
      const pricepo: any = data[i].pricepoids?data[i].pricepoids: data[i].price;
      const qte: any = data[i].qtyPanier;
      price1 = pricepo;
      qte1 = qte;
      sub += price1 * qte1;
      this.qte = data[i].qtyPanier;
    }
    this.subtotal1 = sub;

    this.services.gettotaleitem();
  }
  removetocart(id: string, qte, qtypoids, restqty, price, poids?) {
    const upqty = qtypoids + restqty;
    // this.services.updatingqtafterdelete(id, upqty, poids);
    this.subs2 = this.services.emitlocatstorage().subscribe(data => {
      this.Afterdeleting = data;
      this.Produit = this.Afterdeleting;
      this.sume(id, qte, price);
    });
    this.services.removeproincart(id, poids);
  }
  changepoids(event, id) {
    this.checksubtotal2 = true;
    this.checksubtotal1 = false;
    const data = JSON.parse(localStorage.getItem('panier'));
    this.PROdara = data;
    // console.log(this.PROdara);


    this.services.fetchpoids((event.target.value), id).subscribe(mydata => {
      this.poids = mydata;
      // console.log(this.poids, 'poids atbi poids');
      if (this.poids[0].product_id == id) {
        let sum = 0;
        let total = 0;
        for (let i = 0; i < this.PROdara.length; i++) {
          if (this.PROdara[i].product_id == this.poids[0].product_id) {
            this.PROdara[i].poids = this.poids[0].poids;
            if (this.poids[0].prixPromo != null) {
              this.PROdara[i].pricepoids = this.poids[0].prixPromo;
            } else if (this.poids[0].prxPromo == null) {
              this.PROdara[i].pricepoids = this.poids[0].pricepoids;
            }
            localStorage.setItem('panier', JSON.stringify(data));
            this.services.emititemincart().subscribe(datapro => {
              this.Produit = datapro;
            });
            this.services.getitemincart();
          }
          sum = this.PROdara[i].pricepoids * this.PROdara[i].qtyPanier;
          total += sum;
          this.subtotal2 = total;
        }
      }
      this.services.gettotaleitem();
    });
  }


  passorder() {
    this.isloading = true;
    const qtys = [];
    let check = false;
    let panier = JSON.parse(localStorage.getItem('panier'));
    let index = 0;
    for (let pro of panier) {
      index++;
       for (let q of this.orders_qty_data) {
         if (pro.product_id == q.product_id && pro.qtyPanier > q.quantity) {
           this.checkqty = true;
                 this.checkbtn = true;
                 check = true;
                 this.msg = "La quantité que vous avez sélectionnée n'est pas disponible  " + pro.poids + "  |" + (pro.title != 'null'?pro.title:'')+ "(" + pro.title_arab + ")";
                 setTimeout(() => {
                   this.checkbtn = false;
                   this.isloading = false;
                   }, 2000);
                 qtys.push(pro);
                 return;

         } else {
           //
         }
       }
    }
      if(!check){
        if (this.subtotal1 <= 0 && this.subtotal2 <= 0) {

          localStorage.setItem('total', JSON.stringify(this.subtotal));
        } else if (this.subtotal1 > 0) {

          localStorage.setItem('total', JSON.stringify(this.subtotal1));

        } else if (this.subtotal2 > 0) {
          localStorage.setItem('total', JSON.stringify(this.subtotal2));
        }
        setTimeout(()=> {
          this.isloading = false;
          this.route.navigate(['/checkout']);
        },1000)
    }

  }
  close() {
    this.checkbtn = false;
  }
  closeofre()  {
    this.btnofre = false;
}
  ngOnDestroy(): void {
    if (this.subs && this.subs1) {
      this.subs.unsubscribe();
      this.subs1.unsubscribe();
    }
  }
}
