import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from '../../Models/category';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CategoryServService {
 emitcat = new Subject<Category[]>();
 // private host = 'http://138.68.79.202:3000/';
  private host = '';
 // private host =  'http://localhost:3000/';
 Category: Category[] = [];
  constructor(private Http: HttpClient, @Inject(DOCUMENT) private document: Document, private snack: MatSnackBar, private route: Router) {
    if (document.location.hostname == 'localhost') {
      this.host = 'http://localhost:3000/';
    } else {
      this.host = 'https://www.herboshop.ma/herbo/';
    }
  }
  addcategory(id_boutique,titleFr: string , titleAng: string, titleArab: string , image: File) {
    const produitsData = new FormData();
    produitsData.append('id_boutique', id_boutique);
    produitsData.append('titleFr', titleFr);
    produitsData.append('titleAng', titleAng);
    produitsData.append('titleArab', titleArab);
    produitsData.append('image', image);

    this.Http.post<{ message: string, data: Category[] }>(this.host + 'api/add_category', produitsData).subscribe(data => {
      if (data) {
        this.snack.open('La catégorie est ajoutée', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });
        this.route.navigate(['/dashboard/all_categorys']);
      }
    });
  }

  // add boutique
  addBotique(titleFr: string , titleAng: string, titleArab: string , foni: string, image: File) {
    const produitsData = new FormData();
    produitsData.append('nomFr', titleFr);
    produitsData.append('nomAng', titleAng);
    produitsData.append('nomAr', titleArab);
    produitsData.append('id_forni', foni);
    produitsData.append('imageboutique', image);
    this.Http.post<{message: string, data: Category[]}>(this.host + 'api/add_boutique' , produitsData).subscribe(data => {
    });
  }
  //
  updatedcat(id_boutique: string,id: string, titlefr: string , titleAng: string , titlearab: string, image: any | File) {
    const category = new FormData();
    category.append('id_boutique', id_boutique);
    category.append('id', id);
    category.append('titleFr', titlefr);
    category.append('titleAng', titleAng);
    category.append('titleArab', titlearab);
    category.append('image', image);
    this.Http.put(this.host + 'api/update_cat/' + id, category).subscribe(data => {
      this.snack.open('la catégorie est mise à jour ', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });
      this.route.navigate(['/dashboard/all_categorys']);
    // kalam
    });
  }
// test qty in the panier
  getrealqty(id, qtyPanier) {
    const data = {id: id, qty: qtyPanier};
    return this.Http.post<{err: any, data: any[]}>(this.host + 'api/real_qty', data);
  }
}
