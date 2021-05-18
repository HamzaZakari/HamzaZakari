import { Component, OnInit } from '@angular/core';
import {formatNumber} from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
 gotowhatsap() {
   const number = '212 638704100';
    if(window.innerWidth > 900) {
      window.open('https://web.whatsapp.com/send?phone='+ number +'&text=');
    } else {
      window.open('https://api.whatsapp.com/send?phone='+ number +'&text=');
    }
 }
}
