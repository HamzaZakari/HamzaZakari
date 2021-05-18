import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ServicesService} from '../../../AdminArea/services/services.service';
import {Subscription} from 'rxjs';
import {MatSnackBar, PageEvent} from '@angular/material';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Cart} from '../../../AdminArea/Models/cart';
import {PackserviceService} from '../pack/packservice.service';

@Component({
  selector: 'app-selles',
  templateUrl: './selles.component.html',
  styleUrls: ['./selles.component.css']
})
export class SellesComponent implements OnInit, OnDestroy {
  produitperpage = 50;
  currentpage = 1;
  pageSize = [20, 30, 40, 60];
  showModules = false;
  detaul_data: any = [];
  pro_id_fo_detai_pro = null;
  poidspoids = null;
  poidsprice = null;
  prixp = null;
  qtypoids = null;
  ngclass = '';
  largeclass = '';
  Produits: any[] = [];
  coloseemodule = false;
  Produits2: any[] = [];
  dataFilter: any[] = [];
  totalproduit = 5;
  pupupcart: any[] = [];
  pupdata:any[] = [];
  epuisee = '';
  isloading = false;
  total = 0;
  checkbtn = false;
  msg = '';
  cart: Cart[] = [];
  subs: Subscription;
  url;
  subs1: Subscription;
  Category: any[] = [];
  id_boutique = null;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  cat_id = null;
  class1 = '';
  statenav = false;
  classnav = '';
  showpaginations = true;
  showall = false;
  poids: any[] =[];
  PoidsQuick: any[] = [];
  QuickDetail: any =[];
  QuickDetailSelles: any =[];
  proID;
  currentHref = '';
  type = '';
  // subs4: Subscription;
  constructor(private sevices: ServicesService , private serv: PackserviceService,
              @Inject(DOCUMENT) private document: Document, private routes: ActivatedRoute, private MatSnakbar: MatSnackBar) { }

