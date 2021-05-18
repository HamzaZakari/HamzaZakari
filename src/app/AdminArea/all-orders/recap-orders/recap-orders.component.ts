import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServicesService} from '../../services/services.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recap-orders',
  templateUrl: './recap-orders.component.html',
  styleUrls: ['./recap-orders.component.css']
})
export class RecapOrdersComponent implements OnInit, OnDestroy {
Recap: any[] = [];
RecapF: any[] = [];
subs: Subscription;
archive: any[] = [];
status = [{status:'Commandée', val: 0, statusbtn: 'Commandée'},
  {status:'en cours de traitement',val: 1, statusbtn: 'en cours de traitement'},
  {status:'Réserve',val: 10, statusbtn: 'Réserve'},
  {status:'Traitée',val: 8, statusbtn: 'Traitée'},
  {status:'préparation de livraison',val: 9, statusbtn: 'préparation de livraison'},
  {status:'Validée',val: 2, statusbtn: 'Validée'},
  {status:'en cours de livraison',val: 3, statusbtn: 'en cours de livraison'},
  {status:'Livrée',val: 3, statusbtn: 'Livrée'},
  {status:'Non Livrée',val: 10, statusbtn: 'Non Livrée'},
  {status:'payée',val: 11, statusbtn: 'payée'},
  {status:'Clôturée',val: 12, statusbtn: 'Clôturée'},
  ];
timer = [
  {time: 'last 24 hours', value: 1},
  {time: 'last 7 days', value: 7},
  {time: 'last 10 days', value: 10},
  {time: 'last 15 days', value: 15},
  {time: 'last 20 days', value: 20},
  {time: 'last 25 days', value: 25},
  {time: 'last 30 days', value: 30},
  {time: 'last 31 days', value: 31},
  {time: 'last 100 days', value: 100},
  {time: 'last 200 days', value: 200},
  {time: 'last 300 days', value: 300},
]
  current_select_status = null;
  current_selected_timer = null;
  constructor(private serv: ServicesService) { }

  ngOnInit(): void {
    this.current_select_status = 'Commandée';
    this.current_selected_timer = 7;
    this.getRecap(this.current_select_status, this.current_selected_timer);
  }
  getRecap(st, time) {
    this.subs = this.serv.getting_recap_orders(st, time).subscribe(data => {
      this.Recap = data.data;
      this.RecapF = data.data;
    },error => console.log(error));
  }
  getCMD(status) {
  this.current_select_status = status;
  }
  timers(timer, val) {
 this.current_selected_timer = val;
  }
  calcultedata() {
    this.getRecap(this.current_select_status, this.current_selected_timer);
  }
  show(product_id) {
    const data = this.RecapF.forEach(key => key.product_id === product_id);
    // this.archive = data;
    console.log(data);
  }
  search(event) {
    const data = this.RecapF.filter(key => key.title.toLocaleLowerCase().match((event.target.value).trim().toLocaleLowerCase()) || key.title_arab.toLocaleLowerCase().match((event.target.value).trim().toLocaleLowerCase()));
    this.Recap = data;
  }
ngOnDestroy(): void {
    if(this.subs) {
      this.subs.unsubscribe();
    }
}
}
