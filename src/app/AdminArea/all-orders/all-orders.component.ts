import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Orders} from '../Models/orders';
import {ServicesService} from '../services/services.service';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {AuthservisesService} from '../authservises.service';
import * as jsPDF from 'jspdf';
import {LivServiceService} from '../genirate-livraiosn/liv-service.service';
import {Router} from '@angular/router';
import {AreaServiceService} from '../administrations/area-service.service';
import {Products} from '../Models/products';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
// h
export class AllOrdersComponent implements OnInit , OnDestroy {
  recapdata: any[] = [];
  Product:  any[] = [];
  islodingvide = false;
  idvide;
  checkifyouclickasinglecheckbox = false;
  showclotutee = 'Clôturée';
  recapfilter: any[] = [];
  regions: any[] = [];
  orders: Orders[] = [];
  Checktousreturndata = false;
  toutregsele = false;
ordersF: Orders[] = [];
ordersFall: Orders[] = [];
irdersSearch: Orders[] = [];
DetailOrd: any[] = [];
subs: Subscription;
statusAf: {status: string, val: number, statusbtn?: string}[] = [];
mystatus: {status: string, val: number, statusbtn?: string}[] = [];
idchecked = [];
  isloding = false;
  actiont = 'Traiter';
  valuebtn = 2;
  data: any;
  checkeddd = false;
  valuestat;
  status;
  checks = [];
  date = new Date().toISOString();
  datecode;
  subsreg: Subscription;
  allstatus = false;
  Filterstatus;
  showModules = false;
  nodelete = false;
  yesdelete = false;
  iddelete;
  showspenner = false;
  statuscheckall;
  valuesstatuscheckall;
  statusbtncheckall;
 mystatusforcheckall;
 valcheckall;
 btnstcheckall;
  myid;
  showmodulpdf;
  toutslescmd = false;
touscheck = false;
Quartier;
id_reg;
checkQuartie= false;
checkQuartie12= false;
keysersh;
keystatus;
keyregion;
allagentscmd: any[] = [];
allagentsLiv: any[] = [];
LesLivreurs: any[] = [];
biegindoexport = true;
choseagentcmd = false;
choseagentliv = false;
fullnameagentscmd;
roleagentcmd;
fullnameagentliv;
roleagentliv;
fullnamelivreurs;
rolelivreurs;
isloadingagenst = false;
showsuccsesscheck = false;
rolename;
orders2 :any[] = [];
showclow  = false;
check_if_vide_livraison = false;
detai_orders: any[] = [];
  // @ViewChild('content',{static: false}) content :ElementRef;
  constructor(private  serv: ServicesService, private sir: AuthservisesService,
              private servrecap: LivServiceService,private route: Router, private servarea: AreaServiceService) { }

