import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],

})
export class NavbarComponent implements OnInit {
fullname: string;
Superadmin;
  constructor(private Route: Router) {

  }


  ngOnInit() {
    this.fullname = localStorage.getItem('full_name');
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      console.log(data[0].Full_name);
      if (data[0].Role == 'super admin' || data[0].Role == 'admin' || data[0].Role == 'service clients' || data[0].Role == 'Agent de Commandes') {
       this.Superadmin =  data[0].Full_name;
      } else {
        this.Route.navigate(['/Authentifications']);
      }
    }else {
      this.Route.navigate(['/Authentifications']);
    }
  }
  logout() {
    localStorage.removeItem('full_name');
    this.Route.navigate(['/admin_auth']);
  }
}
