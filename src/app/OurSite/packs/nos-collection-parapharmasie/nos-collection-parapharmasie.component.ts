import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {PackserviceService} from '../pack/packservice.service';
import {Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-nos-collection-parapharmasie',
  templateUrl: './nos-collection-parapharmasie.component.html',
  styleUrls: ['./nos-collection-parapharmasie.component.css']
})
export class NosCollectionParapharmasieComponent implements OnInit, OnDestroy {
subs: Subscription;
paraK: any[] = [];
title;
id;
image;
url;
  constructor(private serv: PackserviceService,  @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.serv.para_func().subscribe(data => {
     this.paraK = data.data;
    })
  }
ngOnDestroy(): void {
}
}
