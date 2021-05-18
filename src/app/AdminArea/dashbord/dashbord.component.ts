import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {

  constructor(private service: ServicesService, private route: Router) { }

  ngOnInit() {

    this.getpro();
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      console.log(data[0].Full_name);
      if (data[0].Role == 'super admin' || data[0].Role == 'admin' || data[0].Role == 'service clients' || data[0].Role == 'Agent de Commandes') {
        return;
      } else {
        this.route.navigate(['/Authentifications']);
      }
    }else {
      this.route.navigate(['/Authentifications']);
    }
  }
  getpro() {
   this.service.getProduct();
  }

}
