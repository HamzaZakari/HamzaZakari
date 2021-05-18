import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {Router} from '@angular/router';
import {AuthservisesService} from '../authservises.service';
import {AreaServiceService} from './area-service.service';

@Component({
  selector: 'app-administrations',
  templateUrl: './administrations.component.html',
  styleUrls: ['./administrations.component.css']
})
export class AdministrationsComponent implements OnInit {
message = '';
showmsg =  false;
isloading = false;
isloading2 = false;
superData: any[] = [];
  constructor(private route: Router, private serv: AreaServiceService, private snack: MatSnackBar) { }

  ngOnInit(): void {
  }
  saverapide(rapidecom) {
    this.isloading = true;
    console.log(rapidecom.value);
     if(rapidecom.invalid) {
       this.showmsg =  true;
      //  this.message = 'votre informations et incorect';
       this.snack.open('votre informations et incorect', 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 2000 });
       setTimeout(()=> {
         this.isloading = false;
         this.showmsg = false;
       },3000);
     }else {
       this.serv.superAdminAuth(rapidecom.value.name,rapidecom.value.pass).subscribe(data => {
         console.log(data.datasuper);
         if(data.data == 'AuthS') {
           this.superData = data.datasuper;
           sessionStorage.setItem('Admin',JSON.stringify(this.superData));
           console.log(this.superData, data.datasuper);
           this.showmsg = true;
          //  this.message = 'Connectee';
           this.snack.open('Connectée', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });

           setTimeout(() => {
             this.showmsg = false;
             this.isloading = false;
             this.isloading2 = true;
           },2000);
           setTimeout(() => {
             this.route.navigate(['/dashboard/all_products']);
           },5000);
         }else if (data.data == 'field'){
           this.showmsg = true;
          //  this.message = 'field';
           this.snack.open('impossible de connectée, veuillez vous assurer que vos informations sont vraies', 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 2000 });

           setTimeout(() => {
             this.showmsg = false;
             this.isloading = false;
           },3000);
         }
       });
     }


  }
  closed() {
    this.showmsg = false;
  }
}
