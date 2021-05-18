import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-popus-new',
  templateUrl: './popus-new.component.html',
  styleUrls: ['./popus-new.component.css'],
})
export class PopusNewComponent implements OnInit {
  fullname: string;
  Superadmin;
  role;
  constructor(private Route: Router) {

  }


  ngOnInit() {
    this.fullname = localStorage.getItem('full_name');
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      this.role = data[0].Role;
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

}
