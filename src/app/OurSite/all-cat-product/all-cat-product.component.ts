import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { ServicesService } from '../../AdminArea/services/services.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Products } from '../../AdminArea/Models/products';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {CategoryServService} from '../../AdminArea/services/cat_services/category-serv.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-all-cat-product',
  templateUrl: './all-cat-product.component.html',
  styleUrls: ['./all-cat-product.component.css']
})
export class AllCatProductComponent implements OnInit, OnDestroy {
  checkbtn = false;
  msg = '';
  pupupcart: any[] = [];
  pupdata:any[] = [];
  coloseemodule = false;
  epuisee='';
  isloading2 = false;
  catId: string;
  Produits: any[] = [];
  dataFilter: any[] = [];
  subs: Subscription;
  newdate = new Date();
  imagecat;
  titlecat;
  titlearab;
  total;
  isloading = false;
  message = 'YOUR IP ADDRESS - ';
  Ip: any;
  privateIP;
  publicIP;
  private ClientIP: any;
  url;
  constructor(private service: ServicesService,private serv: CategoryServService,
              private route: ActivatedRoute, private http: HttpClient,   @Inject(DOCUMENT) private document: Document) {
  }
  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('catId')) {
        this.catId = paramMap.get('catId');
        this.isloading2 = true;
        this.subs = this.service.getProductsParCategory(this.catId).pipe(map((datapro) => {
          return {
            Produits: datapro.results.map(proData => {
              return {
                id: proData.product_id,
                title: proData.title,
                titlearab: proData.title_arab,
                titleengalish: proData.titleAng,
                descreption: proData.descreption,
                image: proData.image,
                price: proData.price,
                poids: proData.poids,
                pricea: proData.priceAchette,
                pricep: proData.pricePromo,
                quantity: proData.quantity,
                state: proData.state,
                imagecat: proData.imagecat,
                Libele: proData.titleFr,
                titleArab: proData.titleArab,
              };
            }),
          };
        }))
          .subscribe(proData => {
            this.Produits = proData.Produits;
            this.dataFilter = this.Produits;
            this.Produits.map(key => {
              if(key.quantity == 0) {
                this.epuisee = 'epuisee';
              }
            });
            if (this.Produits.length > 0) {
              this.isloading2 = false;
            } else {
              this.isloading2 = true;
              setTimeout(() => { this.isloading2 = false; }, 600)

            }
            this.total = this.Produits.length;
            if (proData.Produits[0]) {
              this.imagecat = proData.Produits[0].imagecat;
              this.titlecat = proData.Produits[0].Libele;
              this.titlearab = proData.Produits[0].titleArab;
            }
          });
      }
    });
  }
  addtocart(id: string, poids?: any) {
    this.service.addtoocart(id, poids);
    this.service.gettotaleitem();
    this.service.getitemincart();
    setTimeout(()=>{
      const data = JSON.parse(localStorage.getItem('panier'));
      this.pupdata = data;
      const newdata =  this.pupdata.filter(key => key.product_id == id);
      this.pupupcart = newdata;
      if(this.pupupcart) {
        this.coloseemodule = true;
      }
      for (let i = 0; i < data.length; i++) {
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
  search(keybord) {
    this.isloading = true;
    const datasearch = this.dataFilter.filter(key => key.title.toLocaleLowerCase().match(keybord.toLocaleLowerCase())
      || key.titlearab.match(keybord) || key.titleengalish.toLocaleLowerCase().match(keybord.toLocaleLowerCase()));
    if (datasearch !== null) {
      this.Produits = datasearch;
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
  }

}
