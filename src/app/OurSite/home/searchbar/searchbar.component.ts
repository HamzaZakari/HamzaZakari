import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Products} from '../../../AdminArea/Models/products';
import {ServicesService} from '../../../AdminArea/services/services.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit, OnDestroy, AfterViewInit {
  showiconssearch = true;
  showiconclosesearch = false;
  setclass = '';
  key;
  ulAddesClass = '';
  boxAddesClass = '';
  Products: Products[] = [];
  Productsf: Products[] = [];
  subs: Subscription;
  url;
  mydata;
  // theFocusBar = null;
  // @ViewChild('myinpt') myinpt: ElementRef;
  constructor(private serv: ServicesService, private route: Router) { }

  ngOnInit(): void {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    // this.getallproducts();
  }
  gotoproduits(id) {
    this.route.navigate(['/product_detail', id]);
    this.boxAddesClass = '';
    this.ulAddesClass = '';
}
  ngAfterViewInit(): void {
    this.getallproducts()
  }
  getallproducts() {
    this.serv.getProduct();
    this.subs = this.serv.emitDatapro().subscribe(data => {
      this.Products = data;
      this.Productsf = data;
      this.setclass = '';
      this.showiconclosesearch = false;
      this.key = '';
    })
  }
  closesearch() {
    this.showiconssearch = true;
    this.showiconclosesearch = false;
    this.setclass = '';
    this.boxAddesClass = '';
    this.ulAddesClass = '';
    // this.theFocusBar = null;
  }
  opensearch() {
    this.showiconssearch = false;
    this.showiconclosesearch = true;
    this.setclass = 'setopen';
    document.getElementById('myinpt').focus();
  }
  productsSearch(key) {
    const data = this.Productsf.filter(keys => keys.title.toLocaleLowerCase().match(key.trim().toLocaleLowerCase())
      || keys.titlearab.match(key) || keys.titleengalish.toLocaleLowerCase().match(key.trim().toLocaleLowerCase()));
    // this.Products = data;
    this.mydata = data.length;
      this.Products = data;
    if(key == '') {
      this.boxAddesClass = '';
      this.ulAddesClass = '';
    } else if (data.length !== 0) {
        this.boxAddesClass = 'box-added-class';
        this.ulAddesClass = 'ul-added-class';
    }else{
      this.boxAddesClass = '';
      this.ulAddesClass = '';
    }
  }
  // gotocheck() {
  //   this.route.navigate(['/checkout']);
  // }
ngOnDestroy(): void {
}
}
