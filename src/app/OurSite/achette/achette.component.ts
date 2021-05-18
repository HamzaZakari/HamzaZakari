import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ServicesService} from '../../AdminArea/services/services.service';
import {Clients} from '../../AdminArea/Models/clients';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
@Component({
  selector: 'app-achette',
  templateUrl: './achette.component.html',
  styleUrls: ['./achette.component.css']
})
export class AchetteComponent implements OnInit, AfterViewInit {
cmdcode;
genre = 'Paiement Cash à la livraison';
Data_panier: any[] = [];
total;
prix_liv;
  constructor(private serv: ServicesService, private route: Router) { }

  ngOnInit() {
    this.Data_panier = JSON.parse(localStorage.getItem('panier')) ? JSON.parse(localStorage.getItem('panier')) : null;
    if (!this.Data_panier) {
      this.route.navigate(['/']);
    } else {
      this.cmdcode = JSON.parse(localStorage.getItem('cmdcode'));
      setTimeout(()=>{localStorage.removeItem('cmdcode')},1000*60*20);
      this.Data_panier = JSON.parse(localStorage.getItem('panier'));
      this.total = +localStorage.getItem('total');
      this.prix_liv = +localStorage.getItem('prixS');
    }

  }
ngAfterViewInit(): void {
  localStorage.removeItem('panier');
  localStorage.removeItem('total');
  localStorage.removeItem('client');
  localStorage.removeItem('rapide');
}

}
