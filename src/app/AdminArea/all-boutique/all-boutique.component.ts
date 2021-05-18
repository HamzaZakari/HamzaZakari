import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ServicesService} from '../services/services.service';
import {CategoryServService} from '../services/cat_services/category-serv.service';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-all-boutique',
  templateUrl: './all-boutique.component.html',
  styleUrls: ['./all-boutique.component.css']
})
export class AllBoutiqueComponent implements OnInit {
  url;
  subs: Subscription;
  Boutique: any[] = [];
  serachBoutique: any[] = [];
  times: any;
  isloding = false;
  role;
  constructor(private servicescat: ServicesService , private  catserv: CategoryServService, private route: Router,
              @Inject(DOCUMENT) private document: Document) {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
  }
  ngOnInit() {
    // this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    // this.url = document.location.protocol +'//'+ '138.68.79.202' +':3000/images/';
    this.getcat();
    this.times = new Date();
  }
  getcat() {

    this.isloding = true;
    this.servicescat.getBoutique();
    this.subs = this.servicescat.emitbobotique().subscribe(data => {
      this.Boutique = data;
      this.serachBoutique = this.Boutique;
      console.log(this.Boutique);
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
      const searchdata = this.serachBoutique.filter(key => key.nomFr.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase())
        || key.nomAng.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) ||
        key.nomAr.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()));
      this.isloding = true;
      this.Boutique = searchdata;
      // this.servicescat.emitCat.next([...this.Category]);
      this.isloding = false;
    } else if (event.target.value === '') {
      this.ngOnInit();
    }
  }
  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

}
