import {Component, OnDestroy, OnInit} from '@angular/core';
import {Orders} from '../../Models/orders';
import {ServicesService} from '../../services/services.service';
import {ActivatedRoute} from '@angular/router';
import {ManagePoids} from '../../Models/manage-poids';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.css']
})
export class EditOrdersComponent implements OnInit , OnDestroy {
  ordid;
  DetaiOrd: Orders;
  dataOrd: Orders;
  poids: any[] = [] ;
  poidprice: number;
  poidschange: any;
  subs: Subscription;
  myclass = '';
  myclasscheck = false;
  constructor(private serv: ServicesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('idOrd')) {
        this.ordid = paramMap.get('idOrd');
        this.subs = this.serv.getdetailord(this.ordid).subscribe(datac => {
          console.log(datac,'harba');
          const orders = {
            id: datac[0].id_orders,
            id_client: datac[0].id_client,
            id_produits: datac[0].product_id,
            clientfulname: datac[0].Full_Name,
            email: datac[0].email,
            frname: datac[0].title,
            angname: datac[0].title_eng,
            arabaname: datac[0].title_arab,
            image: datac[0].image,
            adress: datac[0].adress,
            pays: datac[0].pays,
            ville: datac[0].ville,
            pricepro: datac[0].price,
            pricep: datac[0].pricePromo,
            pricea: datac[0].priceAchette,
            poidspro: datac[0].poids,
            qte_pro: datac[0].quantity,
            codepostal: datac[0].codepostale,
            teleclient: '0' + datac[0].telephone,
            qte: datac[0].qte_produits,
            poids: datac[0].poidsord,
            price: datac[0].priceord,
            affstatus: datac[0].textstatus,
            created_at: datac[0].created_atord
          }
          this.DetaiOrd = orders;
          console.log('haha kada makini', this.DetaiOrd);
          this.subs = this.serv.getpoideditOrders(this.DetaiOrd.id_produits).subscribe(data => {
            this.poids = data.data;
            console.log('haha ' , this.poids);
          });
          this.subs = this.serv.getdetailord(this.ordid).subscribe(datac => {
            const ordersdata = {
              id: datac[0].id_orders,
              id_client: datac[0].id_client,
              id_produits: datac[0].product_id,
              clientfulname: datac[0].Full_Name,
              email: datac[0].email,
              frname: datac[0].title,
              angname: datac[0].title_eng,
              arabaname: datac[0].title_arab,
              image: datac[0].image,
              adress: datac[0].adress,
              pays: datac[0].pays,
              ville: datac[0].ville,
              pricepro: datac[0].price,
              poidspro: datac[0].poids,
              qte_pro: datac[0].quantity,
              codepostal: datac[0].codepostale,
              teleclient: '0' + datac[0].telephone,
              qte: datac[0].qte_produits,
              poids: datac[0].poidsord,
              price: datac[0].priceord,
              affstatus: datac[0].textstatus,
              created_at: datac[0].created_atord
            }
            this.dataOrd = ordersdata;
            console.log('haha kada makini', this.DetaiOrd);
          });
        });
      }
    });
  }
  sume(id, qte , price) {
    console.log(id, qte , price , qte * price , this.DetaiOrd.id_produits);
  }
  click(event, price) {
    this.poidschange = event.target.innerHTML;
    console.log(event.target.innerHTML, price);
    if (event) {
      this.poidprice = price;
      console.log(this.poidprice);
    } else {
      return;
    }
}
  // poids=> 50g poidchange=>  100g   price=> 297 poidprice=> 198 quantity=> 3
  // console.log('id=>', id , 'poids=>' , poids, 'poidchange=>' ,
  // poidschange , ' price=>' , price , 'poidprice=>', poidprice * qte, 'quantity=>', qte);
  saveChanges(id? , poids? , poidschange? , poidprice?  , price? , qte?) {
    this.myclasscheck = true;
    this.serv.updateOrdrers(id, poids, poidschange, poidprice * qte ,  price * qte , qte );
    setTimeout(() => {
      this.myclass = 'opacity';
      this.myclasscheck = false;
    }, 1000);

}
close() {
   this.myclass = 'opacity';
   setTimeout(() => {
     this.myclasscheck = false;
   }, 1000);
}
ngOnDestroy(): void {
    this.subs.unsubscribe();
}
}
