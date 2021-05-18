import {Component, Inject, OnInit} from '@angular/core';
import {ServicesService} from '../../AdminArea/services/services.service';
import {Subscription} from 'rxjs';
import {FormGroup, Validators} from '@angular/forms';
import {AuthservisesService} from '../../AdminArea/authservises.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-voir-mes-commandes',
  templateUrl: './voir-mes-commandes.component.html',
  styleUrls: ['./voir-mes-commandes.component.css']
})
export class VoirMesCommandesComponent implements OnInit {
orders: any[] = [];
ordersF: any[] = [];
mynewOrders: any[] = [];
mynewdetail_oredrs: any[] = [];
codecmd;
telephone;
no_orders = false;
isloading = false;
subs: Subscription;
myid ;
url;
  constructor(private serv: ServicesService, private serve: AuthservisesService, @Inject(DOCUMENT) private document: Document) { }
  ngOnInit(): void {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
  }
  find(id){
    this.serv.getdetailord(id).subscribe(data => {
      this.mynewdetail_oredrs = data.results;
      this.myid = data.results[0].id_Orders;
      this.isloading = false;
      this.no_orders = false;
    });
  }
  // pdfmaker(){
  //   return xepOnline.Formatter.Format('content', {render: 'download', filename: 'Récap'});
  // }
  suivi(codecmd) {
    this.isloading = true;
    this.serve.suivCMD(codecmd).subscribe(data => {
      this.mynewOrders = data.data;
      setTimeout(()=>{ this.isloading = false},500);
      if(this.mynewOrders.length == 0) {
        this.no_orders = true;
        setTimeout(()=>{this.no_orders = false},5000);
      }

    })
      // setTimeout(()=>{ this.isloading = false},500);
      // this.no_orders = true;
      // setTimeout(()=>{this.no_orders = false},5000);
  }
}
