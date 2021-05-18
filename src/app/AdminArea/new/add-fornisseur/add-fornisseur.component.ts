import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Placeholder} from '@angular/compiler/src/i18n/i18n_ast';
import {position} from '@progress/kendo-angular-grid/dist/es2015/dragdrop/common';
import {ServicesService} from '../../services/services.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-fornisseur',
  templateUrl: './add-fornisseur.component.html',
  styleUrls: ['./add-fornisseur.component.css']
})
export class AddFornisseurComponent implements OnInit, OnDestroy {
nom;
load = false;
load2 = false;
Fornisseur: any[] = [];
FornisseuF: any[] = [];
subs: Subscription;
id;
  constructor(private SnackBar: MatSnackBar, private ser: ServicesService) { }

  ngOnInit(): void {
    this.getAllfourni();
  }
  save(nom) {
    this.load = true;
    this.ser.save_fourni(nom).subscribe(data => {
      if(data.data === 'saved') {
        this.SnackBar.open('le fournisseur est bien ajouter', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
      this.load = false;
      this.nom = '';
      this.getAllfourni();
      }
    }, error => console.log(error));
  }
  getAllfourni() {
   this.subs = this.ser.get_all_fournisseur().subscribe(data => {
      this.Fornisseur = data.data;
      this.FornisseuF = data.data;
    }, error => console.log(error));
  }
  delete(id) {
    this.id = id;
    this.load2 = true;
    this.ser.delete_from_forni(id).subscribe(data => {
      if(data.data === 'deleted') {
        const data = this.FornisseuF.filter(key => key.id_forni != id);
        this.Fornisseur = data;
        this.FornisseuF = this.Fornisseur;
        this.SnackBar.open('le fournisseur est bien suprimer', '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 3000 });
      this.load2 = false;
      }
    })
  }
  ngOnDestroy(): void {
    if(this.subs ){
      this.subs.unsubscribe();
    }
  }
}