  ngOnInit(): void {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.currentHref = document.location.href;
    this.isloading = true;

    this.routes.paramMap.subscribe((params: ParamMap) => {
      if(params.has('id_pro') && !params.has('cat_id')) {
        this.id_boutique = params.get('id_pro');
        this.subs4 = this.serv.get_subcategory_in_boutique(this.id_boutique).subscribe(data => {
          this.Category = data.data;
          this.subs3 = this.serv.gettingpro(this.id_boutique).subscribe(data => {
            this.Produits2 = data.data;
            console.log(this.Produits2);
            this.dataFilter = this.Produits2;
            this.totalproduit = this.Produits2.length;
          })
          this.paginate2();
        }, error => {
          console.log(error);
        })
      }else if(params.has('id_pro') && params.has('cat_id')){
        this.id_boutique = params.get('id_pro');
        this.cat_id =  params.get('cat_id');
        this.subs4 = this.serv.get_subcategory_in_boutique(this.id_boutique).subscribe(data => {
          this.Category = data.data;
          this.subs3 = this.serv.gettingpro(this.id_boutique).subscribe(data => {
            this.Produits = data.data.filter(key => key.cat_id == this.cat_id);
            // this.Produits = this.Produits2;
            this.isloading = false;
            this.showpaginations = false;
          })
          // this.paginate2();
        }, error => {
          console.log(error);
        })
      }else {
        this.cat_id = null;
        this.sevices.getProduct();
        this.subs1 = this.subs = this.sevices.emitDatapro().subscribe(data => {
          this.Produits2 = data;
          console.log(this.Produits2);
          this.dataFilter = this.Produits2;
          this.totalproduit = this.Produits2.length;
          this.sevices.getCategories();
          this.subs = this.sevices.emitcategory().subscribe(data => {
            this.Category = data;
            this.showall = true;
          });
        });
        this.datapaginate();
      }

    });
 if(this.cat_id == null) {
 this.class1 = 'toutclass';
 }
  }
  datapaginate(){
    this.sevices.paginationsallpro(this.produitperpage, this.currentpage);
    this.subs = this.sevices.emitpaginat().subscribe(data => {
      this.Produits = data;
      this.Produits.map(key => {
        if(key.quantity == 0) {
          this.epuisee = 'epuisee';
        }
      });
      this.isloading = false;
      this.total = this.Produits.length;
    });
  }
  paginate2() {
    this.serv.paginationsallpro(this.produitperpage, this.currentpage, this.id_boutique);
    this.subs2 = this.serv.emitpaginat().subscribe(data => {
      this.Produits = data;
      this.Produits.map(key => {
        if(key.quantity == 0) {
          this.epuisee = 'epuisee';
        }
      });
      this.isloading = false;
      this.total = this.Produits.length;
    });
  }
  getproPoids(id) {
    this.sevices.gettingpoids(id);
    this.subs4 = this.sevices.emitPoidspro().subscribe(data => {
      this.PoidsQuick = data;
    });
  }
  show_quicks(id) {
    this.proID = id;
    // this.show_quick = 'show_quick';
    this.serv.get_quick_detail(id).subscribe(data => {
      this.QuickDetail = data.data;
      this.QuickDetailSelles = data.data;
      this.getproPoids(id);
    });
  }
  addtocart2(product_id ,poids, poidspoids , poidsprice , prixp , qtypoids, title ) {
    if(poidsprice && poidspoids){
      const poids = poidsprice.trim();
      this.sevices.addtoocart(product_id, poids, poidspoids, prixp, qtypoids);
      this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});
      setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
        this.pupdata = data;
        const newdata =  this.pupdata.filter(key => key.product_id == product_id);
        this.pupupcart = newdata;
        if(this.pupupcart) {
          this.coloseemodule = true;
        }
      },1000);
    }else{
      this.sevices.addtoocart(product_id,poids);
      this.MatSnakbar.open('le produit' + ' ' + title + ' ' + 'ajouté au panier' + ' (' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});
      setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
        this.pupdata = data;
        const newdata =  this.pupdata.filter(key => key.product_id ==product_id);
        this.pupupcart = newdata;
        if(this.pupupcart) {
          this.coloseemodule = true;
        }
      },1000);
    }
    this.sevices.gettotaleitem();
    this.sevices.getitemincart();
  }
  quick_view(product_id) {
    this.pro_id_fo_detai_pro = product_id;
    this.showModules = true;
    this.sevices.getsinglepro(product_id).subscribe(data => {
      this.detaul_data = data;
      this.getproPois();
    })

  }
  getproPois() {
    this.sevices.gettingpoids(this.pro_id_fo_detai_pro);
    this.subs = this.sevices.emitPoidspro().subscribe(data => {
      this.poids = data;
    });
  }
  click(event ,pricepoids ,qtypoids,prixa,prixp ,id, poids){
    this.poidspoids = poids;
    this.poidsprice = pricepoids;
    this.prixp = prixp;
    this.qtypoids = qtypoids;
  }
  opennav(){
    this.statenav = !this.statenav;
    if(this.statenav ==  true) {
      this.classnav = 'opennav';
    }else {
      this.classnav = '';
    }
  }
  onChangePage(event: PageEvent) {
    this.currentpage = event.pageIndex + 1;
    this.produitperpage = event.pageSize;
    event.length = this.totalproduit;
    if(this.id_boutique == null) {
      this.sevices.paginationsallpro(this.produitperpage, this.currentpage);
    }else {
      this.serv.paginationsallpro(this.produitperpage, this.currentpage, this.id_boutique);
    }
  }
  clickcat(cat_id, id_boutique?) {
    this.isloading = true;
    if(this.id_boutique != null && this.cat_id == null) {
      this.showpaginations = false;
      this.cat_id = cat_id;
      this.class1 = '';
      const data = this.dataFilter.filter(key => key.cat_id == cat_id);
      this.Produits = data;
      this.isloading = false;
    }else if(this.cat_id != null && this.id_boutique != null) {
      this.cat_id = cat_id;
      this.showpaginations = false;
      this.subs3 = this.serv.gettingpro(this.id_boutique).subscribe(data => {
        this.Produits2 = data.data;
        this.dataFilter = this.Produits2;
        const datas = this.dataFilter.filter(key => key.cat_id == cat_id);
        this.Produits = datas;
        this.isloading = false;
        // this.totalproduit = this.Produits2.length;
      })
    }else if(this.id_boutique == null && (this.cat_id == null ||this.cat_id != null)) {
      this.cat_id = null;
      this.showpaginations = false;
      this.subs3 = this.serv.gettingpro(id_boutique).subscribe(data => {
        this.Produits2 = data.data;
        this.dataFilter = this.Produits2;
        const datas = this.dataFilter.filter(key => key.cat_id == cat_id);
        this.Produits = datas;
        this.isloading = false;
        // this.totalproduit = this.Produits2.length;
        this.cat_id = cat_id;
      })
    }
  }
  tousclick() {
    this.isloading = true;
    this.showpaginations = true;
    this.cat_id = null;
    if(this.id_boutique == null) {
      this.sevices.getProduct();
      this.subs1 = this.subs = this.sevices.emitDatapro().subscribe(data => {
        this.Produits2 = data;
        this.dataFilter = this.Produits2;
        this.totalproduit = this.Produits2.length;
        this.isloading = false;
      });
      this.datapaginate();
    }else {
      this.serv.get_subcategory_in_boutique(this.id_boutique).subscribe(data => {
        this.Category = data.data;
        this.subs3 = this.serv.gettingpro(this.id_boutique).subscribe(data => {
          this.Produits2 = data.data;
          this.dataFilter = this.Produits2;
          this.totalproduit = this.Produits2.length;
        })
        this.paginate2();
      }, error => {
        console.log(error);
      })
    }
  }
  addtocart(id: string,title,poids?) {
    this.sevices.addtoocart(id,poids);
    this.sevices.gettotaleitem();
    this.sevices.getitemincart();
    setTimeout(()=>{const data = JSON.parse(localStorage.getItem('panier'));
      this.pupdata = data;
      const newdata =  this.pupdata.filter(key => key.product_id ==id);
      this.pupupcart = newdata;
      this.MatSnakbar.open('le produit' +' '+ title + ' ' +'ajouté au panier' + '(' + poids + ' | ' + 'Quantité 1)', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});

      if(this.pupupcart.length > 0) {
        this.coloseemodule = true;
      }
      for(let i = 0 ; i < data.length ; i++) {
        if (data[i].product_id == id) {
          if (data[i].quantity == 0 || data[i].qtypoids == 0) {
            this.checkbtn = true;
            this.msg = 'sorry we don\'t have more quantities';
            this.MatSnakbar.open('le produit est epuisé', 'x', {panelClass: 'error', verticalPosition: 'bottom', duration: 2000});

            setTimeout(() => { this.checkbtn = false; }, 3000);
          }
        }
      }
    },1000);


  }
  search(keybord) {
    if(keybord == '') {
      this.sevices.paginationsallpro(this.produitperpage, this.currentpage);
      this.subs = this.sevices.emitpaginat().subscribe(data => {
        this.Produits = data;
        this.isloading = false;
        this.total = this.Produits.length;
      });
    }else {
      this.isloading = true;
      const datasearch = this.dataFilter.filter(key => key.title.toLocaleLowerCase().match(keybord.toLocaleLowerCase().trim())
        || key.title_arab.match(keybord) || key.title_eng.toLocaleLowerCase().match(keybord.toLocaleLowerCase().trim()));
      if (datasearch !== null) {
        this.Produits = datasearch;
        this.isloading = false;
      }
    }
  }
  ngOnDestroy(): void {
    if(this.subs1 && this.subs && this.subs2 && this.subs3 && this.subs4) {
      this.subs.unsubscribe();
      this.subs1.unsubscribe();
      this.subs2.unsubscribe();
      this.subs3.unsubscribe();
      this.subs4.unsubscribe();
    }
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;
    if(number >= 63) {
      this.ngclass = 'subnav';
    }else if(number >= 51 ) {
      this.largeclass = 'largeclass';
    }
    else {
      this.ngclass = '';
      this.largeclass = ''
    }
  }
}
