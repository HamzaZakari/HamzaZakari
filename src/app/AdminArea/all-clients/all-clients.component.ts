import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServicesService} from '../services/services.service';
import {Clients} from '../Models/clients';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AreaServiceService} from '../administrations/area-service.service';

@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.css']
})
export class AllClientsComponent implements OnInit , OnDestroy {
Client: Clients[] = [];
Admins: any[] = [];
AdminsF: any[] = [];
subs: Subscription;
isloading = false;
showModules = false;
editing = false;
  showspenner = false;
  deleted = false;
  id;
  Role:{role:string, value: number}[] = [];
  fulle_name;
  pass;
  confiremepassword;
  role;
  idedite;
  constructor(private serv: ServicesService, private route: Router, private ser: AreaServiceService) { }

  ngOnInit() {
    this.Role = [
      {role:'admin', value: 1},
      {role:'super admin', value: 2},
      {role:'Agent de Commandes', value: 3},
      {role:'Agent de livraisons', value: 4},
      {role:'Livreurs', value: 5},
      {role:'service clients', value: 6},
    ]
    this.isloading = true;
    this.serv.getallclient();
    this.subs = this.serv.emitclientdata().subscribe(data => {
      this.Client = data;
      this.isloading = false;
    });
    this.ser.getting_all_agents().subscribe(data => {
      this.Admins = data.data;
      this.AdminsF = data.data;
      this.isloading = false;
    })
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      console.log(data[0].Full_name);
      if (data[0].Role == 'super admin') {
        return;
      } else {
        this.route.navigate(['/Authentifications']);
      }
    }else {
      this.route.navigate(['/Authentifications']);
    }

  }
  yeshesur(full_name?: string, pass?: string, cmdpaass?: string){

    this.showspenner = true;
    if(this.deleted == true){
    this.ser.delete_agents(this.id).subscribe(data => {
      if(data.data == 'deleted') {
          const data = this.AdminsF.filter(key => key.id_Admin != this.id);
          this.Admins = data;
          this.AdminsF = this.Admins;
          this.showspenner = false;
          this.showModules = false;
        }
    })
    }else if (this.editing == true) {
      console.log(full_name,pass, cmdpaass, this.role);
      // this.editerole();
      setTimeout(()=>{this.showModules = false;
      this.showspenner = false;},15000);
    }

  }
  nosur(){
    this.showModules = false;
  }
  delete(id_Admin) {
    this.editing = false;
    console.log(id_Admin);
    this.deleted = true;
    this.showModules = true;
    this.id = id_Admin;
}
  edite(id_Admin){
    this.idedite = id_Admin;
    this.deleted = false;
    this.editing = true;
    this.showModules = true;
}
  editerole(form) {
    this.showspenner = true;
    console.log(form.value);
    this.fulle_name = form.value.name;
    this.pass = form.value.pass;
    this.confiremepassword = form.value.cmfpass;
    this.role = form.value.roles;
    this.ser.editingagents(this.idedite, this.fulle_name, this.pass, this.role).subscribe(data => {
      if(data.data == 'updated') {
        this.ser.getting_all_agents().subscribe(data => {
          this.Admins = data.data;
          this.AdminsF = data.data;
          this.isloading = false;
        });
        this.showspenner = false;
        this.showModules = false;
      }
    })

  }
  click(role, value){
    alert(1);
    this.role = role;
    console.log(role, value, this.role);
}
ngOnDestroy(): void {
  if (this.subs) {
    this.subs.unsubscribe();
  }
}
}
