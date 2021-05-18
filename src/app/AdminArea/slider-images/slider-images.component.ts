import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthservisesService} from '../authservises.service';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-slider-images',
  templateUrl: './slider-images.component.html',
  styleUrls: ['./slider-images.component.css']
})
export class SliderImagesComponent implements OnInit {
  subs: Subscription;
  fullname;
  role;
  Superadmin;
  images: {id_slider: number,images: any, date: any}[] = [];
  deletimage: {id_slider: number,images: any, date: any}[] = [];
  url;
  constructor(private serv: AuthservisesService, private Route: Router,
              @Inject(DOCUMENT) private document: Document) { }
  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.subs = this.serv.getAllsliderimages().subscribe(data => {
      console.log(data.data);
      this.images = data.data;
      this.deletimage = this.images;
    })
    this.fullname = localStorage.getItem('full_name');
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      this.role = data[0].Role;
      console.log(data[0].Full_name);
      if (data[0].Role == 'super admin' || data[0].Role == 'admin' || data[0].Role == 'service clients') {
        this.Superadmin =  data[0].Full_name;
      } else {
        this.Route.navigate(['/Authentifications']);
      }
    }else {
      this.Route.navigate(['/Authentifications']);
    }
  }
  trash(id) {
    this.serv.deletesliderimages(id).subscribe(data => {
      console.log(data.data);
    })
    const deletedata = this.deletimage.filter(key => key.id_slider != id);
    this.images = deletedata;
    this.deletimage = this.images;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
