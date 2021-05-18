import {Component, Input, OnInit} from '@angular/core';
import {ServicesService} from '../../AdminArea/services/services.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-quick-views',
  templateUrl: './quick-views.component.html',
  styleUrls: ['./quick-views.component.css']
})
export class QuickViewsComponent implements OnInit {
@Input('QuickDetail') QuickDetail: any;
prodID;
@Input('PoidsQuick')PoidsQuick: any[];
// @Input('QuickDetailSelles') QuickDetailSelles: any;
url;
nohome = '';
@Input('type') type;
rowclass = '';
seconrowclass = '';
  poidspoids;
  poidprice;
  qtypoids;
  pricea;
  pricep;
  poidschange;
  constructor(private service: ServicesService, private MatSnakbar: MatSnackBar) {
    console.log(this.type);
    window.innerWidth > 525 ? this.rowclass = 'col-6' : this.rowclass = 'div';
    window.innerWidth > 525 ? this.seconrowclass = 'col-6' : this.seconrowclass = 'second-div';
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
  }
  click(event, pricev, qty, pricea, pricep, id?, poids?) {
    this.poidschange = event.target.innerHTML;
    if (event) {
      this.poidspoids = poids;
      this.poidprice = pricev;
      this.qtypoids = qty;
      this.pricea = pricea;
      this.pricep = pricep;
    } else {
      return;
    }
  }
  addtocart(id: string,title,poids?: any, poidprice?: any, poidschange?: any, pricepromo?: any, qty?: any) {
    if(poidprice && poidschange){
      const poids = poidprice.trim();
      this.service.addtoocart(id, poids, poidschange, pricepromo, qty);
      this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});

      setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
        for(let i = 0 ; i < data.length ; i++) {
          if (data[i].product_id == id) {
            if (data[i].quantity == 0 || data[i].qtypoids == 0) {
              // this.checkbtn = true;
              this.MatSnakbar.open('le produit est epuisé', 'x', {panelClass: 'error', verticalPosition: 'bottom', duration: 2000});
            }
          }
        }
      },1000);
    }else{
      this.service.addtoocart(id,poids);
      this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});
    }
    this.service.gettotaleitem();
    this.service.getitemincart();
  }
  ngOnInit(): void {

  }
  hide_quick() {
    this.QuickDetail = [];
  }
  // addtocart(id3, id2, id1) {}
}
