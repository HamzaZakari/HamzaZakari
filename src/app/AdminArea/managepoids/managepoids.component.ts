import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthservisesService} from '../authservises.service';
import {Subject, Subscription} from 'rxjs';
import {NewserviceforproductService} from '../allproduct/newserviceforproduct.service';

@Component({
  selector: 'app-managepoids',
  templateUrl: './managepoids.component.html',
  styleUrls: ['./managepoids.component.css']
})
export class ManagepoidsComponent implements OnInit, OnDestroy {
  idloading = false;
  id;
  id2;
  data;
  isepuise = false;
  thisvar = '';
prodId;
emitData =  new Subject<{id_manage_gramage: number, product_id: number, poids: string,pricepoids: any,prixAchats: any,prixPromo: any,qtypoids: any,defaults:any, created_at: any}[]>();
poids: {id_manage_gramage: number, product_id: number, poids: string,pricepoids: any,prixAchats: any,prixPromo: any,qtypoids: any,defaults:any, created_at: any}[]= [];
  poidsfilter: {id_manage_gramage: number, product_id: number, poids: string,pricepoids: any,prixAchats: any,prixPromo: any,qtypoids: any,defaults:any, created_at: any}[]= [];
  subs1: Subscription;
  subs2: Subscription;
  constructor(private route: ActivatedRoute, private serv: AuthservisesService, private serv2: NewserviceforproductService) { }

  ngOnInit() {
    this.subs1 = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('prodId')) {
        this.prodId = paramMap.get('prodId');
  }
});
    this.gettingUpThePoids(this.prodId);
  }
  gettingUpThePoids(id) {
    this.subs2 = this.serv.managepoids(id).subscribe(data => {
          this.poids = data.data;
          this.emitData.next([...this.poids]);
          this.poidsfilter= this.poids;
        })
  }
delete(id_gramage, proid,poids){
    this.serv.deletepoids(proid,poids,id_gramage).subscribe(data => {
      console.log(data.data);
    })
    console.log(id_gramage,proid);
    const deletedata = this.poidsfilter.filter(key =>key.id_manage_gramage !=id_gramage);
    this.poids = deletedata;
    this.poidsfilter = this.poids;
}
  updefaults(id_manage_gramage,product_id,poids,qtypoids,prixPromo,prixAchats,pricepoids){
    console.log(id_manage_gramage,product_id,poids,qtypoids,prixPromo,prixAchats,pricepoids);
    this.poids.map(key => {if(key.id_manage_gramage == id_manage_gramage) {this.idloading = true; }})
    this.id = id_manage_gramage;
    this.serv.setpoidstodefults(id_manage_gramage,product_id,poids,qtypoids,prixPromo,prixAchats,pricepoids)
      .subscribe(data=>{
      if(data.data = 'F') {
        setTimeout(()=>{
          this.idloading = false;
          this.serv.managepoids(this.prodId).subscribe(data => {
            this.poids = data.data;
          })
        },2000);
      }
    });
  }
  emitDates() {
    return this.emitData.asObservable();
  }
  epuise(id,product_id,poids) {
   this.isepuise = true;
   console.log(id,'kkkkk');
   this.id2 = id;
   this.serv2.epuisefrommanagepoids(product_id, poids).subscribe(data => {
     if(data.data == 'epuise') {
       this.serv.managepoids(this.prodId).subscribe(data => {
         this.poids = data.data;
         this.emitData.next([...this.poids]);
         this.poidsfilter= this.poids;
         this.isepuise = false;
       })
     }
   })
  }
  ngOnDestroy() {
    if (this.subs1 && this.subs2) {
      this.subs1.unsubscribe();
      this.subs2.unsubscribe();
    }
  }
}
