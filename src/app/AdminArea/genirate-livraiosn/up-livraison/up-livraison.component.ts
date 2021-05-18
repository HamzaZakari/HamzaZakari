import {Component, OnDestroy, OnInit} from '@angular/core';
import {LivServiceService} from '../liv-service.service';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-up-livraison',
  templateUrl: './up-livraison.component.html',
  styleUrls: ['./up-livraison.component.css']
})
export class UpLivraisonComponent implements OnInit, OnDestroy {
 susb: Subscription;
 upville;
 upLiv;
 region;
 myloading = false;
  prixLiv;
  ville;
  frais200;
  checks = [];
  frais002;
  isloading = false;
  isloading2 = false;
  isloading3 = false;
  show_message = false;
  text_message= '';
  text_notes = '';
  ides = [];
  id;
  prixpanier;
  prixG;
  prixS;
  ngcheckd = false;
  ngcheckd2 = true;
  ngcheckd3 = false;
  isloadingpanier = false;
  idesinchecked = [];
  id_ville;
  showsuccessdone = false;
  frasidelivraison;
  upfraisliv;
  Ville:{id_Ville,ville: string , prixLivraison: any,fraisLivGriteerin200: any , fraisLivSmullerin200: any,prixG: any,prixS: any,fraislivraison: any, status: any}[] = [];
  VilleFilter:{id_Ville,ville: string , prixLivraison: any,fraisLivGriteerin200: any , fraisLivSmullerin200: any,prixG: any,prixS: any,fraislivraison: any, status: any}[] = [];
  constructor(private serv: LivServiceService, private Snack: MatSnackBar) { }

  ngOnInit() {
    this.getAllVille();
    this.serv.getpanierliv().subscribe(data => {
      this.prixpanier = data.data[0].prixpanier;
      this.prixG = data.data[0].prixG;
      this.prixS = data.data[0].prixS;
    })
  }
  getidVille(id) {
   this.id_ville = id;
  }
  saveregions() {
    this.serv.saveRegions(this.id_ville, this.region).subscribe(data => {
      if(data.data === 'saved') {
        this.Snack.open('la region est bien ajouter', 'x', {panelClass: 'success',verticalPosition: 'top', duration: 1000});
       this.region = '';
      }
    })
  }
  filterStatus(id_ville){
    // console.log(id_ville);
    this.id_ville = id_ville;
  }
  getAllVille(){
    this.serv.gettingAllville();
    this.susb = this.serv.emitVille().subscribe(data => {
      this.Ville = data;
      this.frais200 = this.Ville[0].fraisLivGriteerin200;
      this.frais002 = this.Ville[0].fraisLivSmullerin200;
    })
  }
  save(ville, prixLiv,frasidelivraison) {
    this.isloading3 = true;
    const data ={ville: ville, prixLivraison: prixLiv, fraisLivGriteerin200: null, fraisLivSmullerin200: null,fraislivraison:frasidelivraison};
    this.serv.addVille(ville, prixLiv, null, null,frasidelivraison).subscribe(data => {
      this.Ville = data.data;
      this.VilleFilter = this.Ville;
      if(data.data){
        this.show_message = true;
        this.text_message = 'la Ville ajouté avec succès';
        this.text_notes = 'Ajouter !';

        setTimeout(()=>{this.isloading3 = false;this.show_message = false;
          this.ville = '';
          this.prixLiv = '';
        },2000);
      }
    });
  }
  delete(id){
    const deletedata = this.VilleFilter.filter(key => key.id_Ville != id);
    this.Ville = deletedata;
    this.VilleFilter = this.Ville;
    this.serv.deleteville(id).subscribe(data =>{
     if(data.data) {
       this.show_message = true;
       this.text_message = 'la Ville supprimee avec succès';
       this.text_notes = 'suppressions !';
       setTimeout(()=>{this.show_message = false;},2000);
     }
    })
  }
  update(frais200,frais002){
    this.isloading = true
    this.serv.updateLivfrais(frais200,frais002).subscribe(data => {
      if(data.data == 'U'){
        this.show_message = true;
        this.text_message = 'L\'opération s\'est terminée avec succès';
        this.text_notes = 'Modivications !';

        setTimeout(()=>{
          this.isloading = false;
        this.show_message = false;
          this.frais002 = '';
          this.frais200 = '';
        }, 2000);
      }else{
        this.show_message = true;
        this.text_message = 'il y a une erreur';
        this.text_notes = 'Warning !';
        setTimeout(()=>{
          this.isloading = false;
          this.show_message = false;
        }, 2000);
      }

    })
  }
  checked(event, id){
    if(event.checked == true){
      this.ides.push(id);
      this.idesinchecked = this.idesinchecked.filter(key => key !=id);
    }else{
      this.ides = this.ides.filter(key => key != id);
      this.idesinchecked.push(id);
    }
  }
  Valider(){
    this.isloading2 = true;
    if(this.ides.length != 0) {
      for (let id of this.ides) {
        this.serv.updatestatus(id).subscribe(data => {
          if (data.data == 'UP') {
            this.show_message = true;
            this.text_message = 'Modifier avec success';
            this.text_notes = 'Change ville !';
            this.serv.gettingAllville();
            this.serv.emitVille().subscribe(data => {
              this.Ville = data;
            });
            setTimeout(() => {
              this.isloading2 = false;
              this.show_message = false;
            }, 2000);
          }
        })
      }
    }
    if(this.idesinchecked.length !=0) {
      for (let ids of this.idesinchecked) {
        this.serv.updated2status(ids).subscribe(datas => {
          if (datas.data == 'UP') {
            this.show_message = true;
            this.text_message = 'Modifier avec success';
            this.text_notes = 'notes !';
            setTimeout(() => {
              this.isloading2 = false;
              this.show_message = false;
            }, 2000);
          }
        })
      }
    }
    this.ides = [];
    for (let index = 0 ; index < this.checks.length ; index++) {
      this.checks[index] = false;
    }
  }
  updatees(id_Ville){
this.id = id_Ville;
}
  upvilles(idv,upville, upLiv,upvilles){
    this.myloading = true;
   this.serv.upvillesss(idv,upville,upLiv,upvilles).subscribe(data=>{
     if(data.data=='UPV'){
       setTimeout(()=>{
         this.myloading =false;
         this.getAllVille();
         },2000);
     }
   })
  }
  close(id_Ville) {
    this.id = null;
}
  updatepanielivraison(prixpanier, prixG,prixS) {
    this.isloadingpanier = true;
    this.serv.livraisonpanier(prixpanier,prixG,prixS).subscribe(data => {
    if(data.data == 'updated' || data.data == 'inerted') {
      setTimeout(() => {this.isloadingpanier = false; this.showsuccessdone == true;},1000);
      setTimeout(() => {this.showsuccessdone == false;},1500);
    }
   if(this.id_ville != null) {
     this.serv.updatevillesliv(this.id_ville, prixG, prixS).subscribe(data => {
       if(data.data == 'update') {
         return;
       }else{
         alert('sume err is here');
       }
     })
   }
    })
  }
ngOnDestroy(): void {
    this.susb.unsubscribe();
}
}
