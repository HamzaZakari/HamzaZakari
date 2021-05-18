import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {Products} from '../../../AdminArea/Models/products';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PackserviceService {
Packs: any[] = [];
emitbacks = new Subject<any[]>();
  private ProPaginate: Products[] = [];
  propaginat = new Subject<Products[]>();
  Category: any[] = [];
  emitCat = new Subject<any[]>();

  // private host = 'http://138.68.79.202:3000/';
  private host = '';
  // private host =  'http://localhost:3000/';
  constructor(private Http: HttpClient, @Inject(DOCUMENT) private document: Document, private route: Router) {
    if (document.location.hostname == 'localhost') {
      this.host = 'http://localhost:3000/';
    } else {
      this.host = 'https://www.herboshop.ma/herbo/';
    }
  }

  getPacks(){
    this.Http.get<{err: any, data: any}>(this.host + 'api/packs').subscribe(data => {
      this.Packs = data.data;
      this.emitbacks.next([...this.Packs]);
    })

  }
  oserverpacks() {
    return this.emitbacks.asObservable();
  }
  para_func() {
    return this.Http.get<{err: any, data: any}>(this.host + 'api/parapharmacie');
  }
  getting_top_selling_pro() {
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/top_selling_product');
  }
  gettopsale(id) {
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/get_top_sale/'+id);
  }
  getcat_meil() {
    //api/cat_meil
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/cat_meil');
  }
  //api/cat_beldi
  getcat_beldi() {
    //api/cat_meil
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/cat_beldi1');
  }
  //api/cat_esipces
  getcat_epices() {
    //api/cat_meil
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/cat_esipces');
  }
  getcat_frui_secs() {
    //api/cat_meil
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/cat_fruit-secs');
  }
  getcat_oliver_cornichon() {
    //api/cat_meil
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/cat_oliver_cornichon');
  }
  getcat_graines() {
    //api/cat_meil
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/cat_graines');
  }
  get_subcategory_in_boutique(id) {
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/getting_all_category_in_the_boutique/' + id);
  }
  //api/getting_pro_par_boutqiue/:id
  paginationsallpro(ProPerPage: number, page: number, id: number) {
    const query = `?limit=${ProPerPage}&page=${page}&id=${id}`;
    this.Http.get<{err: any , data: any[] }>(this.host + 'api/getting_pro_par_boutqiue' + query)
      .pipe(map((produitdata) => {
        return {
          MyProduits: produitdata.data.map(produit => {
            return {
              id: produit.product_id,
              catid: produit.category_id,
              title: produit.title,
              titlearab: produit.title_arab,
              titleengalish: produit.title_eng,
              descreption: produit.descreption,
              Libele: produit.Libele,
              image: produit.image,
              price: produit.price,
              poids: produit.poids,
              pricea: produit.priceAchette,
              pricep: produit.pricePromo,
              quantity: produit.quantity,
              created_at: produit.created_at,
              state: produit.state
            };
          }),
        };
      })).subscribe(data => {
      this.ProPaginate = data.MyProduits;
      this.propaginat.next([...this.ProPaginate]);
    });

  }
  emitpaginat() {
    return this.propaginat.asObservable();
  }
  // gett all pro by boutique
  gettingpro(id) {
    return this.Http.get<{err: any , data: any[]}>(this.host + 'api/getting_all_products_par_boutique/'+id);
  }
  getAllCat() {
    this.Http.get<{err: any, data: any[]}>(this.host + 'api/getting_all_category_').subscribe(data => {
      this.Category = data.data;
      this.emitCat.next([...this.Category]);
    });
  }
  observerCat(){
    return this.emitCat.asObservable();
  }
  get_quick_detail(id) {
  return this.Http.get<{err: any, data: any}>(this.host + 'api/get_quick_detail/' + id);
  }
}
