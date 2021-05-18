import { Component, OnInit } from '@angular/core';
import {AuthservisesService} from '../../authservises.service';
import DateTimeFormat = Intl.DateTimeFormat;
import {formatDate} from '@angular/common';
import {Router} from '@angular/router';
import {ServicesService} from '../../services/services.service';
import { MatSnackBar } from '@angular/material';
export interface Orders {
  total_Livraison: number;
  total_son_livraison: number;
  total_achats: number;
  marge: number;
  fraisL: number;
  prix_livraison: number;
  status: string;
  total_charge_livraison: number
}

@Component({
  selector: 'app-private-informations',
  templateUrl: './private-informations.component.html',
  styleUrls: ['./private-informations.component.css']
})
export class PrivateInformationsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  commande: any[] = [];
  commandeFilter: any[] = [];
  dated;
  datef;
  toprixwithLiv = 0;
  toprixwithLiv2 = 0;
  toprixwithoutLiv = 0;
  toprixLiv = 0;
  toprixAchat = 0;
  toprixAchat2 = 0;
  selectedstatus;
  toChargecom = 0;
  to_charge_livraison = 0;
  tomarge = 0;
  tofarisLiv = 0;
  status;
  affstatus: any;
  forni;
  Fournisseur: any[] = [];
  statusAf: {status: string, val: number, statusbtn?: string}[] = [];
  mystatus:{status:string}[] = [{status:'Commandée'},{status:'Validée'},{status:'Livrée'},{status:'Traitée'}
    ,{status:'livrée'},{status:'Clôturée'},{status:'Anullée'},{status:'payée'}];
  // dataSource = ELEMENT_DATA;
  isloading = false;
  id_forni = null;
  constructor(private serv: AuthservisesService, private route: Router, private services: ServicesService, private Snack: MatSnackBar) { }

  ngOnInit() {
    this.getAllFourni();
    const authmode = localStorage.getItem('authmode');
    if(authmode == 'Connected') {
      this.Snack.open('connecté', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });

    }else{
      this.route.navigate(['/Auth-forms']);
      this.Snack.open('vous devez d\'abord vous connecter pour vérifier les informations de votre page', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });
    }
    setTimeout(data => {localStorage.removeItem('authmode')},1000);
    this.serv.all_cmdCloturee();
    this.serv.emitDatas().subscribe(data =>
    {
      this.commande = data;
      // console.log(data);
    })
  }
  dateF(event){
    // this.datef = event.target.value;
    const date = event.target.value;
     this.datef = formatDate(date,'yyyy-MM-dd','en-US');
    // console.log(this.datef);

  }
  dateD(event0) {
    // this.dated = event0.target.value;
    const date = event0.target.value;
    this.dated = formatDate(date,'yyyy-MM-dd','en-US');
    // console.log(this.dated);
  }
  selectstatus(status){
    this.selectedstatus = status;
    // console.log(this.selectedstatus);
  }
  getAllFourni() {
    this.services.get_all_fournisseur().subscribe(data => {
      this.Fournisseur = data.data;
    })
  }
  getforni(id, nom) {
    this.id_forni = id;
    this.forni = nom;
  }
  getdata(){
    this.isloading = true;
    if(this.datef >= this.dated) {
    this.serv.getcmd(this.selectedstatus,this.id_forni,this.dated, this.datef);
    let toc = 0; let toa =0; let toliv = 0; let tofrai = 0; let tocharge = 0; let tocL = 0;
    this.serv.emiteDates().subscribe(data => {
      data.Data.forEach(key => {
        toc += key.total_whit_prix_livreson;
        toa += key.total_prixachats;
        toliv += key.prixLevrison;
        tofrai += key.frais_levrison;
        tocharge += key.charge_commande;
        tocL += key.charge_livraison;
      });
      this.toprixwithLiv = toc;
      this.toprixAchat = toa;
      this.toprixLiv = toliv;
      this.tofarisLiv = tofrai;
      this.toChargecom = tocharge;
      this.to_charge_livraison = tocL;
      if(this.id_forni != -1 && this.id_forni != null) {
        this.toprixwithLiv2 = data.to1;
        this.toprixAchat2 = data.to2;
      }
      this.isloading = false;
      console.log(data.Data,data.to1, data.to2, this.toprixwithLiv);
      this.commandeFilter = data.Data;
    })
     }else{
      alert('la date de fin doit etre spirieur a la date de debute');
    }
  }
}