  ngOnInit() {
    this.serv.getdetail_orders().subscribe(data => {
      this.detai_orders = data.data;
      console.log(this.detai_orders);
    })
    this.serv.getProduct();
    this.subs = this.serv.emitDatapro().subscribe((data: Products[] ) => {
      this.Product = data;
    });
    this.subsreg = this.servrecap.getallregions().subscribe(data => {this.regions = data.data});
    this.datecode = this.date.slice(0,7);
    console.log(this.datecode, this.date);
    this.mystatus = [{status:'Commandée', val: 0, statusbtn: 'Commandée'},
      {status:'En cours de traitement',val: 1, statusbtn: 'En cours de traitement'},
      {status:'Réserve',val: 10, statusbtn: 'Réserve'},
      {status:'Traitée',val: 8, statusbtn: 'Traitée'},
      {status:'Préparation de livraison',val: 9, statusbtn: 'Préparation de livraison'},
      {status:'Validée',val: 2, statusbtn: 'Validée'},
      {status:'En cours de livraison',val: 3, statusbtn: 'En cours de livraison'},
      {status:'Livrée',val: 3, statusbtn: 'Livrée'},
    {status:'Non Livrée',val: 10, statusbtn: 'Non Livrée'},
      {status:'Clôturée',val: 4, statusbtn: 'Clôturée'},{status:'Anullée', val: 5, statusbtn: 'Anullée'},{status:'Payée', val: 6, statusbtn: 'Payée'}];
    this.statusAf = [
      {status: 'Commander', val: 0, statusbtn: 'Commander'},
      { status: 'En cours de traitement', val: 1, statusbtn: 'Traiter' },
      { status: 'Traitée', val: 1, statusbtn: 'Traitée' },
      {status:'Réserve',val: 13, statusbtn: 'Réserve'},
      { status: 'Préparation de livraison', val: 9, statusbtn: 'Préparation de livraison' },
      {status: 'En cours de livraison', val: 3, statusbtn: 'En cours de livraison'},
      // {status: 'Valider', val: 2, statusbtn: 'Valider' },
      {status: 'Valider livraison', val:7 ,statusbtn:'Valider livraison'},
      {status:'Livrée',val: 3, statusbtn: 'Livrée'},
      {status:'Non Livrée',val: 10, statusbtn: 'Non Livrée'},
      {status: 'Payer', val: 6, statusbtn: 'Payer'},
      {status: 'Clôturer', val: 4, statusbtn: 'Clôturer' },
      {status: 'Anuller', val: 5, statusbtn: 'Anuller' },
    ];
    this.isloding = true;
    this.serv.getAllOrders();
    this.subs = this.serv.emitdataOrdres().subscribe(data => {
      this.orders = data.filter(key => key.status != 'Clôturée' && key.status != 'Anullée');
      this.ordersF = this.orders;
      this.irdersSearch = this.orders;
      this.ordersFall = this.orders;
      this.orders2 = data;
      this.isloding = false;
      for(const ord of this.orders) {
        this.checks.push(false);
      }
    });
    this.servrecap.getrecap().subscribe(data => {
      this.recapdata = data.data;
      console.log(data.data, this.recapdata);
    })
    const datamy = JSON.parse(sessionStorage.getItem('Admin'));
    if(datamy) {
      console.log(datamy[0].Full_name);
      this.rolename = datamy[0].Role;

      if (datamy[0].Role == 'super admin' || datamy[0].Role == 'admin' || datamy[0].Role == 'service clients'|| datamy[0].Role == 'Agent de Commandes') {
        return;
      } else {
        this.route.navigate(['/Authentifications']);
      }
    }else {
      this.route.navigate(['/Authentifications']);
    }
  }
  showall(){
    this.isloding = true;
    this.orders = this.ordersFall;
    this.ordersF = this.ordersFall;
    // this.serv.getAllOrders();
    //  this.serv.emitdataOrdres().subscribe(data => {
    //   this.orders = data;
    //   this.ordersF = this.orders;
    //   this.irdersSearch = this.orders;
    //   this.ordersFall = this.orders;
      this.isloding = false;
    // });

  }
  filterStatus(status, val, btnstate) {
    this.checkeddd = false;
    this.toutslescmd = false;
    this.touscheck = false;
    this.mystatusforcheckall = status;
    this.valcheckall = val;
    this.btnstcheckall = btnstate;
    this.keystatus = status;
    this.toutslescmd  = false;
    // this.showclotutee = '';
    var dataF;
    if(status !='' && this.keyregion != null ) {
       this.orders = this.ordersFall;
      this.ordersF = this.ordersFall;
       dataF = this.ordersF.filter(key => key.status == status && key.regions == this.keyregion);
      this.orders = dataF;
      this.ordersF= this.orders;
    }else if(status != '' && this.keyregion == null){
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall
      dataF = this.ordersF.filter(key => key.status == status);
      this.orders = dataF;
      this.ordersF= this.orders;
    }else if(status != '' && this.toutregsele == true){
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall
      dataF = this.ordersF.filter(key => key.status == status);
      this.orders = dataF;
      this.ordersF= this.orders;
    }else{
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall;
    }
    if(status == 'Clôturée') {
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall
      dataF = this.orders2.filter(key => key.status == 'Clôturée');
      this.orders = dataF;
      this.ordersF= this.orders;
    }
    console.log(status, this.orders, this.ordersFall);
  }
  selectstate(status: string , val: number , statusbtn?: string) {
    this.statuscheckall = status;
    this.statusbtncheckall = statusbtn;
    this.valuesstatuscheckall = val;

    for ( var i = 0 ; i < this.idchecked.length ; i++) {
      let idC = this.idchecked[i];
      if ( status == 'En cours de traitement' &&  val == 1 ) {
        val = 1;
        status = 'En cours de traitement';
        statusbtn = 'En cours de traitement';
        this.actiont = status;
      }  else if (status === 'Commander' &&  val === 0) {
        val = 0;
        status = 'Commandée';
        statusbtn = 'Commandée';
        this.actiont = status;
      }else if (status === 'Valider' &&  val === 2) {
        val = 2;
        status = 'Validée';
        statusbtn = 'Validée';
        this.actiont = status;
      } else if (status === 'Livrer' &&  val === 3 ) {
        val = 3;
        status = 'En cours de livraison';
        statusbtn = 'En cours de livraison';
        this.actiont = status;
      } else if (status === 'Clôturer' &&  val === 4 ) {
        val = 4;
        status = 'Clôturée';
        statusbtn = 'Clôturée';
        this.actiont = status;
      }else if (status === 'Anuller' &&  val === 5 ) {
        status = 'Anullée';
        statusbtn = 'Anullée';
        val = 5;
        this.actiont = status;
      }else if (status === 'Payer' &&  val === 6 ) {
        status = 'Payée';
        statusbtn = 'Payée';
        val = 6;
        this.actiont = status;
      }else if (status ==='Valider livraison' && val === 7){
        status = 'Livrée';
        statusbtn = 'Livrée';
        val = 7;
      }
      if(this.checkeddd == true && this.toutslescmd == false && this.touscheck == false){
        if ( status == 'En cours de traitement' &&  val == 1 ) {
          val = 1;
          status = 'En cours de traitement';
          statusbtn = 'En cours de traitement';
          this.actiont = status;
        }  else if (status === 'Commander' &&  val === 0) {
          val = 0;
          status = 'Commandée';
          statusbtn = 'Commandée';
          this.actiont = status;
        }else if (status === 'Valider' &&  val === 2) {
          val = 2;
          status = 'Validée';
          statusbtn = 'Validée';
          this.actiont = status;
        } else if (status === 'Livrer' &&  val === 3 ) {
          val = 3;
          status = 'En cours de livraison';
          statusbtn = 'En cours de livraison';
          this.actiont = status;
        } else if (status === 'Clôturer' &&  val === 4 ) {
          val = 4;
          status = 'Clôturée';
          statusbtn = 'Clôturée';
          this.actiont = status;
        }else if (status === 'Anuller' &&  val === 5 ) {
          status = 'Anullée';
          statusbtn = 'Anullée';
          val = 5;
          this.actiont = status;
        }else if (status === 'Payer' &&  val === 6 ) {
          status = 'Payée';
          statusbtn = 'Payée';
          val = 6;
          this.actiont = status;
        }else if (status ==='Valider livraison' && val === 7){
          status = 'Livrée';
          statusbtn = 'Livrée';
          val = 7;
        }
        this.servrecap.checkallstatus(status ,val,statusbtn,this.mystatusforcheckall).subscribe(data => {
          if(data.data== 'updated') {
              this.serv.getAllOrders();
              this.serv.emitdataOrdres().subscribe(data2 => {
              this.orders = data2;
              this.ordersF = this.orders;
              this.irdersSearch = this.orders;
              this.isloding = false;
              this.touscheck = false;
              this.checkQuartie12= false;
              this.checkQuartie = false;
              this.checkeddd = false;
              for(const ord of this.orders) {
                this.checks.push(false);
              }
            });
          }
        })
      }else if (this.checkQuartie12 == true && this.toutslescmd == false && this.touscheck == false && this.checkeddd == false){
        if ( status == 'En cours de traitement' &&  val == 1 ) {
          val = 1;
          status = 'En cours de traitement';
          statusbtn = 'En cours de traitement';
          this.actiont = status;
        }  else if (status === 'Commander' &&  val === 0) {
          val = 0;
          status = 'Commandée';
          statusbtn = 'Commandée';
          this.actiont = status;
        }else if (status === 'Valider' &&  val === 2) {
          val = 2;
          status = 'Validée';
          statusbtn = 'Validée';
          this.actiont = status;
        } else if (status === 'Livrer' &&  val === 3 ) {
          val = 3;
          status = 'En cours de livraison';
          statusbtn = 'En cours de livraison';
          this.actiont = status;
        } else if (status === 'Clôturer' &&  val === 4 ) {
          val = 4;
          status = 'Clôturée';
          statusbtn = 'Clôturée';
          this.actiont = status;
        }else if (status === 'Anuller' &&  val === 5 ) {
          status = 'Anullée';
          statusbtn = 'Anullée';
          val = 5;
          this.actiont = status;
        }else if (status === 'Payer' &&  val === 6 ) {
          status = 'Payée';
          statusbtn = 'Payée';
          val = 6;
          this.actiont = status;
        }else if (status ==='Valider livraison' && val === 7){
          status = 'Livrée';
          statusbtn = 'Livrée';
          val = 7;
        }
        this.servrecap.checkallstatusregion(status,val,statusbtn, this.Quartier).subscribe(data => {
          if(data.data== 'updated') {
            this.serv.getAllOrders();
            this.serv.emitdataOrdres().subscribe(data2 => {
              this.orders = data2;
              this.ordersF = this.orders;
              this.irdersSearch = this.orders;
              this.isloding = false;
              this.touscheck = false;
              this.checkQuartie12= false;
              this.checkQuartie = false;
              this.checkeddd = false;
              for(const ord of this.orders) {
                this.checks.push(false);
              }
            });
          }
        })
      }else if (this.toutslescmd == true && this.touscheck == true && this.checkeddd == false) {
        if ( status == 'En cours de traitement' &&  val == 1 ) {
          val = 1;
          status = 'En cours de traitement';
          statusbtn = 'En cours de traitement';
          this.actiont = status;
        }  else if (status === 'Commander' &&  val === 0) {
          val = 0;
          status = 'Commandée';
          statusbtn = 'Commandée';
          this.actiont = status;
        }else if (status === 'Valider' &&  val === 2) {
          val = 2;
          status = 'Validée';
          statusbtn = 'Validée';
          this.actiont = status;
        } else if (status === 'Livrer' &&  val === 3 ) {
          val = 3;
          status = 'En cours de livraison';
          statusbtn = 'En cours de livraison';
          this.actiont = status;
        } else if (status === 'Clôturer' &&  val === 4 ) {
          val = 4;
          status = 'Clôturée';
          statusbtn = 'Clôturée';
          this.actiont = status;
        }else if (status === 'Anuller' &&  val === 5 ) {
          status = 'Anullée';
          statusbtn = 'Anullée';
          val = 5;
          this.actiont = status;
        }else if (status === 'Payer' &&  val === 6 ) {
          status = 'Payée';
          statusbtn = 'Payée';
          val = 6;
          this.actiont = status;
        }else if (status ==='Valider livraison' && val === 7){
          status = 'Livrée';
          statusbtn = 'Livrée';
          val = 7;
        }
        this.servrecap.checkallstatustouts(status,val,statusbtn).subscribe(data => {
          if(data.data== 'updated') {
            this.serv.getAllOrders();
            this.serv.emitdataOrdres().subscribe(data2 => {
              this.orders = data2;
              this.ordersF = this.orders;
              this.irdersSearch = this.orders;
              this.isloding = false;
              this.touscheck = false;
              this.checkQuartie12= false;
              this.checkQuartie = false;
              this.checkeddd = false;
              for(const ord of this.orders) {
                this.checks.push(false);
              }
            });
          }
        })
      }

      const ind = this.orders.findIndex(element => element.id == idC);
      if( ind != -1) {
        this.orders[ind].status = statusbtn;
        this.orders[ind].valuestatus = val;
        this.orders[ind].affstatus = status;
        this.serv.gereOrders(idC, status, val, statusbtn).subscribe(data => {
          if(data.message) {
            this.touscheck = false;
            this.checkQuartie12= false;
            this.checkQuartie = false;
            this.checkeddd = false;
          }
        });
      }
    }

    if(this.Checktousreturndata == true) {
      for(var i = 0 ; i < this.orders.length; i++) {
        let ids = this.orders[i].id;
        console.log(ids);
        if ( status == 'En cours de traitement' &&  val == 1 ) {
          val = 1;
          status = 'En cours de traitement';
          statusbtn = 'En cours de traitement';
          this.actiont = status;
        }  else if (status === 'Commander' &&  val === 0) {
          val = 0;
          status = 'Commandée';
          statusbtn = 'Commandée';
          this.actiont = status;
        }else if (status === 'Valider' &&  val === 2) {
          val = 2;
          status = 'Validée';
          statusbtn = 'Validée';
          this.actiont = status;
        } else if (status === 'Livrer' &&  val === 3 ) {
          val = 3;
          status = 'En cours de livraison';
          statusbtn = 'En cours de livraison';
          this.actiont = status;
        } else if (status === 'Clôturer' &&  val === 4 ) {
          val = 4;
          status = 'Clôturée';
          statusbtn = 'Clôturée';
          this.actiont = status;
        }else if (status === 'Anuller' &&  val === 5 ) {
          status = 'Anullée';
          statusbtn = 'Anullée';
          val = 5;
          this.actiont = status;
        }else if (status === 'Payer' &&  val === 6 ) {
          status = 'Payée';
          statusbtn = 'Payée';
          val = 6;
          this.actiont = status;
        }else if (status ==='Valider livraison' && val === 7){
          status = 'Livrée';
          statusbtn = 'Livrée';
          val = 7;
        }
        this.serv.gereOrders(ids, status, val, statusbtn).subscribe(data => {
          if (data.message) {
            this.serv.getAllOrders();
            this.serv.emitdataOrdres().subscribe(data2 => {
              this.orders = data2;
              this.ordersF = this.orders;
              this.irdersSearch = this.orders;
              this.isloding = false;
              this.Checktousreturndata = false;
            });
          }
        });
      }
    }
    this.idchecked = [];
    for (let index = 0 ; index < this.checks.length ; index++) {
      this.checks[index] = false;
    }
    console.log(this.checks);
  }
  checkall(event){
    // if(this.checkQuartie == true) {
    //   this.checkQuartie12 = event.checked;
    // }else
    //
    // if(this.toutslescmd == true) {
    //   this.touscheck = event.checked;
    // }else{
    //   this.checkeddd = event.checked;
    // }
    this.idchecked = [];
    if(this.orders) {
      this.Checktousreturndata = !this.Checktousreturndata;
    }
    this.servarea.getAgentsCMD().subscribe(data => {
      this.allagentscmd = data.data;
      this.servarea.getAgentsLivraison().subscribe(data => {
        this.allagentsLiv = data.data;
        this.servarea.getLivreurs().subscribe(data => {
          this.LesLivreurs = data.data;
        })
      })
    });


    console.log(this.orders);
    //
    // console.log(this.statuscheckall, this.statusbtncheckall, this.valuesstatuscheckall, this.checkeddd);
}
  // subchecked(event, id){
  //   for(let ord of this.orders){
  //     if(ord.id == id) {
  //       console.log(ord.id);
  //       this.myid = id;
  //       this.checksubCMDvar = false;
  //     }
  //   }
  //   console.log(this.checksubCMDvar, event.checked , id);
  //
  // }
//   checkmystatusforcheckall(status, val, btnstate){
//     this.checkeddd = false;
//     this.toutslescmd = false;
//     this.touscheck = false;
//     this.mystatusforcheckall = status;
//     this.valcheckall = val;
//     this.btnstcheckall = btnstate;
// }
  check(event , idM: number , stutas?: string) {
    // console.log(event.checked, idM , stutas);
    // setTimeout(() => {
    //   event.checked = false;
    // } , 1000);
    if (event.checked == true) {
      this.servarea.getAgentsCMD().subscribe(data => {
        this.allagentscmd = data.data;
        this.servarea.getAgentsLivraison().subscribe(data => {
          this.allagentsLiv = data.data;
          this.servarea.getLivreurs().subscribe(data => {
            this.LesLivreurs = data.data;
          })
        })
      });
        this.idchecked.push(idM);
        this.checkifyouclickasinglecheckbox = false;
    } else {
      this.idchecked = this.idchecked.filter(idF => idF != idM);
    };
  }
  gereorder(id: number , affstuts: string , valstatus: number , status: string) {
    if ( status === 'Traiter' &&  valstatus === 1 && affstuts === 'commandé') {
      valstatus = 2;
      affstuts = 'En cours de traitement';
      status = 'Validé';
    } else if (status === 'Validé' &&  valstatus === 2 && affstuts === 'En cours de traitement') {
      valstatus = 3;
      affstuts = 'Validé';
      status = 'Livrer';
      this.actiont = status;
    } else if (status === 'Livrer' &&  valstatus === 3 && affstuts === 'Validé') {
      valstatus = 4;
      affstuts = 'En cours de livraison';
      status = 'Cloturé';
      this.actiont = status;
    } else if (status === 'Cloturé' && valstatus === 4 && affstuts === 'En cours de livraison') {
      status = 'Ferme';
      affstuts = 'Cloturé';
      valstatus = 5;
    }
    // const indord = this.orders.findIndex(elementord => elementord.id == id);
    // // console.log('hahhaha', this.orders[ind].status = 'valide');
    // this.orders[indord].status = status;
    // this.orders[indord].valuestatus = valstatus;
    // this.orders[indord].affstatus = affstuts;
    // this.serv.gereOrders(id , affstuts , valstatus , status);
    const ind = this.orders.findIndex(element => element.id == id);
    this.orders[ind].status = status;
    this.orders[ind].valuestatus = valstatus;
    this.orders[ind].affstatus = affstuts;
    this.serv.gereOrders(id , affstuts , valstatus , status);
  }

