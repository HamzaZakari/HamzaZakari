import {Component, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {Products} from '../Models/products';
import {ServicesService} from '../services/services.service';
import {Subscription} from 'rxjs';
import {Gramage} from '../Models/gramage/gramage';
import {Litrage} from '../Models/litrage';
import {NgForm} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-managegramage-and-litrage',
  templateUrl: './managegramage-and-litrage.component.html',
  styleUrls: ['./managegramage-and-litrage.component.css']
})
export class ManagegramageAndLitrageComponent implements OnInit , OnDestroy {
  choixgramage = false;
  choixlitrage = false;
  choixmessage = 'please select wath you want';
  message = '';
  produit: Products[] = [];
  produitF: Products[] = [];
  subs: Subscription;
  isloading = false;
  id: any;
  @Output() gettingThePoids = new EventEmitter<{id: any}>();
  constructor(private services: ServicesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subs = this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('prodId')) {
        this.id = params.get('prodId');
        console.log(this.id);
        }
    })
    // this.getProduct();
  }
  save(poidsForm: NgForm) {
    this.isloading = true;
    if (poidsForm.invalid) {
      return;
    }
    this.services.addPoids( this.id, poidsForm.value.gramage , poidsForm.value.pricev, poidsForm.value.pricea, poidsForm.value.pricep, poidsForm.value.qty);
    this.message = 'your poids added successfully';
    setTimeout(() => {
      this.isloading = false; poidsForm.reset();
      this.gettingThePoids.emit({ id: this.id });
      this.message = '';
    }, 2000);


  }
  // getProduct() {
  //   this.subs = this.services.emitDatapro().subscribe((data: Products[] ) => {
  //     this.produit = data;
  //     this.produitF = data;
  //   });
  //   this.services.getProduct();
  // }
  serchProduits(event) {
   const data = this.produitF.filter(key => key.title.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) || key.titlearab.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()));
   this.produit = data;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
