import { Component, OnInit } from '@angular/core';
import {AuthservisesService} from '../../AdminArea/authservises.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  // imagesB = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  banners:{id_ichhar, titlearb: any, titlefr: any, titleeng: any}[] = [];
  constructor(private serv: AuthservisesService) { }

  ngOnInit() {
    this.serv.gettingalltitleofbanner().subscribe(data => {
      this.banners = data.data;
    })
  }

}
