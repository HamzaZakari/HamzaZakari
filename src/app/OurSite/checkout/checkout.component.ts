import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ServicesService} from '../../AdminArea/services/services.service';
import { Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PupusmoduleComponent} from '../pupusmodule/pupusmodule.component';
import {LivServiceService} from '../../AdminArea/genirate-livraiosn/liv-service.service';
import { DOCUMENT, formatDate} from '@angular/common';
import {AuthservisesService} from '../../AdminArea/authservises.service';
import {CategoryServService} from '../../AdminArea/services/cat_services/category-serv.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})


export class CheckoutComponent implements OnInit, OnDestroy {
  rateInput;
  isloading = false;
data: any[] = [];
total;
data2: any[]= [];
clients: {Full_name: string, adress: string,telephone: number,city: string,region: string, prix: string,fraislivraison: number, prixS: any, prixG:any}[] = [];
subs: Subscription;
isloding = false;
dispaly = false;
rapide = false;
checkbtn =false;
msg = '';
checkqty = false;
animal: string;
name: string;
rapidecom: NgForm;
prixliiiiv;
vilevile;
tele;
idVilleselect;
adress;
namecli;
shipping;
campville = false;
fraisS;
Ville:{id_Ville,ville: string , prixLivraison: any,fraisLivGriteerin200: any , fraisLivSmullerin200: any,fraislivraison: any,prixG: any,prixS: any, status: any}[] = [];
VilleF:{id_Ville,ville: string , prixLivraison: any,fraisLivGriteerin200: any , fraisLivSmullerin200: any,fraislivraison: any,prixG: any,prixS: any, status: any}[] = [];
frais200;
frais002;
prixLiv;
ville;
nameC;
teleC;
adressC;
prixL;
totalprixachat = 0;
lamarge = 0;
subs2: Subscription;
isloading2 = false;
checktelelenth = false;
classs = '';
editeclient =  false;
checkdn = false;
reggion:any[]=[];
reggionF:any[]=[];
myRegion;
selectRegion = false;
subsreg: Subscription;
hadaregion;
prixpanier;
prixG;
prixS;
frais_levrison = 0;
fraisliv = 0 ;
prixliv222;
qtydata: any[] = [];
url;
orders_qty_data = [];
check_client_data =  false;
  constructor(private serv: ServicesService , private route: Router ,
              public dialog: MatDialog,private serv2: LivServiceService,
              private servicat: CategoryServService ,
              private serv3: AuthservisesService, @Inject(DOCUMENT) private document: Document, private snack: MatSnackBar) { }

  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/app/images/';
    }
    let data = JSON.parse(localStorage.getItem('panier'));
    data.forEach(key => {
      this.servicat.getrealqty(key.product_id, key.qtyPanier).subscribe(data => {
        this.orders_qty_data.push(data.data[0]);
      })
    })
    this.serv2.getallregions().subscribe(data=>{
      this.reggion = data.data;
      this.reggion = data.data;
    });
    this.getAllVille();
    this.data = this.serv.getiteminlocatlstorage();
    var sumprixachats = 0;
    for(let i = 0; i < this.data.length ; i++ ) {
      const totalprixachats = this.data[i].prixAchats * this.data[i].qtyPanier;
        sumprixachats += totalprixachats;
    }
    this.totalprixachat = sumprixachats;
    this.total = JSON.parse(localStorage.getItem('total'));
    const client = JSON.parse(localStorage.getItem('client'));
    this.clients = client;
    if(this.clients) {
      this.name = this.clients['Full_name'];
      this.tele = this.clients['telephone'];
      this.adress = this.clients['adress'];
      this.ville = this.clients['city'];
      this.prixliiiiv = this.clients['prix'];
      this.prixliv222 = this.clients['prix2'];
      this.myRegion =  this.clients['region'];
      this.prixG = this.clients['prixG'];
      this.prixS = this.clients['prixS'];
      this.fraisliv = this.clients['fraislivraison'];
      // this.shipping = JSON.parse(localStorage.getItem('prixS'));
    }
    if(this.clients.length != 0) {
      this.check_client_data = true;
    }else {
      this.check_client_data = false;
    }
    this.rapide = JSON.parse(localStorage.getItem('rapide'))? JSON.parse(localStorage.getItem('rapide')):false;
    this.serv2.getpanierliv().subscribe(data => {
      this.prixpanier = data.data[0].prixpanier;
      // this.prixG = data.data[0].prixG;
      // this.prixS = data.data[0].prixS;
    })
   }
  myvalue(ville, prixLivraison) {
    this.Ville = ville;
    this.prixLiv = prixLivraison;
  }
  ched(id,vil, prix, fraisLiv,prixG, prixS){
    this.prixG = prixG;
    this.prixS = prixS;
    this.idVilleselect = id;
  this.vilevile = vil;
  this.prixliiiiv = prix;
  // this.prixliv222 = prix;
  this.campville = true;
  this.fraisliv = fraisLiv;
  // alert(this.fraisliv+'+'+this.prixliiiiv);
  }
  regions(region, valregion){
    this.hadaregion = region;
    this.selectRegion = true;

  }
  check(tele){
    const te = tele.toString().length;
    if(te > 10) {
      this.classs = 'error';
    }else {
      this.classs = '';
    }
  }
  // serchregion(key) {
  //   console.log('region', key, this.reggion);
  //   const data = this.reggionF.filter(ds => ds.regions.toLocaleLowerCase().match(key.target.value.trim().toLocaleLowerCase()))
  //   this.reggion = data;
  //   console.log(data);
  // }
  modifier() {
    localStorage.removeItem('client');
   const data = JSON.parse(localStorage.getItem('client'));
   this.clients = data;
  }

  saverapide(rapidecom: NgForm) {
    let data = JSON.parse(localStorage.getItem('panier'));
    data.forEach(key => {
      this.servicat.getrealqty(key.product_id, key.qtyPanier).subscribe(data => {
        this.orders_qty_data.push(data.data[0]);
      })
    })
    const tele = (rapidecom.value.teler).toString().length;
    const telephone = rapidecom.value.teler;
    if (telephone.slice(0,2) == '05' || telephone.slice(0,2) == '06'|| telephone.slice(0,2) == '07'){
      this.checkdn = false;
      this.isloading2 = true;
    }else {
      this.checkdn = true;
      this.isloading2 = false;
    }

    if(!this.ville && !this.prixliiiiv){
      this.campville = false;
    }
    else if(tele != 10 || this.checkdn == true){
      this.isloading2 = false;
      this.checktelelenth =  true;
    }
    else
    if(rapidecom.invalid){
      setTimeout(()=>{this.isloading2 = false;},1000);
      return;
    }else {
      this.isloading2 = true;
      const mydata = [{
        "Full_name": rapidecom.value.namer,
        "adress": rapidecom.value.adressr,
        "telephone": rapidecom.value.teler,
        "city": this.vilevile,
        "region": this.hadaregion,
        "prix": this.prixliiiiv,
        // "prix2": this.prixliv222,
        "fraislivraison":this.fraisliv,
        // "prixG": this.prixG,
        // "prixS": this.prixS
      }];
      localStorage.setItem('client', JSON.stringify(mydata));
      const data = JSON.parse(localStorage.getItem('client'));
      this.clients = data;
      if(this.clients.length != 0) {
        this.check_client_data = true;
      }else {
        this.check_client_data = false;
      }
      this.name = this.clients[0].Full_name;
      this.tele = this.clients[0].telephone;
      this.adress = this.clients[0].adress;
      this.ville = this.clients[0].city;
      this.prixliiiiv = this.clients[0].prix + this.clients[0].fraislivraison;
      this.myRegion = this.clients[0].region;
      // this.prixG = this.clients[0].prixG;
      // this.prixS = this.clients[0].prixS;
      const  total = JSON.parse(localStorage.getItem('total'));
       // const lamarge = Math.floor((total - this.totalprixachat) * 10 / 100);

        localStorage.setItem('prixS', JSON.stringify(this.prixliiiiv));
      this.isloding = true;
      this.serv.addClientrapide(rapidecom.value.namer, rapidecom.value.adressr, rapidecom.value.teler, this.vilevile,this.hadaregion, this.prixliiiiv,this.prixliv222,this.fraisliv, this.prixG, this.prixS);
      // localStorage.setItem('client',JSON.stringify(data.data));
      this.clients = JSON.parse(localStorage.getItem('client'));
      if (this.clients) {
        setTimeout(() => {
          this.isloading2 = false;
          this.isloding = false;
        }, 2000)

      }
    }
  }

  saveorder() {
    if(!this.clients) {
      this.snack.open('Merci de valider vos informations !!!', 'x', {panelClass: 'error', verticalPosition: 'bottom', duration: 3000})
    } else {
      this.isloding = true;
      this.isloading = true;
      const day = new Date().getUTCDate();
      const month = new Date().getDay();
      const ss = new Date().getSeconds();
      const mm = new Date().getMinutes();
      const hh = new Date().getHours();
      const tele = this.tele.slice(6, 8);
      const random1 = Math.floor((Math.random() * 9) + 1);
      const subid = random1 + '' + day + '' + hh + '' + mm + '' + ss;

      var panier1 = [];
      const qtys = [];
      let check = false;
      panier1 = JSON.parse(localStorage.getItem('panier'));
      const panier = panier1.filter(key => key.qtyPanier != 0 && key.qtyPanier > 0);
      let index = 0;
      for (let pro of panier) {
        index++;
        for (let q of this.orders_qty_data) {
          if (pro.product_id == q.product_id && pro.qtyPanier > q.quantity) {
            this.checkqty = true;
            this.checkbtn = true;
            this.msg = " La quantité que vous avez sélectionnée n'est pas disponible  " + pro.poids + "  |" + (pro.title != 'null' ? pro.title : '') + "(" + pro.title_arab + ")";
            setTimeout(() => {
              this.checkbtn = false;
              this.isloading = false;
            }, 2000);
            check = true;
            return;
          } else {
            //
          }
        }
      }
      if (!check) {
        const total = JSON.parse(localStorage.getItem('total'));
        if (this.checkqty == false || this.checkqty == true) {
          setTimeout(() => {
            const cmd = new Date();
            const cmd2 = formatDate(cmd, 'yyyy-MM-dd', 'en-US');
            const year = cmd2.slice(0, 4);
            const mon = cmd2.slice(5, 7);
            const codecmd = 'CMD' + year + mon;
            this.serv.AddOrder(subid, this.tele, this.data.length, this.name, this.adress, this.ville, this.myRegion, this.prixliiiiv,
              total, this.totalprixachat, this.lamarge, 0, codecmd, this.fraisliv).subscribe(data => {
              if (data.data == 'we done') {
                for (let i = 0; i < panier1.length; i++) {
                  this.serv.updatingqtafterdelete(panier1[i].product_id, panier1[i].qtyPanier, panier1[i].poids).subscribe(data => {
                    if (data.data == 'done__qty') {
                      localStorage.setItem('cmdcode', JSON.stringify('CMD' + subid));
                    }
                  }, error => {
                    alert('connexion error')
                  });
                }
                setTimeout(() => {
                  this.route.navigate(['/Remerciement']);
                  this.isloading = true;
                  this.isloding = true
                }, 5000);
              }

            }, error => {
              if (error.error.err.code == 'ER_BAD_FIELD_ERROR') {
                alert('you have in error ocurred');
              }

            });
          }, 500);
        }
      }
      //
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PupusmoduleComponent , {
      width: '850px',
      height:'400px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
  rapid(event){
   this.rapide = event.checked;
   localStorage.setItem('rapide', JSON.stringify(event.checked));
  }
  close(){
    this.checkbtn = false;
  }
  getAllVille(){
    this.subs2 = this.serv2.gettingAllvilleonly1().subscribe(data => {
      this.Ville = data.data;
      this.VilleF = data.data;
      if(this.Ville) {
        this.frais200 = this.Ville[0].fraisLivGriteerin200;
        this.frais002 = this.Ville[0].fraisLivSmullerin200;
      }
    });
  }
  serchville(key) {
    console.log(key.target.value);
    const newData = this.VilleF.filter(sc => sc.ville.toLocaleLowerCase().match(key.target.value.trim().toLocaleLowerCase()));
    this.Ville = newData;
  }

  uuid() {
    var uuidValue = "", k, randomValue;
    for (k = 0; k < 32;k++) {
      randomValue = Math.random() * 16 | 0;

      if (k == 8 || k == 12 || k == 16 || k == 20) {
        uuidValue += "-"
      }
      uuidValue += (k == 12 ? 4 : (k == 16 ? (randomValue & 3 | 8) : randomValue)).toString(16);
    }
  }
  // recapCMD() {
  //     return xepOnline.Formatter.Format('content', {render: 'download', filename: 'Récap de' + this.name});
  // }
  ngOnDestroy(): void {
    if (this.subs2 && this.subsreg) {
      this.subs2.unsubscribe();
      this.subsreg.unsubscribe();
    }
  }
}
