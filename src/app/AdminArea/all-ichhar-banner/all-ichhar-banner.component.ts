import {Component, Inject, OnInit} from '@angular/core';
import {AuthservisesService} from '../authservises.service';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-all-ichhar-banner',
  templateUrl: './all-ichhar-banner.component.html',
  styleUrls: ['./all-ichhar-banner.component.css']
})
export class AllIchharBannerComponent implements OnInit {
  banners:{id_ichhar, titlearb: any, titlefr: any, titleeng: any}[] = [];
  bannersFilter:{id_ichhar, titlearb: any, titlefr: any, titleeng: any}[] = [];
  url;
  constructor(private serv: AuthservisesService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.serv.gettingalltitleofbanner().subscribe(data => {
      console.log(data.data);
      this.banners = data.data;
      this.bannersFilter = this.banners;
    })
  }
delete(id){
    this.serv.deletetitlebaner(id);
    const data = this.bannersFilter.filter(key => key.id_ichhar != id);
    this.banners = data;
    this.bannersFilter = this.banners;
}

}
