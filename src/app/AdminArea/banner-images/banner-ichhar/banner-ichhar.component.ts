import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthservisesService} from '../../authservises.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-banner-ichhar',
  templateUrl: './banner-ichhar.component.html',
  styleUrls: ['./banner-ichhar.component.css']
})
export class BannerIchharComponent implements OnInit {
  // postForm: NgForm;

  constructor(private serv: AuthservisesService, private route: Router) { }

  ngOnInit() {
  }
save(postForm){
    this.serv.addbannerichhar(postForm.value.banerfr, postForm.value.banerar, postForm.value.banereng).subscribe(data =>{
      this.route.navigate(['/dashboard/tout-titres-banner']);
    })
}
}
