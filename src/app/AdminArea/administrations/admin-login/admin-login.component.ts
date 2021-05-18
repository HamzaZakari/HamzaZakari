import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthservisesService} from '../../authservises.service';
import {AreaServiceService} from '../area-service.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
isloading = false;
messageToast = '';
showtoast = false;
close = false;
role;
value;
Role:{role:string, value: number}[] = [];
  constructor(private route: Router, private serv: AreaServiceService) { }

  ngOnInit(): void {
    this.Role = [
      {role:'admin', value: 1},
      {role:'Agent de Commandes', value: 2},
      {role:'Agent de livraisons', value: 3},
      {role:'Livreurs', value: 4},
      {role:'service clients', value: 5}
    ]
  }
  click(role, value) {
    this.role = role;
    this.value = value;
}
  Adminsingup(rapidecom) {
    this.isloading = true;
    console.log(rapidecom.value);
    if(rapidecom.invalid) {
      this.showtoast = true;
      this.messageToast = 'vos informations invalides';
      setTimeout(() => {this.isloading = false; this.showtoast = false;},3000)
    }else if (rapidecom.value.pass != rapidecom.value.Vrpass) {
      this.showtoast = true;
      this.messageToast = 'le conferme mode pass et invalid';
      setTimeout(() => {this.isloading = false; this.showtoast = false;},3000);

    }else {
      this.serv.SingUp(rapidecom.value.name, rapidecom.value.pass, rapidecom.value.Vrpass, this.role).subscribe(data => {
        if(data.data == 'success') {
          this.showtoast = true;
          this.messageToast = 'votre compte a bien été inséré';
          setTimeout(() => {this.isloading = false; this.showtoast = false;},3000);
        }else if(data.data == 'deja') {
          this.showtoast = true;
          this.messageToast = 'ce compte est déjà utilisé';
          setTimeout(() => {this.isloading = false; this.showtoast = false;},3000);
        }
      });
    }
  }
  closed(){
    this.showtoast = false;
  }
}
