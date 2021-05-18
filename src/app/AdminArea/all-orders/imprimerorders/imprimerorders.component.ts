import {Component, OnDestroy, OnInit} from '@angular/core';
import {LivServiceService} from '../../genirate-livraiosn/liv-service.service';
import {ServicesService} from '../../services/services.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-imprimerorders',
  templateUrl: './imprimerorders.component.html',
  styleUrls: ['./imprimerorders.component.css']
})
export class ImprimerordersComponent implements OnInit,OnDestroy {
orders: any[] = [];
dataAfiche;
subs: Subscription;
id;
subdata: any[]=[];
  constructor(private ser: LivServiceService, private serv: ServicesService) { }

  ngOnInit(): void {
    this.serv.getAllOrders();
    this.subs = this.serv.emitdataOrdres().subscribe(data => {
      this.orders = data;
      const datas =  this.orders.filter(key => key.status == 'Commandée');
      this.dataAfiche = datas;
      console.log(this.dataAfiche);
        this.ser.getAllsuborderscommande().subscribe(data=>{
          this.subdata = data.data;
          console.log(this.subdata);
        })
    });
  }
  // public PDF(): void {
  //   return xepOnline.Formatter.Format('content', {render: 'download', filename: 'toules Commandes'});
  // }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