  search(event) {
    this.keysersh = event.target.value;
    // this.showclotutee = '';
    console.log(event.target.value);
    if (event.target.value !== '') {
      const searchdata = this.orders2.filter(key => key.status.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase())
         || key.CodeCMD.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase())||key.clientfulname.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase())
        || key.adress.trim().toLocaleLowerCase().match(event.target.value.trim().toLocaleLowerCase()) || key.teleclient.toString().toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()))
        ;
      this.isloding = true;
      this.orders = searchdata;
      // this.servicescat.emitCat.next([...this.Category]);
      this.isloding = false;
    } else if (event.target.value === '') {
      // this.showclotutee = 'Clôturée';
      this.ngOnInit();
    }
  }
  // valide deleted
  nosur() {
    this.showModules = false;
    this.nodelete = true;
    setTimeout(()=>{this.nodelete = false;
    this.islodingvide = false;
    },500);
  }
  yeshesur() {
    if(this.yesdelete == true && this.check_if_vide_livraison == false) {
      this.check_if_vide_livraison = false;
      this.showspenner = true;
        const data = this.ordersF.filter(key => key.id != this.iddelete);
        this.orders = data;
        this.ordersF = this.orders;
        console.log(this.iddelete);
        this.sir.deleteord(this.iddelete).subscribe(data => {
          if(data.data) {
            this.serv.getAllOrders();
            this.subs = this.serv.emitdataOrdres().subscribe(data => {
              this.orders = data.filter(key => key.status != 'Clôturée' && key.status != 'Anullée');
              this.ordersF = this.orders;
              this.irdersSearch = this.orders;
              this.isloding = false;
              this.yesdelete = false;
              setTimeout(()=>{this.showModules = false;this.yesdelete = false;this.showspenner = false;},1000);

            });
          }
        })
      } else if( this.yesdelete == false && this.check_if_vide_livraison == true) {
      this.servarea.vidercashe(this.idvide).subscribe(data => {
        this.showspenner = true;
        this.yesdelete = false;
        if(data.data == 'vide'){
          this.islodingvide = false;
          this.serv.getAllOrders();
          this.subs = this.serv.emitdataOrdres().subscribe(data => {
            this.orders = data.filter(key => key.status != 'Clôturée' && key.status != 'Anullée');
            this.ordersF = this.orders;
            this.irdersSearch = this.orders;
            this.islodingvide = false;
            this.check_if_vide_livraison = false;
            setTimeout(()=>{this.showModules = false;this.showspenner = false;},1000);
          });
        }
      })
    }

  }
  vidercash(id){
    this.showModules = true;
    this.check_if_vide_livraison = true;
    this.islodingvide = true;
    this.idvide = id;
    this.showspenner = false;
  }
  delete(id){
    this.yesdelete = true;
    this.showspenner = false;
    this.showModules = true;
    this.iddelete = id;

  }
  exportAsXLSX(): void {
    this.serv.exportAsExcelFile(this.Product, 'Commande' + new Date());
  }
  // pdf(id) {
  //   this.showmodulpdf = true;
  //   this.serv.getdetailord(id).subscribe(data=> {
  //     this.DetailOrd = data.results;
  //     console.log(data.results, this.DetailOrd);
  //   })
  //   setTimeout(()=>{this.showmodulpdf = false;},50000)
  // }
  // formatpdf(){
  //   var doc = new jsPDF();
  //   let specialelementHandlers = {
  //        '#editor': function(element,renderer) {
  //          return true;
  //        }
  //   };
  //   let content = this.content.nativeElement;
  //   doc.fromHTML(content.innerHTML,15,15,{
  //     'width':190,
  //     'elementHandlers': specialelementHandlers
  //   });
  //   doc.save('test.pdf');
  // }
  // // exportAsPDF(){
  // //   var doc = new jsPDF();
  // //   this.orders.forEach(function(employee, i){
  // //     doc.text(10, 5 + (i * 10),
  // //       "First Name: " + employee.CodeCMD +
  // //       "Last Name: " + employee.total_whit_prix_livreson);
  // //   });
  // //   doc.save('Test.pdf');
  // // }
  detail(id: number) {}
  showme(){
    console.log(this.recapdata.length)
    for (let pro of this.recapdata) {
      // console.log(pro.id_product, pro.title_arab, this.recapdata.length);
    }
  }
  checkmyregions(id_region,regions,value){
    this.toutregsele = false;
    this.keyregion = regions;
    this.checkeddd = false;
    this.touscheck = false;
    this.id_reg = id_region;
    this.Quartier = regions;
    this.checkQuartie = true;
    var data;
    if(this.keystatus !=  null && regions != null){
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall
      data = this.ordersF.filter(key => key.regions == regions && key.status == this.keystatus);
      this.orders = data;
      this.ordersF = this.orders;
    }else if(this.keystatus == null && regions != null){
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall
      data = this.ordersF.filter(key => key.regions == regions);
      this.orders = data;
      this.ordersF = this.orders;
    }else if(this.toutslescmd == true && regions !=null){
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall
      data = this.ordersF.filter(key => key.regions == regions);
      this.orders = data;
      this.ordersF = this.orders;
    }else {

      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall
    }
    console.log(status, this.orders, this.ordersFall);
  }
  toutsreg(){
    this.toutregsele = true;
    this.keyregion = null;
    this.isloding = true;
    var data;
    console.log(this.keystatus);
    if(this.keystatus &&  this.toutregsele == true) {
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall
      data = this.ordersF.filter(key => key.status == this.keystatus);
      this.orders = data;
      this.ordersF = this.orders;
    }else if(this.keystatus == '' && this.toutregsele == true){
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall;
    }else if(this.toutslescmd == true && this.toutregsele == true) {
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall;
    }else if(this.toutregsele == true){
      this.orders = this.ordersFall;
      this.ordersF = this.ordersFall;
    }
    // this.orders = this.ordersFall;
    // this.ordersF = this.ordersFall;
    this.isloding = false;
  }
  getaalll(){
    this.serv.getAllOrders();
    this.subs = this.serv.emitdataOrdres().subscribe(data => {
      this.orders = data;
      this.ordersF = this.orders;
      this.irdersSearch = this.orders;
      this.isloding = false;
      for(const ord of this.orders) {
        this.checks.push(false);
      }
    });
  }
  agentcmdchose(role, name) {
    this.choseagentcmd = true;
    if(this.choseagentcmd == true || this.choseagentliv == true) {
      this.biegindoexport = false;
    }
    this.fullnameagentscmd = name;
    this.roleagentcmd = role;
  }
  agentLivchose(role, name) {
    this.choseagentliv = true;
    if(this.choseagentcmd == true || this.choseagentliv == true) {
      this.biegindoexport = false;
    }
    this.fullnameagentliv = name;
    this.roleagentliv = role;
  }
  Livreurschose(role, name) {
    this.fullnamelivreurs = name;
    this.rolelivreurs = role;
    this.biegindoexport = false;
  }

  validerAgnetsTraitemen() {
    this.isloadingagenst = true;
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    const admin = data[0].Full_name;
    if(this.idchecked.length == 0) {
      for (let i = 0; i < this.orders.length; i++) {
        this.servarea.validertraitemtagents(this.orders[i].id, admin, this.fullnameagentscmd?this.fullnameagentscmd:null, this.fullnameagentliv?this.fullnameagentliv:null, this.fullnamelivreurs?this.fullnamelivreurs:null).subscribe(data => {
          if (data.data == 'done') {
            console.log('done');
            setTimeout(() => {
              this.isloadingagenst = false;
              this.showsuccsesscheck = true;
              // this.Checktousreturndata = false;
            }, 2000);
            setTimeout(() => {
              this.showsuccsesscheck = false;
              this.Checktousreturndata = false;
            }, 5000);
          }
        })
      }
    }else if(this.idchecked.length !=0) {
      for (let i = 0; i < this.idchecked.length; i++) {
        this.servarea.validertraitemtagents(this.idchecked[i], admin, this.fullnameagentscmd?this.fullnameagentscmd:null, this.fullnameagentliv?this.fullnameagentliv:null, this.fullnamelivreurs?this.fullnamelivreurs:null).subscribe(data => {
          if (data.data == 'done') {
            console.log('done');
            setTimeout(() => {
              this.isloadingagenst = false;
              this.showsuccsesscheck = true;
            }, 2000);
            setTimeout(() => {
              this.showsuccsesscheck = false;
              this.Checktousreturndata = false;
              this.idchecked = [];
              for (let index = 0 ; index < this.checks.length ; index++) {
                this.checks[index] = false;
              }
              console.log(this.checks);
            }, 5000);
          }
        })
      }
    }
  }
ngOnDestroy(): void {
    if(this.subsreg && this.subs){
      this.subs.unsubscribe();
      this.subsreg.unsubscribe();
    }

 }
}
