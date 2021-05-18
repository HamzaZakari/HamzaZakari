import { Component, OnInit } from '@angular/core';
import {AuthservisesService} from '../../authservises.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-authpage',
  templateUrl: './authpage.component.html',
  styleUrls: ['./authpage.component.css']
})
export class AuthpageComponent implements OnInit {

  constructor(private serv: AuthservisesService, private route: Router, private Snak: MatSnackBar) { }

  ngOnInit() {
  }
  saverapide(rapidecom) {
    console.log(rapidecom.value);
    this.serv.yahya_Auth(rapidecom.value.name, rapidecom.value.pass).subscribe(data=> {
      if(data.data == 'D'){
        localStorage.setItem('authmode', 'Connected');
        this.route.navigate(['/data/gestions']);

      }else if (data.data = 'N'){

        this.Snak.open('votre nom ou mode de passe est Incorrecte', 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 2000 });
      }else {
        this.Snak.open('Il y a une Erreur', 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 2000 });

      }
    });;

  }
}
