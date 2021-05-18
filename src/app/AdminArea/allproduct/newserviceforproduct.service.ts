import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NewserviceforproductService {
  // private host = 'http://138.68.79.202:3000/';
  private host = '';
  // private host =  'http://localhost:3000/';
  constructor(private Http: HttpClient, @Inject(DOCUMENT) private document: Document) {
    if(document.location.hostname == 'localhost') {
      this.host =  'http://localhost:3000/';
    }else {
      this.host = 'https://www.herboshop.ma/herbo/';
    }
  }

  epuiseepro(id, poids) {
    const data = {
      id: id,
      poids:poids
    };
    return this.Http.put<{err: any, data: any}>(this.host +'api/epuisee', data);
  }
  epuisefrommanagepoids(product_id, poids) {
    const data = {id: product_id, poids: poids};
    return this.Http.put<{err: any, data: any}>(this.host +'api/epuiseefrom-manage-poids', data);
  }
}
