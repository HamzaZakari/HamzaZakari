import {Component, Inject, OnInit} from '@angular/core';
import {ServicesService} from '../../services/services.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Orders} from '../../Models/orders';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-deatil-orders',
  templateUrl: './deatil-orders.component.html',
  styleUrls: ['./deatil-orders.component.css']
})
export class DeatilOrdersComponent implements OnInit {
  id1;
  id2;
  prixval;
  prixach;
  qtyach;
  poidsch;
  xepOnline: any;
  showModules = false;
  nodelete = false;
  yesdelete = false;
  showspenner = false;
  iddelete;
  datttt = false;

  ordid;
  DetaiOrd: any[] = [];
  tele;
  nom;
  adress;
  deletechck = false;
  count_poids;
  filterData: any[] = [];
  total;
  toto;
  id_oredrs;
  date;
  margeCadeau;
  emitord = new Subject<any[]>();
  fraisL;
  idords;
  commentaire;
  chargecommande;
  comm;
  ville;
  codel;
  codelivraison;
  charge;
  codl;
  chrrgeL;
  cmdcodde;
  comml;
  frail;
  idloading = false;
  prixcahts;
  prixachatsss;
  regions;
  currentJustify = 'start';
  fullname;
  Superadmin;
  role;
  chargeliv;
  url;
  id_prod;
  Actuiel_protocol;
  constructor(private serv: ServicesService, private route: ActivatedRoute, private router: Router,
              @Inject(DOCUMENT) private document: Document ) {
  }
  ngOnInit() {
    document.location.hostname =='localhost' ? this.Actuiel_protocol = document.location.protocol + '//' + document.location.hostname + ':4200' : this.Actuiel_protocol = document.location.protocol + '//' + document.location.hostname;
    console.log(this.Actuiel_protocol);
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('idOrd')) {
        this.ordid = paramMap.get('idOrd');
        this.serv.getdetailord(this.ordid).pipe(map((dataOrder) => {
          return {
            dataOr: dataOrder.results.map(myOrders => {
              console.log(myOrders, 'jjjj');
              return {
                id_detail: myOrders.id_detail,
                id_orders: myOrders.id_orders,
                id_produits: myOrders.product_id,
                email: myOrders.email,
                title: myOrders.title,
                titlearab: myOrders.title_arab,
                adress: myOrders.adress,
                ville: myOrders.Ville,
                CodeLiveraison: myOrders.CodeLivraison,
                prixLevrison: myOrders.prixLivrison,
                toprix: myOrders.totalcomonde,
                total_whit_prix_livreson: myOrders.total_whit_prix_livreson,
                total_whitout_prix_levrison: myOrders.prixLevrison,
                frais_levrison: myOrders.frais_levrison,
                commentaire: myOrders.Commentaire,
                prixachats: myOrders.total_prixachats,
                susubprixachats: myOrders.priceAchette,
                realprixachat: myOrders.to_prixAchat,
                charge: myOrders.charge_commande,
                poids: myOrders.poids,
                poidscmd: myOrders.poidscomonde,
                image: myOrders.image,
                count_pro: myOrders.count_pro,
                qtycomonde: myOrders.qtycomonde,
                telephone: myOrders.telephone,
                full_name: myOrders.Full_name,
                status: myOrders.status,
                regions: myOrders.regions,
                affstatus: myOrders.textstatus,
                created_at: myOrders.created_atord,
                chargeliv:myOrders.charge_livraison,
                CodeCMD: myOrders.CodeCMD

              };
            })
          };
        })).subscribe(datac => {
          console.log(datac.dataOr, 'mmmm');

          this.DetaiOrd = datac.dataOr;
          this.filterData = this.DetaiOrd;
          console.log(this.DetaiOrd);
          this.emitord.next([...this.DetaiOrd]);
          console.log(this.DetaiOrd);
          if (this.DetaiOrd) {
            this.tele = this.DetaiOrd[0].telephone;
            this.nom = this.DetaiOrd[0].full_name;
            this.adress = this.DetaiOrd[0].adress;
            this.total = this.DetaiOrd[0].total_whit_prix_livreson;
            this.date = this.DetaiOrd[0].created_at;
            this.idords = this.DetaiOrd[0].id_orders;
            this.ville = this.DetaiOrd[0].ville;
            this.codl = this.DetaiOrd[0].CodeLiveraison;
            this.toto = this.DetaiOrd[0].total_whitout_prix_levrison;
            this.frail = this.DetaiOrd[0].frais_levrison;
            this.comml = this.DetaiOrd[0].commentaire;
            this.chrrgeL = this.DetaiOrd[0].charge;
            this.prixcahts = this.DetaiOrd[0].prixachats;
            this.cmdcodde = this.DetaiOrd[0].CodeCMD;
            this.regions = this.DetaiOrd[0].regions;
            this.chargeliv = this.DetaiOrd[0].chargeliv;

            console.log(this.fraisL, this.charge, this.commentaire, this.codelivraison, 'hamza mmm haha');
            var totalprixachats = 0;
            var prixchat = 0
            let achats = 0;
            var toAchats = 0;
            var achette = 0;
            for (let i = 0; i < this.DetaiOrd.length; i++) {
              achats = this.DetaiOrd[i].prixachats;
              achette += this.DetaiOrd[i].susubprixachats;
              prixchat = this.DetaiOrd[i].prixachats * this.DetaiOrd[i].qtycomonde;
              this.total = this.DetaiOrd[i].total_whit_prix_livreson;
              console.log(prixchat);
              totalprixachats += prixchat;
              toAchats += prixchat;
            }
            var machette;
            machette = achette;
            this.margeCadeau = (this.total - this.prixcahts) * 10 / 100;

          }
        });
      }
    });
    this.fullname = localStorage.getItem('full_name');
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      this.role = data[0].Role;
      console.log(data[0].Full_name);
      if (data[0].Role == 'super admin' || data[0].Role == 'admin' || data[0].Role == 'service clients' || data[0].Role == 'Agent de Commandes') {
        this.Superadmin =  data[0].Full_name;
      } else {
        this.router.navigate(['/Authentifications']);
      }
    }else {
      this.router.navigate(['/Authentifications']);
    }
  }

  delete(id,id_pro,id2, prix, qty, poids, prixa) {
    this.showModules = true;
    this.iddelete = id2;
    this.id_oredrs = id;
    this.id1 = id;
    this.id2=id2;
    this.prixval = prix;
    this.qtyach = qty;
    this.poidsch = poids;
    this.prixach = prixa;
    this.id_prod = id_pro;
  }

  /**
   const updatedProduit = this.Produits.filter(prod => prod.id !== proId);
   this.Produits = updatedProduit;
   this.emitdata.next([...this.Produits]);
   this.message = 'your post deleted sussefully';
   */
  emitdata() {
    return this.emitord.asObservable();
  }

  valideF(fraisL, code, comm, charge) {
    this.idloading = true;
    this.serv.updateFraisLiv(fraisL, code, comm, charge, this.idords).subscribe(data => console.log(data));
    setTimeout(() => {
      this.router.navigate(['/dashboard/all_orders']);
      this.idloading = false
    }, 2000);
  }
  nosur() {
    this.showModules = false;
    this.nodelete = true;
    setTimeout(()=>{this.nodelete = false;},500);
  }
  yeshesur() {
    this.yesdelete = true;
    this.showspenner = true;
    if(this.yesdelete == true) {
      this.deletechck = true;
      var prixmy;
      var prixs = 0;
      prixs = this.total - this.prixval;
      // if(prixs > 200) {
      prixmy = prixs;
      // }
      const prixchats = this.prixcahts - this.prixach;
      this.serv.deletesubcom(this.id1, this.id2, prixmy, this.qtyach, this.poidsch, prixchats).subscribe(data => {
        if (data.data == 'deleted') {
          const updateOrder = this.filterData.filter(prod => prod.id_detail != this.id1);
          this.DetaiOrd = updateOrder;
          this.filterData = this.DetaiOrd;
          this.serv.updateqty_after_delete(this.id_prod,this.qtyach,this.poidsch).subscribe(data => {console.log(data.data)},error => {console.log(error)});
          setTimeout(() => {
            this.deletechck = false;
          }, 2000);
          this.serv.getdetailord(this.ordid).pipe(map((dataOrder) => {
            return {
              dataOr: dataOrder.results.map(myOrders => {
                return {
                  id_detail: myOrders.id_detail,
                  id_orders: myOrders.id_orders,
                  id_produits: myOrders.product_id,
                  email: myOrders.email,
                  title: myOrders.title,
                  titlearab: myOrders.title_arab,
                  adress: myOrders.adress,
                  ville: myOrders.Ville,
                  CodeLiveraison: myOrders.CodeLivraison,
                  prixLevrison: myOrders.prixLivrison,
                  toprix: myOrders.totalcomonde,
                  totalecomonde: myOrders.totalcomonde,
                  total_whit_prix_livreson: myOrders.total_whit_prix_livreson,
                  total_whitout_prix_levrison: myOrders.prixLevrison,
                  frais_levrison: myOrders.frais_levrison,
                  commentaire: myOrders.Commentaire,
                  prixachats: myOrders.total_prixachats,
                  susubprixachats: myOrders.priceAchette,
                  realprixachat: myOrders.to_prixAchat,
                  regions: myOrders.regions,
                  charge: myOrders.charge_commande,
                  poids: myOrders.poids,
                  poidscmd: myOrders.poidscomonde,
                  image: myOrders.image,
                  count_pro: myOrders.count_pro,
                  qtycomonde: myOrders.qtycomonde,
                  telephone: myOrders.telephone,
                  full_name: myOrders.Full_name,
                  status: myOrders.status,
                  affstatus: myOrders.textstatus,
                  created_at: myOrders.created_atord,

                };
              })
            };
          })).subscribe(datac => {

            this.DetaiOrd = datac.dataOr;
            this.filterData = this.DetaiOrd;
            this.emitord.next([...this.DetaiOrd]);
            if (this.DetaiOrd) {
              this.tele = this.DetaiOrd[0].telephone;
              this.nom = this.DetaiOrd[0].full_name;
              this.adress = this.DetaiOrd[0].adress;
              this.total = this.DetaiOrd[0].total_whit_prix_livreson;
              this.date = this.DetaiOrd[0].created_at;
              this.idords = this.DetaiOrd[0].id_orders;
              this.ville = this.DetaiOrd[0].ville;
              this.codl = this.DetaiOrd[0].CodeLiveraison;
              this.toto = this.DetaiOrd[0].total_whitout_prix_levrison;
              this.frail = this.DetaiOrd[0].frais_levrison;
              this.comml = this.DetaiOrd[0].commentaire;
              this.chrrgeL = this.DetaiOrd[0].charge;
              this.prixcahts = this.DetaiOrd[0].prixachats;
              var totalprixachats = 0;
              var prixchat = 0
              let achats = 0;
              var toAchats = 0;
              for (let i = 0; i < this.DetaiOrd.length; i++) {
                achats = this.DetaiOrd[i].prixachats;
                prixchat = this.DetaiOrd[i].prixachats * this.DetaiOrd[i].qtycomonde;
                this.total = this.DetaiOrd[i].total_whit_prix_livreson;
                console.log(prixchat);
                totalprixachats += prixchat;
                toAchats += prixchat;
              }

              console.log(totalprixachats, this.total);
              this.margeCadeau = (this.total - this.prixcahts) * 10 / 100;

            }
          });
        }
      });

            this.yesdelete = false;
            setTimeout(()=>{this.showModules = false;this.yesdelete = false;this.showspenner = false;},1000);

    }

  }

  //
  // public exportAsPDF(): void {
  //   return xepOnline.Formatter.Format('content', {render: 'download', filename: this.cmdcodde});
  //   setTimeout(() => {
  //     this.datttt = false;
  //   }, 2000);
  // }

  public exportAsXLSX(): void {
    // return xepOnline.Formatter.Format('content', {render: 'download', filename: this.cmdcodde});
    const data = [];
    const data2 = [];
    var nomducli, codecmd, adress, totalcmd, totalprixLiv, totalprixachat, lamarge, totalliv, produit;
    for (let i = 0; i < this.DetaiOrd.length; i++) {
      data.push({
        Produit: this.DetaiOrd[i].titlearab,
        Prix: this.DetaiOrd[i].toprix,
        Poids: this.DetaiOrd[i].poidscmd,
        Qunatity: this.DetaiOrd[i].qtycomonde,
        nomducli: this.nom,
        codecmd: this.cmdcodde,
        adress: this.adress,
        totalcmd: this.total,
        totalprixLiv: this.total + this.toto,
        totalprixachat: this.prixcahts,
        lamarge: this.DetaiOrd[0].total_whit_prix_livreson - this.DetaiOrd[0].prixachats,
        totalliv: this.total - this.prixcahts
      });
    }
    this.serv.exportAsExcelFile(data, this.cmdcodde + new Date());
  }

}
