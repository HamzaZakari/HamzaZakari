import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AuthservisesService} from '../authservises.service';
import {Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-banner-images',
  templateUrl: './banner-images.component.html',
  styleUrls: ['./banner-images.component.css']
})
export class BannerImagesComponent implements OnInit,OnDestroy {
subs: Subscription;
images: {id_banner: number,images: any, date: any}[] = [];
deletimage: {id_banner: number,images: any, date: any}[] = [];
url;
  constructor(private serv: AuthservisesService,  @Inject(DOCUMENT) private document: Document) { }
  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.subs = this.serv.getAllbannerimages().subscribe(data => {
      console.log(data.data);
      this.images = data.data;
      this.deletimage = this.images;
    })
  }
  trash(id) {
    this.serv.deletebannerimages(id).subscribe(data => {
      console.log(data.data);
    })
    const deletedata = this.deletimage.filter(key => key.id_banner != id);
    this.images = deletedata;
    this.deletimage = this.images;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
