import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {ServicesService} from '../../../../AdminArea/services/services.service';

@Component({
  selector: 'app-res-pharmacie',
  templateUrl: './res-pharmacie.component.html',
  styleUrls: ['./res-pharmacie.component.css']
})
export class ResPharmacieComponent implements OnInit {
  subs: Subscription;
  pupdata:any[] = [];
  pupupcart: any[] = [];
  coloseemodule = false;
  added = false;
  constructor(private serv2: ServicesService) { }

  ngOnInit(): void {
  }
  addtocart(product_id,poids?){
    //...
    this.serv2.addtoocart(product_id, poids);
    this.added = true;
    this.serv2.gettotaleitem();
    this.serv2.getitemincart();
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
}
