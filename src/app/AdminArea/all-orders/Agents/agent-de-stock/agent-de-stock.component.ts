import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServicesService} from '../../../services/services.service';
import {Products} from '../../../Models/products';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-agent-de-stock',
  templateUrl: './agent-de-stock.component.html',
  styleUrls: ['./agent-de-stock.component.css']
})
export class AgentDeStockComponent implements OnInit, OnDestroy {
Produits: Products[] = [];
Productf: Products[] = [];
subs: Subscription;
  constructor(private serv: ServicesService) { }

  ngOnInit(): void {
    this.serv.getProduct();
    this.subs = this.serv.emitDatapro().subscribe(data => {
       this.Produits = data.filter(key => +key.quantity <= +key.ciel);
      this.Productf = this.Produits;
      console.log(this.Produits);
    })
  }
  ngOnDestroy(): void {
    if(this.subs) {
      this.subs.unsubscribe();
    }
  }

}
