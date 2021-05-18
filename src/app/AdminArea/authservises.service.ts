import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {truncate} from 'fs';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AuthservisesService {
  // private host = 'http://138.68.79.202:3000/';
  // private host =  'http://localhost:3000/';
  private host = '';
  emitData = new Subject<any[]>();
  emitDatadate = new Subject<{Data: any[], to1: number, to2:number}>();
  orders: any[] = [];
  ordersD: any[] = [];

  constructor(private Http: HttpClient, @Inject(DOCUMENT) private document: Document, private route: Router, private snak: MatSnackBar) {
    if (document.location.hostname == 'localhost') {
      this.host = 'http://localhost:3000/';
    } else {
      this.host = 'https://www.herboshop.ma/herbo/';
    }
  }

  yahya_Auth(Nom: string, password: string) {
    const data = {
      nom: Nom,
      pass: password
    };

    return this.Http.post<{ err: any, data: any }>(this.host + 'api/authYahya', data);
  }

  all_cmdCloturee() {
    return this.Http.get<{ data: any[] }>(this.host + 'api/all_commande_Cloturee').subscribe(data => {
      this.orders = data.data;
      this.emitData.next([...this.orders]);
    });
  }

  getcmd(status: any,id_forni: number, dated: any, datef: any ) {
    const data = {
      status: status,
      id_forni: id_forni?id_forni:-1,
      dated: dated,
      datef: datef
    }
     this.Http.post<{ data: any[], totalec?: number, totalea?: number}>(this.host + 'api/fetchdate', data)
      .subscribe(data => {
      this.ordersD = data.data;
      this.emitDatadate.next({Data:[...this.ordersD], to1: data.totalec, to2: data.totalea});
    });
  }

  emitDatas() {
    return this.emitData.asObservable();
  }

  emiteDates() {
    return this.emitDatadate.asObservable();
  }

  bannerimages(image: string) {
    const dataimage = new FormData();
    dataimage.append('image', image);
    this.Http.post<{ message: string, error: string }>(this.host + 'api/bannerImages', dataimage).subscribe(data => {
      // console.log('added successfully', data.message, "err", data.error);
    });
  }

  Sliderimages(image: string, prodid, catid, bo_id) {
    const dataimage = new FormData();
    dataimage.append('image', image);
    dataimage.append('id', prodid != null ? prodid : '0');
    dataimage.append('catid', catid != null ? catid : '0' );
    dataimage.append('bo_id', bo_id != null ? bo_id : '0' );
    this.Http.post<{ data: string, error: string }>(this.host + 'api/sliderImages', dataimage).subscribe(data => {
      // console.log('added successfully', data.message, "err", data.error);
      if(data.data == 'saved') {
        this.snak.open('le slider est bien ajouter', 'x', {panelClass: 'success', verticalPosition: 'bottom', duration: 2000});
      }
    }, error => {
      this.snak.open('Ops une probleme de connexion ou l\'image est trop l\'arge' , 'x', {panelClass: 'error', verticalPosition: 'bottom', duration: 2000});

    });
  }

  getAllbannerimages() {
    return this.Http.get<{ err: any, data: any[] }>(this.host + 'api/all_banner_images');
  }

  getAllsliderimages() {
    return this.Http.get<{ err: any, data: any[] }>(this.host + 'api/all_slider_images');
  }

  deletebannerimages(id) {
    return this.Http.delete<{ err: any, data: any }>(this.host + 'api/delete_banner_images/' + id);
  }

  deletesliderimages(id) {
    return this.Http.delete<{ err: any, data: any }>(this.host + 'api/delete_slider_images/' + id);
  }

  addbannerichhar(titlefr: any, titlearb: any, titleeng: any) {
    const data = {
      titlefr: titlefr,
      titlearab: titlearb,
      titleeng: titleeng
    };
    return this.Http.post<{ err: any, data: any[] }>(this.host + 'api/Ichhar_banner', data);
  }

  gettingalltitleofbanner() {
    return this.Http.get<{ err: any, data: any[] }>(this.host + 'api/all_title_banner');
  }

  deletetitlebaner(id) {
    this.Http.delete<{ err: any, data: any }>(this.host + 'api/deletebanertitle/' + id).subscribe(data => {
      console.log(data.data);
    });
  }

  managepoids(id) {
    return this.Http.get<{ err: any, data: any[] }>(this.host + 'api/managepoids/' + id);
  }

  getupdategepoids(id) {
    return this.Http.get<{ err: any, data: any }>(this.host + 'api/get-updatedata-poids/' + id);
  }

  uppoids(id_gramage, pro_id, firstpoids, poids: any, prixv: any, prixa: any, prixp: any, qty: any) {
    const data = {
      id_gramage: id_gramage,
      pro_id: pro_id,
      firstpoids: firstpoids,
      poids: poids, prixv: prixv, prixa: prixa, prixp: prixp, qty: qty
    };
    return this.Http.put(this.host + 'api/uppoidsdata', data);
  }

  deletepoids(pro_id, poids, id_gramage) {
    return this.Http.delete<{ err: any, data: any }>(this.host + 'api/delete_poids/' + pro_id + '/' + id_gramage + '/' + poids);
  }

  setpoidstodefults(id_gramage, id_pro, poids, qty, prixp, prixa, prixv) {
    console.log(id_gramage, id_pro, poids, qty, prixp, prixa, prixv);
    const data = {
      id_gramage: id_gramage,
      id_pro: id_pro,
      poids: poids,
      qty: qty,
      prixp: prixp,
      prixa: prixa,
      prixv: prixv
    }
    return this.Http.put<{ data: any, err: any }>(this.host + 'api/settodefault', data);
  }

  deleteord(id) {
    return this.Http.delete<{ err: any, data: any }>(this.host + 'api/deletecomd/' + id);
  }

  suivCMD(code) {
    var data;
    data = {
      CodeCMD: code
    };
    return this.Http.post<{ err: any, data: any[] }>(this.host + 'api/voir_mes_cmd', data);
  }
}
