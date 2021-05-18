import {Inject, Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Products } from '../Models/products';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../Models/category';
import { Gramage } from '../Models/gramage/gramage';
import { Litrage } from '../Models/litrage';
import { ManagePoids } from '../Models/manage-poids';
import { empty } from 'rxjs/internal/Observer';
import { Admin } from '../Models/admin';
import { Router } from '@angular/router';
// import { error } from 'util';
import { Multiimage } from '../Models/multiimage';
import { Cart } from '../Models/cart';
import { Clients } from '../Models/clients';
import { Orders } from '../Models/orders';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {DOCUMENT} from '@angular/common';
import {MatSnackBar} from '@angular/material';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private Produits: Products[] = [];
  private ProPaginate: Products[] = [];
  private Category: Category[] = [];
  private Boutique: any[] = [];
  private Orders: any[] = []
  private gramage: Gramage[] = [];
  cartPro: Products[];
  cart: Cart[] = [];
  emitdata = new Subject<Products[]>();
  propaginat = new Subject<Products[]>();
  emitdatanewpro = new Subject<Products[]>();
  emitproincart = new Subject<Products[]>();
  emitCat = new Subject<Category[]>();
  emitBoutique = new Subject<any[]>();
  Poids: Products[] = [];
  detailOrd: Orders;
  emitDetailord = new Subject<Orders>();
  emitPoids = new Subject<Products[]>();
  emitCart = new Subject<{ total: any, items: any }>();
  message = '';
  prod;
  prodsInCart: any[] = [];
  emitprolocal = new Subject<any[]>();
  private clients: Clients[] = [];
  emitClient = new Subject<Clients[]>();
  emitOrdres = new Subject<Orders[]>();
  private dataStuts: any;
  emitgereoreder = new Subject<any>();
  messageqty = '';
  // private host = 'http://138.68.79.202:3000/';
  private host = '';
  constructor(private Http: HttpClient, @Inject(DOCUMENT) private document: Document, private route: Router,private MatSnakbar: MatSnackBar) {
    if (document.location.hostname == 'localhost') {
      this.host = 'http://localhost:3000/';
    } else {
      this.host = 'https://www.herboshop.ma/herbo/';
    }
  }
  // excel data export
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  // Authentifications
  singup(fullname: string, email: string, password: string) {
    const admins: Admin = { fullname: fullname, email: email, password: password };
    this.Http.post<{ message: string, data: Admin[], err: any }>(this.host + 'api/sing_up', admins).subscribe(data => {
      // @ts-ignore
      if (!data.err) {
        // console.log(data.message, 'sing up hada', data.data);
        this.route.navigate(['/admin_auth']);
      } else {
        const message = 'email already exists';
      }
    });
  }
  // check admin login
  login(email: string, password: string) {
    const admin: Admin = { email: email, password: password };
    this.Http.post<{ message: string, data: Admin[], err: any }>(this.host + 'api/login_admin', admin).subscribe(data => {
      localStorage.setItem('full_name', data.data[0].fullname);
      this.route.navigate(['/dashboard/index']);
    });
  }


  // getall_image() {
  //   return this.Http.get<{err: any , data: any[]}>(this.host +'api/get_al_image');
  // }
  //
  // upimages(id, image) {
  //   const data = {
  //     id: id, image: image
  //   }
  //   return this.Http.put<{err: any, data: any}>(this.host +'api/upimages', data);
  // }
  // Authentifications
  // CRUD PRODUITS
  paginationsallpro(ProPerPage: number, page: number) {
    const query = `?limit=${ProPerPage}&page=${page}`;
    this.Http.get<{ message: string, products: any }>(this.host + 'fetch_product/pagination' + query)
      .pipe(map((produitdata) => {
        return {
          MyProduits: produitdata.products.map(produit => {
            return {
              id: produit.product_id,
              catid: produit.category_id,
              title: produit.title,
              titlearab: produit.title_arab,
              titleengalish: produit.title_eng,
              descreption: produit.descreption,
              Libele: produit.Libele,
              image: produit.image,
              price: produit.price,
              poids: produit.poids,
              pricea: produit.priceAchette,
              pricep: produit.pricePromo,
              quantity: produit.quantity,
              created_at: produit.created_at,
              state: produit.state,
              test_pro: produit.test_pro,
            };
          }),
          message: produitdata.message
        };
      })).subscribe(data => {
        this.ProPaginate = data.MyProduits;
        this.propaginat.next([...this.ProPaginate]);
      });

  }
  getProduct() {
    this.Http.get<{ message: string, products: any }>(this.host + 'fetch_product')
      .pipe(map((produitdata) => {
        return {
          MyProduits: produitdata.products.map(produit => {
            return {
              id: produit.product_id,
              catid: produit.category_id,
              title: produit.title,
              titlearab: produit.title_arab,
              titleengalish: produit.title_eng,
              descreption: produit.descreption,
              Libele: produit.Libele,
              image: produit.image,
              price: produit.price,
              poids: produit.poids,
              pricea: produit.priceAchette,
              pricep: produit.pricePromo,
              quantity: produit.quantity,
              created_at: produit.cregetsingleproated_at,
              state: produit.state,
              ciel: produit.Ciel,
              min: produit.min,
              test_pro: produit.test_pro
            };
          }),
          message: produitdata.message
        };
      })).subscribe(data => {
        this.Produits = data.MyProduits;
        this.emitdata.next([...this.Produits]);
      });

  }
  // getting the single product
  getsinglepro(id: string) {
    return this.Http.get(this.host + 'api/all_products/' + id);
  }
  // /api/all_products_forcart
  getsingleprocart(id: string, poids?: any) {
    return this.Http.get<{ message: string, data: any[] }>(this.host + 'api/all_products_forcart/' + id + '/'+ poids);
  }
  getsinglecat(id: string) {
    return this.Http.get
      <{ cat_id: number, titleFr: string, titleAng: string, titleArab: string, id_forni: string, image: File }>
      (this.host + 'api/get_category/' + id);
  }
  addproduct(catid: string, title: string, titlearab: string, titleengalish: string, descreption: string,
    image: File, pricev: string, pricea: string, pricep: string, poids: string, quantity: string, state: string, ciel: any, min: any, forni: any, testP: any) {
    const produitsData = new FormData();
    produitsData.append('catid', catid);
    produitsData.append('title', title);
    produitsData.append('titlearab', titlearab);
    produitsData.append('titleeng', titleengalish);
    produitsData.append('descreption', descreption);
    produitsData.append('image', image);
    produitsData.append('pricev', pricev);
    produitsData.append('pricea', pricea);
    produitsData.append('pricep', pricep);
    produitsData.append('poids', poids);
    produitsData.append('quantity', quantity);
    produitsData.append('state', state);
    produitsData.append('ciel', ciel);
    produitsData.append('min', min);
    produitsData.append('id_forni', forni);
    produitsData.append('test_pro', testP);
    this.Http.post<{ message: string, error: string }>(this.host + 'api/add_product', produitsData).subscribe(data => {
      const prodData: Products = {
        catid: catid,
        title: title,
        titlearab: titlearab,
        titleengalish: titleengalish,
        descreption: descreption,
        image: image,
        price: pricev,
        prixa: pricea,
        prixp: pricep,
        poids: poids,
        quantity: quantity,
        state: state,
        ciel: ciel,
        min: min,
        id_forni: forni,
        test_pro: testP
      };

      if (data.message) {
        this.route.navigate(['/dashboard/all_products']);
        this.MatSnakbar.open('le produits et bien ajouter', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });
      }
    });
  }
  // save multiple images
  addimages(proId: string, image: string) {
    const dataimage = new FormData();
    dataimage.append('proId', proId);
    dataimage.append('image', image);
    this.Http.post<{ message: string, error: string }>(this.host + 'api/multi_pectures', dataimage).subscribe(data => {
      // console.log('added successfully', data.message, "err", data.error);
      this.MatSnakbar.open('l\'image  et bien ajouter', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });

    });
  }
  // end save multiple images
  updateProducts(id: string, poidspro: any, catid: string, title: string, titlearab: string, titleengalish: string, descreption: string, image: File, pricev: string, pricea: string, pricep: string, poids: string, quantity: string, state: string, ciel: any, min: any, forni: any, testP: any) {
    const Produits = new FormData();
    Produits.append('id', id);
    Produits.append('poidspro', poidspro);
    Produits.append('catid', catid);
    Produits.append('title', title);
    Produits.append('titlearab', titlearab);
    Produits.append('titleandg', titleengalish);
    Produits.append('descreption', descreption);
    Produits.append('image', image);
    Produits.append('pricev', pricev);
    Produits.append('pricea', pricea);
    Produits.append('pricep', pricep?pricep:null);
    Produits.append('poids', poids);
    Produits.append('quantity', quantity);
    Produits.append('status', state);
    Produits.append('ciel', ciel?ciel:0);
    Produits.append('min', min?min:0);
    Produits.append('id_forni', forni);
    Produits.append('test_pro', testP);
    this.Http.put(this.host + 'api/updating_product/' + id, Produits).subscribe(data => {
      if (data) {
        this.route.navigate(['/dashboard/all_products']);
        this.MatSnakbar.open('le produits et bien modifier', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });
      }
    });
  }
  deletePro(proId: string, image: string) {
    this.Http.delete<{ message: string }>(this.host + 'api/delete_produit/' + proId + '/' + image).subscribe(data => {
      const updatedProduit = this.Produits.filter(prod => prod.id !== proId);
      this.Produits = updatedProduit;
      this.emitdata.next([...this.Produits]);
      this.message = 'your post deleted sussefully';
      this.MatSnakbar.open('le produits et bien supprimer', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });
    });
  }

  // manage poids
  addPoids(idpor: number, poids: string, pricev: number, pricea: number, pricep: number, qty) {
    const Poids: ManagePoids = {
      idpro: idpor,
      poids: poids,
      pricev: pricev,
      pricea: pricea,
      pricep: pricep,
      qtypoids: qty
    };
    this.Http.post<{ message: string, data: ManagePoids[] }>(this.host + 'api/add_poids', Poids).subscribe(data => {
      if (data.data) {
        this.MatSnakbar.open('le poids et bien ajouter', 'x', { panelClass: 'success', verticalPosition: 'bottom', duration: 2000 });

      }
    });
  }
  // end manage poids
  // new clients
  addClientrapide(fullname: string, adress: string, tele: number, ville: string,region: string, prix: number,prix2: number,fraisliv: number, prixG: number, prixS:any,) {
    const rapClient = {
      Full_name: fullname,
      adress: adress,
      telephone: tele,
      city: ville,
      region: region,
      prix: prix,
      prix2: prix2,
      fraislivraison: fraisliv,
      prixG:prixG,
      prixS: prixS
    };
    localStorage.setItem('client', JSON.stringify(rapClient));
    // return this.Http.post<{ data: any , err: any }>(this.host + 'api/rapide_client', rapClient);

  }
  addClient(fullname: string, emailc: string, adressc: string, paysc: string, villec: string, codep: number, tele: number) {
    const client: Clients = {
      Full_name: fullname,
      email: emailc,
      adress: adressc,
      pays: paysc,
      ville: villec,
      codepostal: codep,
      telephone: tele
    };
    if (client) {
      const infoCilent = {
        telephone: tele,
        email: emailc
      };
      localStorage.setItem('infoC', JSON.stringify(infoCilent));
    }
    return this.Http.post<{ message: string, clients: Clients }>(this.host + 'api/new_clients', client)
  }
  getclient(email: string, tele: string) {
    const data = {
      email: email,
      tele: tele
    };
    this.Http.post<{ message: string, clients: any }>(this.host + 'api/get_Client', data).
      pipe(map((dataC) => {
        return {
          ClientsData: dataC.clients.map(Clidata => {
            return {
              id_client: Clidata.id_client,
              email: Clidata.email,
              Full_name: Clidata.Full_Name,
              adress: Clidata.adress,
              pays: Clidata.pays,
              ville: Clidata.ville,
              codepostal: Clidata.codepostale,
              telephone: '0' + Clidata.telephone
            };
          })
        };
      }))
      .subscribe(datac => {
        this.clients = datac.ClientsData;
        this.emitClient.next([...this.clients]);
      });
  }
  getallclient() {
    this.Http.get<{ message: string, data: any[] }>(this.host + 'api/all_client')
      .pipe(map((Clientdata => {
        return {
          dataClient: Clientdata.data.map(data => {
            return {
              id_client: data.id_client,
              Full_name: data.Full_Name,
              email: data.email,
              adress: data.adress,
              pays: data.pays,
              ville: data.ville,
              codepostal: data.codepostale,
              telephone: data.telephone,
              created_at: data.created_at
            };
          })
        };
      })))
      .subscribe(data => {
        this.clients = data.dataClient;
        this.emitClient.next([...this.clients]);
      });
  }
  // ajouter Orders
  getdetailord(id: number) {
    return this.Http.get<{results: any[]}>(this.host + 'api/order_detail/' + id);
  }
  adddetailorders(id_orders: any,idpro: number, telephone:number, qty:number, poids: number, total: number, totalachat: number){
    const detail={
      id_orders: id_orders,
      id: idpro,
      telephone: telephone,
      qty: qty,
      poids: poids,
      totale: total,
      totala: totalachat
    };
    this.Http.post<{data:any, err: any}>(this.host + 'api/addorddetail', detail).subscribe(data=> {


      console.log(data.err, data.data);
  });
}
  AddOrder(id_orders,tele: number, count: number, nom: string, adress: string, ville: string , regions: string, prixL: string,
           total: number, totalprixachats: number, lamarge: number,charge_livrason: number, codeCMD: string, frais_levrison: number) {

    var panier1 = []; panier1 = JSON.parse(localStorage.getItem('panier'));
    var panier = panier1.filter(key => key.qtyPanier != 0 && key.qtyPanier > 0);
    console.log(panier);
    const Orders = {
      id_orders:id_orders,
      tele: tele,
      count: count,
      nom: nom,
      adress: adress,
      ville: ville,
      region: regions,
      prixL: +prixL,
      total: total,
      toprixachats: totalprixachats,
      lamarge: lamarge,
      charge_livraison: charge_livrason,
      frais_levrison: frais_levrison,
      codecmd: codeCMD,
      produits: panier
    };
    // console.log(Orders);
    return this.Http.post<{err: any, data: any}>(this.host + 'api/add_orders', Orders);
  }
  // get All ordres
  getpoideditOrders(id: number) {
    return this.Http.get<{ data: any }>(this.host + 'api/edit_Orders/' + id);
  }
  deletesubcom(id: number, id2: number, prix: number,qty: number,poids: number,prixa: number){
    const myids= {
      id: id,
      id2: id2,
    };
   return this.Http.delete<{err:any, data: any}>(this.host + 'api/deletesubcommande/' + id +'/' + id2+'/'+ prix + '/' + prixa);
  }

  updateOrdrers(id?: number, poids?: string, poidschange?: string, poidprice?: number, price?: number, qte?: number) {
    const data = {
      ido: id,
      poid: poids,
      poidchange: poidschange,
      priceo: price,
      poidsprice: poidprice,
      qtec: qte
    };
    this.Http.post<{ message: string }>(this.host + 'api/update_orders', data).subscribe(mydata => {
    });
  }
  getAllOrders() {
    this.Http.get<{ message: string, data: any[] }>(this.host + 'api/all_Orders')
      .pipe(map((dataOrder) => {
        return {
          dataOr: dataOrder.data.map(myOrders => {
            return {
              id: myOrders.id_orders,
              id_clients: myOrders.id_client,
              id_produits: myOrders.product_id,
              email: myOrders.email,
              clientfulname: myOrders.Full_name,
              teleclient: '0' + myOrders.telephone,
              adress: myOrders.adress,
              ville: myOrders.Ville,
              regions: myOrders.regions,
              prixLevrison: myOrders.prixLevrison,
              total_whit_prix_livreson: myOrders.total_whit_prix_livreson,
              total_whitout_prix_levrison: myOrders.total_whitout_prix_levrison,
              CodeLiveraison: myOrders.CodeLivraison,
              frais_levrison: myOrders.frais_levrison,
              Admin: myOrders.Admin,
              agent_cmd: myOrders.agent_cmd,
              agent_livraison: myOrders.agent_livraison,
              livreur: myOrders.livreur,
              count_pro: myOrders.count_pro,
              valuestatus: myOrders.valueStatus,
              status: myOrders.status,
              affstatus: myOrders.textstatus,
              created_at: myOrders.created_atord,
              CodeCMD: myOrders.CodeCMD,
              cmddate:myOrders.datecmd
            };
          })
        };
      }))
      .subscribe(data => {
        this.Orders = data.dataOr;
        this.emitOrdres.next([...this.Orders]);
      });
  }
  // gereOrderr
  gereOrders(id: number, status: string, valStatus: number, affchstatus: string, idP?: number, idC?: number) {
    const data = {
      statusOrdres: status,
      valstatus: valStatus,
      affstatus: affchstatus,
      idO: id
    };
    return this.Http.post<{ message: string }>(this.host + 'api/gere_Orders', data);
  }
  // END CRUD PRODUITS
  // CRUD CATEGORY
  getCategories() {
    this.Http.get<{ message: string, CatData: any }>(this.host + 'api/all_category')
      .pipe(map((pdata) => {
        return {
          categoris: pdata.CatData.map(produit => {
            return {
              id: produit.cat_id,
              id_boutique: produit.id_boutique,
              proid: produit.product_id,
              titlefr: produit.titleFr,
              titleAng: produit.titleAng,
              titlearab: produit.titleArab,
              image: produit.imagecat,
              created: produit.published_at
            };
          }),
          message: pdata.message
        };
      })).subscribe(data => {
        this.Category = data.categoris;
        this.emitCat.next([...this.Category]);
      });
  }
  getBoutique() {
    this.Http.get<{ message: string, CatData: any }>(this.host + 'api/all_boutique')
      .pipe(map((pdata) => {
        return {
          boutique: pdata.CatData.map(produit => {
            return {
              id_boutique: produit.id_boutique,
              nomFr: produit.nomFr,
              nomAr: produit.nomAr,
              nomAng: produit.nomAng,
              imageboutique: produit.imageboutique,
              created: produit.created_at
            };
          }),
          message: pdata.message
        };
      })).subscribe(data => {
        this.Boutique = data.boutique;
        this.emitBoutique.next([...this.Boutique]);
      });
  }
  // END CRUD CATEGORY
  // delete category
  deletecat(id: string) {
    this.Http.delete<{ message: string }>(this.host + 'api/delete_cat/' + id).subscribe(data => {
      // console.log('your cat deleted ', data.message);
      const updatedCat = this.Category.filter(cat => cat.id !== id);
      this.Category = updatedCat;
      this.emitCat.next([...this.Category]);
    });
  }

  getNewProduct() {
    this.Http.get<{ message: string, data: any }>(this.host + 'api/site/new_products')
      .pipe(map((productData) => {
        return {
          Produit: productData.data.map(proData => {
            return {
              id: proData.product_id,
              title: proData.title,
              titlearab: proData.title_arab,
              descreption: proData.descreption,
              image: proData.image,
              price: proData.price,
              poids: proData.poids,
              pricea: proData.priceAchette,
              pricep: proData.pricePromo,
              quantity: proData.quantity,
              state: proData.state
            };
          }),
          message: productData.message
        };
      }))
      .subscribe(data => {
        this.Produits = data.Produit;
        this.emitdatanewpro.next([...this.Produits]);
        // console.log('this the new produits in 7 dyas left', data);
      });
  }
  gettingpoids(id: string) {
    this.Http.get<{ message: string, data: any }>(this.host + 'api/products_gl/' + id)
      .pipe(map((datapro) => {
        return {
          poids: datapro.data.map(poidsdata => {
            return {
              id: poidsdata.id_manage_gramage,
              idpro: poidsdata.product_id,
              gramage: poidsdata.gramage,
              litres: poidsdata.literage,
              image: poidsdata.image,
              pricepoids: poidsdata.pricepoids,
              prixa: poidsdata.prixAchats,
              prixp: poidsdata.prixPromo,
              qtypoids: poidsdata.qtypoids,
              price: poidsdata.price,
              quantity: poidsdata.quantity,
              title: poidsdata.title,
              titlearab: poidsdata.title_arab,
              titleengalish: poidsdata.title_eng,
              poids: poidsdata.poids
            };
          }),
          message: datapro.message
        };
      }))
      .subscribe(data => {
        this.Poids = data.poids;
        this.emitPoids.next([...this.Poids]);
        // console.log(data.message, 'this data with poids', this.Poids);
      });
  }
  fetchpoids(key: string, id: string) {
    const datamy = {
      poids: key,
      proId: id
    };
    return this.Http.post
      (this.host + 'api/fetchpoids', datamy);
  }
  getipadress() {
    return this.Http.get(this.host + 'api/ipaadress');
  }
  addtoocart(id: string,poids?, poidprice?: any, poidschange?: any, pricep?: any, qty?: any) {
    this.getsingleprocart(id,poids)
      .subscribe(
        (result) => {
          this.prod = result.data[0];
          console.log(this.prod);
          this.prod.qtyPanier = 1;
          this.prod.restqty = 1;
          this.prod.perpoidsqty = 1;
          // this.prod.quantity = this.prod.quantity - 1;mm
          // this.prod.qtypoids = this.prod.qtypoids - 1;mm
          if (id == this.prod.product_id && this.prod.poids != poidprice && this.prod.pricepoids != poidschange ) {
            if (this.prod.prixPromo != null && this.prod.prixPromo != pricep) {
              this.prod.pricepoids = this.prod.prixPromo;
            } else {
              this.prod.pricepoids = poidprice;
            }
            if (poidprice != null && poidschange != null && qty != null) {
              this.prod.poids = poidprice;
              this.prod.qtypoids = qty;
              // this.prod.qtypoids = this.prod.qtypoids - 1;mm
              if (pricep != null) {
                this.prod.prixPromo = pricep;
                this.prod.pricepoids = pricep;
              } else if (pricep != null && this.prod.prixPromo != null) {
                this.prod.prixPromo = this.prod.prixPromo;
                this.prod.pricepoids = this.prod.prixPromo;
              } else {
                this.prod.pricepoids = poidschange;
                this.prod.prixPromo = null;
              }
            }
          } else if (id == this.prod.product_id) {
            if (this.prod.prixPromo != null && pricep !== null) {
              this.prod.pricepoids = pricep;
            }
          }
          var prods = JSON.parse(localStorage.getItem('panier'));
          if (prods == null) {
            prods = [];
          }
          let found = false;
          for (let i = 0; i < prods.length; i++) {

            if (id == prods[i].product_id && prods[i].poids != poidprice && prods[i].pricepoids != poidschange && prods[i].qtypoids != qty && prods[i].prixPromo != pricep) {
            }

            if (id == prods[i].product_id) {
              if (prods[i].poids == this.prod.poids) {
                prods[i].qtyPanier++;
                // prods[i].qtypoids--;mm
                prods[i].restqty++;
                prods[i].perpoidsqty++;
                found = true;
                break
              }
              if (prods[i].poids != poidprice) {
                prods[i].qtyPanier++;
                // prods[i].qtypoids--;mm
                prods[i].restqty++;
                prods[i].perpoidsqty++;
                found = false;
              } else if (prods[i].poids == poidprice) {
                prods[i].qtyPanier++;
                // prods[i].qtypoids--;mm
                prods[i].restqty++;
                prods[i].perpoidsqty++;
                found = true;
                break;
              }
            }
          }
          if (!found) {
            prods.push(this.prod);
          }

          localStorage.setItem('panier', JSON.stringify(prods));
          this.gettotaleitem();
          this.getitemincart();
          const data = JSON.parse(localStorage.getItem('pamier'));
        }
      );
  }


  removeproincart(id: string, poids) {
    const data = JSON.parse(localStorage.getItem('panier'));
    const updatedProduit = data.filter((prod) => {
      // console.log('kkkkk',prod.poids, prod.product_id);
      return (prod.product_id != id || prod.poids != poids);
    });
    this.prodsInCart = updatedProduit;
    localStorage.setItem('panier', JSON.stringify(this.prodsInCart));
    this.emitprolocal.next([...this.prodsInCart]);

    this.message = 'your post deleted sussefully';
  }
  gettotaleitem() {
    let total = 0;
    let sum = 0;
    let finaltotal = 0;
    const data = JSON.parse(localStorage.getItem('panier'));
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const price: any = data[i].pricepoids;
        const qte: any = data[i].qtyPanier;
        total = price * qte;

        sum += total;
        finaltotal = sum;
      }
    }
    if (data) {
      this.emitCart.next({ total: data.length, items: finaltotal });
    }
  }
  gettingDetailProducts(id: string) {
    return this.Http.get<{ message: string, data: any[] }>(this.host + 'api/dtaippoidsproduct/' + id);
  }
  gettingallproforsingleprodetail(catid: number, proId: string) {
    const data = {
      catId: catid,
      proid: proId
    }
    return this.Http.post<{ message: string, data: any[] }>(this.host + 'api/allcatdetpoi', data);
  }
  getitemincart() {
    const data = JSON.parse(localStorage.getItem('panier'));
    this.cartPro = data;
    this.emitproincart.next([...this.cartPro]);
  }
  getiteminlocatlstorage() {
    var data1 = []; data1 = JSON.parse(localStorage.getItem('panier'));
    const data = data1.filter(key => key.qtyPanier != 0 && key.qtyPanier > 0);
    return data;
  }
  getProductsParCategory(id: string) {
    return this.Http.get<{ results: any }>(this.host + 'api/cat_produits_all/' + id);
  }
  // get images products
  getImagePro(id: string) {
    return this.Http.get<{ message: string, data: any[] }>(this.host + 'api/product_images/' + id);
  }

  updatingqtafterdelete(id, qty, poids) {
    const mydata = {
      id: id,
      qtyperpoids: qty,
      poids: (poids).trim()
    };
     return this.Http.post<{err: any, data: any}>(this.host + 'api/increase', mydata);

  }
  // getting qty
  updateqty_after_delete(id,qty,poids) {
    const data = {
      id:id,
      qty: qty,
      poids: poids
    }
    return this.Http.post<{err: any, data: any}>(this.host + 'api/qty__update', data);
  }
  getmyqty() {
    return this.Http.get<{ qty: any }>(this.host + 'api/getqty');
  }
  emitcategory() {
    return this.emitCat.asObservable();
  }
  emitDatapro() {
    return this.emitdata.asObservable();
  }
  emitbobotique() {
    return this.emitBoutique.asObservable();
  }
  // emitgramagepro() {
  //   return this.emitgramage.asObservable();
  // }
  emitPoidspro() {
    return this.emitPoids.asObservable();
  }
  emitdatanew() {
    return this.emitdatanewpro.asObservable();
  }
  emitcart() {
    return this.emitCart.asObservable();
  }
  emititemincart() {
    return this.emitproincart.asObservable();
  }
  emitlocatstorage() {
    return this.emitprolocal.asObservable();
  }
  emitclientdata() {
    return this.emitClient.asObservable();
  }
  emitdataOrdres() {
    return this.emitOrdres.asObservable();
  }
  emitstatus() {
    return this.emitgereoreder.asObservable();
  }
  emitpaginat() {
    return this.propaginat.asObservable();
  }

  updateFraisLiv(fraisL: number,code: string, comm: string,charge, id_ord: number){
    const data = {
      frais_levrison: fraisL,
      CodeLivraison: code,
      Commentaire: comm,
      charge_commande: charge,
      id_orders: id_ord

    }
    return this.Http.put(this.host + 'api/update_fraisl', data);
  }
// get all from detail orders
  getdetail_orders() {
    return this.Http.get<{err: any , data: any[]}>(this.host + 'api/detail_oredrSdata');
  }
  save_fourni(nom) {
    const data = {
      nom
    };
    return this.Http.post<{err; any, data: any}>(this.host+'api/save_fornisseur', data);
  }
  get_all_fournisseur() {
   return  this.Http.get<{err: any, data: any[]}>(this.host + 'api/get_all_fournisseur');
  }
  delete_from_forni(id) {
    return this.Http.delete<{err: any, data: any}>(this.host + 'api/delete_from_fourni/' + id);
  }
  //getting recap orders
  getting_recap_orders(status, timer) {
    const data = {
      status: status,
      time: timer
    }
    return this.Http.post<{err: any, data: any[]}>(this.host + 'api/recap_commande_day', data);
  }
}
