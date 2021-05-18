import {Component, OnDestroy, OnInit} from '@angular/core';
import {Products} from '../Models/products';
import {ServicesService} from '../services/services.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sit-over-view-left',
  templateUrl: './sit-over-view-left.component.html',
  styleUrls: ['./sit-over-view-left.component.css']
})
export class SitOverViewLeftComponent implements OnInit, OnDestroy {
// produit: Products[] = [];
totalpro;
totalcat;
totalclinet;
totalOrders;
subs: Subscription;
subs1: Subscription;
subs3: Subscription;
subs4: Subscription;
fullname;
role;
Superadmin;
  constructor(private serv: ServicesService, private Route: Router) { }

  ngOnInit() {
    this.serv.getProduct();
    this.subs = this.serv.emitDatapro().subscribe( data => {
      this.totalpro = data.length;
       // = this.produit.length;
    });
    this.serv.getCategories();
    this.subs1 = this.serv.emitcategory().subscribe( catdata => {
      this.totalcat = catdata.length;
    });
    this.serv.getallclient();
    this.subs3 = this.serv.emitclientdata().subscribe(cln => {
      this.totalclinet  = cln.length;
    });
    this.serv.getAllOrders();
    this.subs4 = this.serv.emitdataOrdres().subscribe( dataOrders => {
      this.totalOrders = dataOrders.length;
    });
    this.fullname = localStorage.getItem('full_name');
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      this.role = data[0].Role;
      console.log(data[0].Full_name);
      if (data[0].Role == 'super admin' || data[0].Role == 'admin' || data[0].Role == 'service clients' || data[0].Role == 'Agent de Commandes') {
        this.Superadmin =  data[0].Full_name;
      } else {
        this.Route.navigate(['/Authentifications']);
      }
    }else {
      this.Route.navigate(['/Authentifications']);
    }
  }
  openNewOngle() {
    document.location.hostname === 'localhost' ? window.open('http://localhost:4200/Auth-forms') : window.open('https://herboshop.ma/Auth-forms');
    // [routerLink]="'/Auth-forms'"
  }
ngOnDestroy(): void {
    this.subs.unsubscribe();
  this.subs1.unsubscribe();
  this.subs3.unsubscribe();
  this.subs4.unsubscribe();
}
}
