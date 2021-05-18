import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthservisesService} from '../../authservises.service';

@Component({
  selector: 'app-updatepoids',
  templateUrl: './updatepoids.component.html',
  styleUrls: ['./updatepoids.component.css']
})
export class UpdatepoidsComponent implements OnInit {
poidsId;
poids: {id_manage_gramage: number, product_id: number, poids: string,pricepoids: any,prixAchats: any,prixPromo: any,qtypoids: any, created_at: any}[]= [];
poidss;
price;
prixa;
prixp;
qty;
id_gramage;
proid;
firstpoids;
isloading = false;
constructor(private route: ActivatedRoute, private serv: AuthservisesService,private routes: Router) { }

  ngOnInit() {
  this.isloading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('poidId')) {
        this.poidsId = paramMap.get('poidId');
        this.serv.getupdategepoids(this.poidsId).subscribe(data => {
          this.poids = data.data;
          this.isloading = false;
          this.poids.map(key=>{
            this.id_gramage = key.id_manage_gramage;
            this.proid = key.product_id;
            this.firstpoids = key.poids;
            this.poidss = key.poids;
            this.price =key.pricepoids;
            this.prixa = key.prixAchats;
            this.prixp = key.prixPromo;
            this.qty = key.qtypoids;
          });
         console.log(this.poidss,this.price,this.prixa, this.prixp,this.qty);
        })
      }
    });
  }
  save(form){
  this.isloading = true;
  this.serv.uppoids(this.id_gramage,this.proid,this.firstpoids,form.value.poids,form.value.prixv,form.value.prixa,form.value.prixp,form.value.qty).subscribe(data=>{
    console.log(data);
    setTimeout(()=>{this.isloading = false;
    this.routes.navigate(['/dashboard/managepoids/',this.proid])},2000)
  })
  }
}
