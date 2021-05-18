import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import {Router} from '@angular/router';
import {AreaServiceService} from '../../area-service.service';

@Component({
  selector: 'app-other-user-auth',
  templateUrl: './other-user-auth.component.html',
  styleUrls: ['./other-user-auth.component.css']
})
export class OtherUserAuthComponent implements OnInit {
  message = '';
  showmsg =  false;
  isloading = false;
  isloading2 = false;
  constructor(private route: Router, private serv: AreaServiceService, private snack: MatSnackBar) { }

  ngOnInit(): void {
  }

  saverapide(rapidecom) {
    this.isloading = true;
    console.log(rapidecom.value);
    if(rapidecom.invalid) {
      this.showmsg =  true;
      // this.message = 'votre informations et incorect';
      this.snack.open('votre informations et incorect', 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 2000 });

      setTimeout(()=> {
        this.isloading = false;
        this.showmsg = false;
      },3000);
    }else {
      this.serv.otherusersauth(rapidecom.value.name,rapidecom.value.pass).subscribe(data => {
       const datass = data.datajson;
       if(datass) {
        sessionStorage.setItem('Admin',JSON.stringify(datass));
         if (data.data == 'Other_success' && data.datajson[0].Role == 'admin' || data.datajson[0].Role == 'service clients' ) {
           this.showmsg = true;
          //  this.message = 'connectée';
           this.snack.open('Connectée', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });
           setTimeout(() => {
             this.showmsg = false;
             this.isloading = false;
             this.isloading2 = true;
           }, 2000);

           setTimeout(() => {
             this.route.navigate(['/dashboard/all_orders']);
           }, 5000);
         }else if (data.data == 'Other_success' && data.datajson[0].Role != 'admin' || data.datajson[0].Role != 'service clients') {
           this.showmsg = true;
          //  this.message = 'connectée';
           this.snack.open('Connectée', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });

           setTimeout(() => {
             this.showmsg = false;
             this.isloading = false;
             this.isloading2 = true;
           }, 2000);

           setTimeout(() => {
             this.route.navigate(['/Agents_cmd']);
             // alert(data.datajson[0].Full_name + ' ' + data.datajson[0].Role);
           }, 5000);
         } else if (data.data == 'Other_field') {
           this.showmsg = true;
          //  this.message = 'field ';
           this.snack.open('impossible de connectée, veuillez vous assurer que vos informations sont vraies', 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 2000 });
           setTimeout(() => {
             this.showmsg = false;
             this.isloading = false;
           }, 3000);
         }
       }else{
         this.showmsg = true;
        //  this.message = 'field ';
        this.snack.open('impossible de connectée, veuillez vous assurer que vos informations sont vraies', 'x', { panelClass: 'error', verticalPosition: 'bottom', duration: 2000 });
         setTimeout(() => {
           this.showmsg = false;
           this.isloading = false;
         }, 3000);
       }
      });

    }
  }
  closed() {
    this.showmsg = false;
  }
}
