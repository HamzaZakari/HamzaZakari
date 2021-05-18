import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LivServiceService {
  // private host = 'http://138.68.79.202:3000/';
  private host = '';
  // private host =  'http://localhost:3000/';
  Ville:any[] = [];
  ville:any[] = [];
  produit: any[]=[];
  emitpro =  new Subject<any[]>();
  emitDara = new Subject<any[]>();
  emitdata = new Subject< {ville: string , prixLivraison: any,fraisLivGriteerin200: any , fraisLivSmullerin200: any}[]>();
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {
    if(document.location.hostname == 'localhost') {
      this.host =  'http://localhost:3000/';
    }else {
      this.host = 'https://www.herboshop.ma/herbo/';
    }
  }

  addVille(ville: any, prixLiv: any, frais1: any, frais2: any, fraisliv) {
    const data = {
      ville: ville,
      prixLiv: prixLiv,
      frais1: frais1,
      frais2: frais1,
      fraisliv:fraisliv
    };
    return this.http.post<{err: any, data: any}>(this.host + 'api/add_ville', data);
  }
  gettingAllville(){
    this.http.get<{err: any, data: {ville: string , prixLivraison: any,fraisLivGriteerin200: any , fraisLivSmullerin200: any}[]}>(this.host + 'api/all_Ville').subscribe(data => {
      this.Ville = data.data;
      this.emitDara.next([...this.Ville]);
    });
  }
  gettingAllvilleonly1(){
    return this.http.get<{err: any, data: any[]}>(this.host + 'api/onlyVilleStatus');
  }
  // api/only_ville_status_1
  deleteville(id){
    return this.http.delete<{err: any, data: any}>(this.host+'api/delete_ville/'+id);
  }
  emitVille() {
    return this.emitDara.asObservable();
  }
  emitvile(){
    return this.emitdata.asObservable();
  }
  updateLivfrais(frais200, frais002){
    const data = {
      frais1: frais200,
      frais2: frais002
    }
    return this.http.put<{err: any, data: any}>(this.host+'api/updatefrais', data);
  }
  updatestatus(id){
    const data = {
      id: id
    }
    return this.http.put<{err: any, data: any}>(this.host + 'api/update_status',data);
  }
  updated2status(id){
    const data = {
      id: id
    }
    return this.http.put<{err: any, data: any}>(this.host + 'api/update_status_second',data);
  }
  upvillesss(id, ville, prixliv,upfrailiv){
    const data = {
      id: id,
      ville: ville,
      prixliv:+prixliv,
      upfrausliv: +upfrailiv
    };
     return this.http.put<{err: any, data: any}>(this.host+'api/upville', data);
  }
  getallprod() {
   this.http.get<{data: any[], err: any}>(this.host + 'api/allpro').subscribe(data => {
     this.produit =  data.data;
     this.emitpro.next([...this.produit]);
   });

  }
  emitdatapro() {
    return this.emitpro.asObservable();
  }
  gettingpoidsparpro(id) {
    return this.http.get<{err: any, data: any[]}>(this.host +'api/gettingpoidsparpro/' + id);
  }
  insertnewCMDPRO(id_Orders,id_product,qty, poids, pricecmd,prixachats) {
    const data = {
      id_Orders: id_Orders,
      id_product: id_product,
      qty: qty,
      poids:poids,
      pricecmd: pricecmd,
      prixa: prixachats
    }
    this.http.post<{err: any, data: any}>(this.host+'api/newproforcmd',data).subscribe(data=>{//data
       });
  }

//updating commande after ajoute des nv produits
  upditingcmd(id_orders,total_whit_prix_livreson,total_whitout_prix_levrison,total_prixachats,qty) {
     const data = {
       id_orders: id_orders,
       total_whit_prix_livreson: total_whit_prix_livreson,
       total_whitout_prix_levrison: total_whitout_prix_levrison,
       total_prixachats: total_prixachats,
       count_pro: qty
     }
     this.http.put<{err: any, data: any}>(this.host+'api/upcmdafternewproduct', data).subscribe(data=> {
       //data
     })
  }
getrecap(){
    return this.http.get<{err:any, data:any[]}>(this.host+'api/recap');
}
checkallstatus(status,  value,statusbtn, wentst?){
    const data = {
      status: status,
      statusbtn: statusbtn,
      value: value,
      wentst: wentst
    }
    return this.http.put<{err, data: any}>(this.host +'api/changeallstatus', data);
}
  checkallstatustouts(status,  value,statusbtn){
    const data = {
      status: status,
      statusbtn: statusbtn,
      value: value
    }
    return this.http.put<{err, data: any}>(this.host +'api/changeallstatustouts', data);
  }
  insertregions(region, value){
    const data = {
      regions: region,
      value: value
    }
    return this.http.post<{data:any, err: any}>(this.host+'api/addregions',data);
  }
  getallregions(){
    return this.http.get<{err: any ,data:any[]}>(this.host+'api/allregions');
  }
  checkallstatusregion(status,val,statusbtn, regions){
    const data = {
      status: status,
      value: val,
      statusbtn: statusbtn,
      regions:regions
    }
    return this.http.put<{data: any, err: any}>(this.host+'api/checkregionparst',data);
  }
  getAllsuborderscommande(){
    return this.http.get<{err: any, data: any[]}>(this.host+'api/allsubordimprimer');
  }
  livraisonpanier(prixpanier, prixG,prixS) {
    const data = {
      prixp: prixpanier,
      prixG: prixG,
      prixS: prixS
    }
    return this.http.post<{data: any, err: any}>(this.host + 'api/prix_panier_about_livraison', data);
  }
//  api/getpanier_livraison;
  getpanierliv(){
    return this.http.get<{data: any[], err: any}>(this.host + 'api/getpanier_livraison');
  }

  updatevillesliv(id_ville, prixG, prixS) {
    const data = {
      id: id_ville,
      prixG: +prixG,
      prixS: +prixS
    }
    return this.http.put<{data: any, err: any}>(this.host +'api/addVille', data);
  }
  saveRegions(id_ville, regions) {
    const data = {
      idV: id_ville,
      region: regions
    }
    return this.http.post<{data: any}>(this.host + 'api/saveregion', data);
  }
}

