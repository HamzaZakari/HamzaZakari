import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {CategoryServService} from '../services/cat_services/category-serv.service';
import {ServicesService} from '../services/services.service';
import {Subscription} from 'rxjs';
import {Category} from '../Models/category';
import {Key} from '@ng-bootstrap/ng-bootstrap/util/key';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-all-category',
  templateUrl: './all-category.component.html',
  styleUrls: ['./all-category.component.css']
})
export class AllCategoryComponent implements OnInit, OnDestroy {
url;
  subs: Subscription;
  Category: Category[] = [];
  serachCat: Category[] = [];
  times: any;
  isloding = false;
  role;
  constructor(private servicescat: ServicesService , private  catserv: CategoryServService, private route: Router,
              @Inject(DOCUMENT) private document: Document) { }
  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.getcat();
    this.times = new Date();
  }
   getcat() {

     this.isloding = true;
     this.servicescat.getCategories();
     this.subs = this.servicescat.emitcategory().subscribe(data => {
       this.Category = data;
       this.serachCat = this.Category;
       this.isloding = false;
     });
     const data = JSON.parse(sessionStorage.getItem('Admin'));
     if(data) {
       this.role = data[0].Role;
       if (data[0].Role == 'super admin' || data[0].Role == 'admin' || data[0].Role =='service clients' || data[0].Role == 'Agent de Commandes') {
         return;
       } else {
         this.route.navigate(['/Authentifications']);
       }
     }else {
       this.route.navigate(['/Authentifications']);
     }
   }

  delete(cat: string) {
    this.servicescat.deletecat(cat);
  }
  // search cat
  search(event) {
    console.log(event);
    console.log(event.target.value);
    if (event.target.value !== '') {
      const searchdata = this.serachCat.filter(key => key.titlefr.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase())
        || key.titleAng.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) ||
        key.titlearab.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()));
      this.isloding = true;
      this.Category = searchdata;
      // this.servicescat.emitCat.next([...this.Category]);
      this.isloding = false;
    } else if (event.target.value === '') {
      this.ngOnInit();
    }
  }
  gotoADDcat() {
    this.route.navigate(['/dashboard/add_category']);
  }
  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
