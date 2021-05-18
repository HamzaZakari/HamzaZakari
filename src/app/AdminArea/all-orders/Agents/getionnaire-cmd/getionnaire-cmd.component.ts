import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AreaServiceService} from '../../../administrations/area-service.service';
import {ServicesService} from '../../../services/services.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-getionnaire-cmd',
  templateUrl: './getionnaire-cmd.component.html',
  styleUrls: ['./getionnaire-cmd.component.css']
})
export class GetionnaireCMDComponent implements OnInit {
  role;
  checkradiovalue = 0;
  full_name;
  orders: any[] = [];
  ordersF: any[] = [];
  ordersFd: any[] = [];
  LesLivreurs: any[] = [];
  lesagentsLivraison: any[] = [];
  isloading =  false;
  isloading2 =  false;
  isloading3 =  false;
  isloading4 = false;
  isloading5 = false;
  isloading6 = false;
  isloading7 = false;
  isloading8 = false;
  fullspinner = false;
  id1;id2;id3;id4;id5;id6;id7;id8;
  statusAf: {status: string, val: number}[] = [];
  dated;
  livreurname;
  agentlivname;
  livreurcheck = false;
  agentlivreurcheck = false;
messageafterdate = false;
showselect_liv = false;
showselect_livreurs = false;
mystatus;
livreurnames;
  constructor(private route: Router, private serv: AreaServiceService, private servss: ServicesService) { }

  ngOnInit(): void {
    this.statusAf = [
      {status: 'Commandée', val: 0},
      {status: 'en cours de traitement', val: 1},
      {status: 'Traitée', val: 8},
      {status: 'Validée', val: 2 },
      {status: 'Réserve', val: 10},
      {status: 'préparation de livraison', val: 9 },
      {status: 'en cours de livraison', val: 3},
      {status: 'Livrée', val:7 },
      {status: 'Non Livrée', val:7 },
      {status: 'payée', val: 6},
      {status: 'Clôturer', val: 4},
      {status: 'Anuller', val: 5 },
    ];
    const data  = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      if(data[0].Role != 'Agent de Commandes' && data[0].Role !='Agent de livraisons' && data[0].Role !='Livreurs')
      {
        this.route.navigate(['/Authentifications']);
      }else {
        this.fullspinner = true;
        this.role = data[0].Role;
        this.full_name = data[0].Full_name;
        if(data[0].Role == 'Agent de Commandes') {
          const ststus = 'Commandée';
          this.serv.getting_orders_altravers_le_role(this.full_name, ststus).subscribe(data=> {
            this.orders = data.data;
            console.log(this.orders);
            this.ordersF = this.orders;
            this.ordersFd = this.orders;
            this.fullspinner = false;
            console.log(this.orders);
              this.serv.getAgentsLivraison().subscribe(data => {
                this.lesagentsLivraison = data.data;
              })
          })
        }else if (data[0].Role == 'Agent de livraisons') {
          const ststus = 'préparation de livraison';
          this.serv.getting_orders_altravers_le_role_agentlivr(this.full_name, ststus).subscribe(data=> {
            this.orders = data.data;
            this.ordersF = this.orders;
            this.ordersFd = this.orders;
            this.fullspinner = false;
            this.serv.getLivreurs().subscribe(data => {
              this.LesLivreurs = data.data;
            })
          })
        }else if (data[0].Role == 'Livreurs') {
          const ststus = 'en cours de livraison';
          this.serv.getting_orders_altravers_le_role_livreurs(this.full_name, ststus).subscribe(data=> {
            this.orders = data.data;
            this.ordersF = this.orders;
            this.ordersFd = this.orders;
            this.fullspinner = false;

          })
        }

      }
    }else {
      this.route.navigate(['/Authentifications']);
    }
  }
  traiter(id_orders){
    this.id1 = id_orders;
    this.isloading = true;
    const status = 'en cours de traitement';
    console.log(id_orders, status);
    this.serv.ecourdetraitement(id_orders, status).subscribe(data => {
      if(data.data == 'traiter') {
        setTimeout(()=>{
         this.gettingdata();
         this.isloading = false;
        },2000);
      }
    })
  }
  Traite(id_orders){
    this.id2 = id_orders;
    this.isloading2 = true;
    const  status = 'Traitée';
    this.serv.validerTaraitement(id_orders, status).subscribe(data => {
      if(data.data == 'traitée') {
        setTimeout(()=>{
          this.gettingdata();
          this.isloading2 = false;
        },2000);
      }
    })
}
  reverse(id_orders) {
    this.isloading7 = true;
    this.id7 = id_orders;
    const status ='Réserve';
    this.serv.reversecmd(id_orders, status).subscribe(data =>  {
      if(data.data == 'Reversé') {
        setTimeout(()=>{
          this.gettingdata();
          this.isloading7 = false;
        },2000);
      }
    })
}
  preparation(id_orders) {
    this.serv.checkagent_liv(id_orders).subscribe(data => {
      // alert(1);
      console.log(data.data);
      if(data.data[0].agent_livraison == 'NULL' || data.data[0].agent_livraison == 'null' || data.data[0].agent_livraison == null) {
        // alert(2);
       console.log(data.data);
        this.showselect_liv = true;
        if(this.agentlivreurcheck == true) {
          // alert(3);
          this.id3 = id_orders;
          this.isloading3 = true;
          const status = 'préparation de livraison';
          this.serv.pareparationdelivraison(id_orders, status, this.agentlivname).subscribe(data =>  {
            if(data.data == 'preparation_de_livraison') {
              setTimeout(()=>{
                this.gettingdata();
                this.isloading3 = false;
                this.showselect_liv = false;
                this.agentlivreurcheck = false;
              },2000);
            }
          })
        }else{
          // alert(4);
          this.showselect_liv = true;
          alert('vous devez sélectionner un agents de livraison pour ce commande');
        }
      }else {
        // alert(5);
        this.id3 = id_orders;
        this.isloading3 = true;
        const status = 'préparation de livraison';
        this.serv.pareparationdelivraison(id_orders, status, null).subscribe(data =>  {
          if(data.data == 'preparation_de_livraison') {
            setTimeout(()=>{
              this.gettingdata();
              this.isloading3 = false;
            },2000);
          }
        })
      }
    })

}

encoursdelivraison(id) {
    this.serv.checkiflivreur(id).subscribe(data => {
      console.log(data.data);
      if(data.data[0].livreur == 'NULL' || data.data[0].livreur == 'null' || data.data[0].livreur == null) {
        this.showselect_livreurs = true;
        if(this.livreurcheck == true) {
          this.id4 = id;
          this.isloading4 = true;
          const status = 'en cours de livraison';
          this.serv.en_cour_de_livraison(id, status,this.livreurname).subscribe(data => {
            if (data.data == 'en_cours_de_livraison') {
              setTimeout(() => {
                this.gettingdata();
                this.isloading4 = false;
                this.livreurcheck = false;
                   this.showselect_livreurs = false;
              }, 2000);
            }
          })
        }else{
          this.showselect_livreurs = true;
          alert('vous devez sélectionner un livreurs pour ce commande');
        }
      }else{
          this.id4 = id;
          this.isloading4 = true;
          const status = 'en cours de livraison';
          this.serv.en_cour_de_livraison(id, status,this.livreurname).subscribe(data => {
            if (data.data == 'en_cours_de_livraison') {
              setTimeout(() => {
                this.gettingdata();
                this.isloading4 = false;
              }, 2000);
            }
          })
      }
    })

    // if(this.livreurcheck == true) {
    //   this.id4 = id;
    //   this.isloading4 = true;
    //   const status = 'en cours de livraison';
    //   this.serv.en_cour_de_livraison(id, status,this.livreurname).subscribe(data => {
    //     if (data.data == 'en_cours_de_livraison') {
    //       setTimeout(() => {
    //         this.gettingdata();
    //         this.isloading4 = false;
    //       }, 2000);
    //     }
    //   })
    // }else{
    //   alert('vous devez sélectionner un livreurs pour ce commande');
    // }
}
  payee(id_orders){
    this.id8 = id_orders;
    this.isloading8 = true;
    const status = 'payée';
    this.serv.payee_cmd(id_orders,status).subscribe(data => {
      if(data.data == 'payée') {
        setTimeout(()=>{
          this.gettingdata();
          this.isloading8 = false;
        },2000);
      }
    })
}
  livraisonsuccess(id) {
    this.id5 = id;
    this.isloading5 = true;
    const status = 'Livrée';
    this.serv.success_livraison(id,status).subscribe(data => {
      if(data.data == 'Livrée') {
        setTimeout(()=>{
          this.gettingdata();
          this.isloading5 = false;
        },2000);
      }
    })
  }
  NoLivree(id) {
    this.id6 = id;
    this.isloading6 = true;
    const status = 'Non Livrée';
    this.serv.success_no_livraison(id,status).subscribe(data => {
      if(data.data == 'Non Livrée') {
        setTimeout(()=>{
          this.gettingdata();
          this.isloading6 = false;
        },2000);
      }
    })
  }
  click(status , val){
    this.mystatus = status;
   if(this.checkradiovalue == 1 || this.checkradiovalue == 0) {
     var data;
     if(this.livreurnames !=null){
        data = this.ordersF.filter(key => key.status == status && key.livreur == this.livreurnames);
     }else{
       data = this.ordersF.filter(key => key.status == status);
     }
     this.orders = data;
     // this.ordersF = this.orders;
     // this.ordersF = this.ordersFd;
   }else if (this.checkradiovalue ==2) {
     if (this.role == 'Agent de Commandes') {
       let ord = [];
       let ordF = [];
       let ord2 = [];
       this.servss.getAllOrders();
       this.servss.emitdataOrdres().subscribe(data => {
         ord = data;
         ordF = ord;
         ord = data;
         const dataz = ord.filter(key => key.status == status && key.agent_cmd == this.full_name);
         this.orders = dataz;
         this.ordersF = ord2;
         // this.ordersF = this.orders;
         console.log(this.orders, this.ordersF,ord,ord2,ordF);
       });
     }else if (this.role == 'Agent de livraisons') {
       let ord = [];
       let ordF = [];
       let ord2 = [];
       this.servss.getAllOrders();
       this.servss.emitdataOrdres().subscribe(data => {
         ord = data;
         ordF = ord;
         ord = data;
         var dataz;
         if(this.livreurnames != null) {
            dataz = ord.filter(key => key.status != 'Commandée' && key.status != 'en cours de traitement' && key.status != 'Traitée'&& key.status != 'Réserve' &&  key.status== status && key.agent_livraison == this.full_name && key.livreur == this.livreurnames);
         }else{
            dataz = ord.filter(key => key.status != 'Commandée' && key.status != 'en cours de traitement' && key.status != 'Traitée'&& key.status != 'Réserve' &&  key.status== status && key.agent_livraison == this.full_name);

         }
         this.orders = dataz;
         // this.ordersF = ord2;
         // this.ordersF = this.orders;
         console.log(this.orders, this.ordersF,ord,ord2,ordF);
       });
     }else if (this.role == 'Livreurs') {
       let ord = [];
       let ordF = [];
       let ord2 = [];
       this.servss.getAllOrders();
       this.servss.emitdataOrdres().subscribe(data => {
         ord = data;
         ordF = ord;
         ord = data;
         const dataz = ord.filter(key => key.status != 'Commandée' && key.status != 'en cours de traitement' && key.status != 'Traitée'&& key.status != 'Réserve' && key.status != 'préparation de livraison' && key.livreur == this.full_name);
         this.orders = dataz;
         this.ordersF = ord2;
         // this.ordersF = this.orders;
         console.log(dataz,this.ordersF, this.orders);
       });
     }


   }else if(this.checkradiovalue == 0) {
     const data = this.ordersF.filter(key => key.status == status);
     this.orders = data;
     this.ordersF = this.orders;
     this.ordersF = this.ordersFd;
     console.log(this.orders, this.ordersF,this.ordersFd);
   }
  }
  radio1(event) {
    this.checkradiovalue = event.value;
  }
  dateD(event0) {
    // this.dated = event0.target.value;
    const date = event0.target.value;
    this.dated = formatDate(date,'yyyy-MM-dd','en-US');
    console.log(this.dated);
    if(this.checkradiovalue ==1 || this.checkradiovalue == 0) {
      // for(let i of this.orders) {
      //   console.log(i.datecmd.slice(0,10));
      // }
      const data  = this.ordersF.filter(key => (key.datecmd.slice(0,10)) == this.dated);
      this.orders = data;
      this.ordersF = this.orders;
      this.ordersF = this.ordersFd;
      console.log(data);
      if(data.length == 0) {
        this.messageafterdate = true;
      }
    }else if(this.checkradiovalue == 2) {
      // for(let i of this.orders) {
      //   console.log(i.datecmd.slice(0,10));
      // }
      if (this.role == 'Livreurs') {
        // alert('hahahha');
        let ord = [];
        let ordF = [];
        let ord2 = [];
        this.servss.getAllOrders();
        this.servss.emitdataOrdres().subscribe(data => {
           ord = data;
           ord2 = data;
           const datas = ord2.filter(key => (key.created_at.slice(0,10) == this.dated) && key.livreur == this.full_name && key.status != 'Commandée' && key.status != 'en cours de traitement' && key.status != 'Traitée'&& key.status != 'Réserve' && key.status != 'préparation de livraison')
          // this.ordersF = data;
          this.orders = datas;
          console.log(datas);
        });
      }else if (this.role == 'Agent de Commandes') {
        let ord = [];
        let ordF = [];
        let ord2 = [];
        this.servss.getAllOrders();
        this.servss.emitdataOrdres().subscribe(data => {
          ord = data;
          ord2 = data;
          const datas = ord2.filter(key => (key.created_at.slice(0,10) == this.dated) && key.agent_cmd == this.full_name)
          // this.ordersF = data;
          this.orders = datas;
          console.log(datas);
        });
      }else if (this.role == 'Agent de livraisons') {
        let ord = [];
        let ordF = [];
        let ord2 = [];
        this.servss.getAllOrders();
        this.servss.emitdataOrdres().subscribe(data => {
          ord = data;
          ord2 = data;
          const datas = ord2.filter(key => (key.created_at.slice(0,10) == this.dated) && key.agent_livraison == this.full_name && key.status != 'Commandée' && key.status != 'en cours de traitement' && key.status != 'Traitée'&& key.status != 'Réserve')
          // this.ordersF = data;
          this.orders = datas;
          console.log(datas);
        });
      }

    }
  }
  search(event) {
    console.log(event.target.value);
    if (this.checkradiovalue == 1 || this.checkradiovalue == 0) {
      if (this.role == 'Livreurs') {
        if (event.target.value != '') {
          const data = this.ordersF.filter(key => (key.Full_name.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name) ||
            (key.Ville.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name) ||
            (key.regions.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name) ||
            (key.CodeCMD.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name) ||
            (key.adress.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name) ||
            (key.telephone.toString().toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name)
          );
          this.orders = data;
        } else if (event.target.value == '') {
          this.gettingdata();
        }
      } else if (this.role == 'Agent de livraisons') {
        console.log(this.role, this.orders);
        if (event.target.value != '') {
          const data = this.ordersF.filter(key => (key.Full_name.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name) ||
            (key.Ville.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name) ||
            (key.regions.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name) ||
            (key.CodeCMD.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name) ||
            (key.adress.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name) ||
            (key.telephone.toString().toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name)
          );
          this.orders = data;
        } else if (event.target.value == '') {
          this.gettingdata();
        }
      } else if (this.role == 'Agent de Commandes') {
        console.log('hahahha1');
        if (event.target.value != '') {
          console.log('hahahha2');
          const data = this.ordersF.filter(key => (key.Full_name.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name) ||
            (key.Ville.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name) ||
            (key.regions.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name) ||
            (key.CodeCMD.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name) ||
            (key.adress.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name) ||
            (key.telephone.toString().toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name)
          );
          this.orders = data;
          console.log(this.orders, data);
        } else if (event.target.value == '') {
          this.gettingdata();
        }
      }
    }else if(this.checkradiovalue == 2) {
      if(this.role == 'Livreurs') {
        if (event.target.value != '') {
          let ord = [];
          let ordF = [];
          let ord2 = [];
          this.servss.getAllOrders();
          this.servss.emitdataOrdres().subscribe(data => {
            ord = data;
            ord2 = data;
            console.log(data);

            const datas = ord2.filter(key => (key.clientfulname.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name) ||
              (key.ville.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name) ||
              (key.CodeCMD.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name) ||
              (key.adress.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name)||
              // (key.regions.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name)
              (key.teleclient.toString().toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.livreur == this.full_name)
            );
            this.orders = datas;
            console.log(this.orders, data);
          });
        } else if (event.target.value == '') {
          this.gettingdata();
        }
      }else if(this.role == 'Agent de Commandes') {
        if (event.target.value != '') {
        let ord = [];
        let ordF = [];
        let ord2 = [];
        this.servss.getAllOrders();
        this.servss.emitdataOrdres().subscribe(data => {
          ord = data;
          ord2 = data;
          console.log(data);

            const datas = ord2.filter(key => (key.clientfulname.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name) ||
              (key.ville.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name) ||
              (key.CodeCMD.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name) ||
              (key.adress.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name)||
              // (key.regions.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name)
              (key.teleclient.toString().toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name)
            );
            this.orders = datas;
            console.log(this.orders, data);
        });
          } else if (event.target.value == '') {
            this.gettingdata();
          }

      }else if(this.role == 'Agent de livraisons') {
        if (event.target.value != '') {
          let ord = [];
          let ordF = [];
          let ord2 = [];
          this.servss.getAllOrders();
          this.servss.emitdataOrdres().subscribe(data => {
            ord = data;
            ord2 = data;
            console.log(data);

            const datas = ord2.filter(key => (key.clientfulname.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name) ||
              (key.ville.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name) ||
              (key.CodeCMD.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name) ||
              (key.adress.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name)||
              // (key.regions.toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_cmd == this.full_name)
              (key.teleclient.toString().toLocaleLowerCase().match(event.target.value.toLocaleLowerCase()) && key.agent_livraison == this.full_name)
            );
            this.orders = datas;
            console.log(this.orders, data);
          });
        } else if (event.target.value == '') {
          this.gettingdata();
        }
      }
    }
  }
  seeall() {
    if (this.checkradiovalue == 1 || this.checkradiovalue == 0) {
      this.gettingdata();
    }else if(this.checkradiovalue == 2) {
      if(this.role == 'Livreurs') {
        let ord = [];
        let ordF = [];
        let ord2 = [];
        this.servss.getAllOrders();
        this.servss.emitdataOrdres().subscribe(data => {
          ord = data;
          ord2 = data;
          const datas = ord2.filter(key => key.livreur == this.full_name && key.status != 'Commandée' && key.status != 'en cours de traitement' && key.status != 'Traitée'&& key.status != 'Réserve' && key.status != 'préparation de livraison')
          // this.ordersF = data;
          this.orders = datas;
          console.log(datas);
        });
      }else if(this.role == 'Agent de Commandes') {
        let ord = [];
        let ordF = [];
        let ord2 = [];
        this.servss.getAllOrders();
        this.servss.emitdataOrdres().subscribe(data => {
          ord = data;
          ord2 = data;
          const datas = ord2.filter(key => key.agent_cmd == this.full_name)
          // this.ordersF = data;
          this.orders = datas;
          console.log(datas);
        });
      }else if(this.role == 'Agent de livraisons') {
        let ord = [];
        let ordF = [];
        let ord2 = [];
        this.servss.getAllOrders();
        this.servss.emitdataOrdres().subscribe(data => {
          ord = data;
          ord2 = data;
          const datas = ord2.filter(key => key.agent_livraison == this.full_name && key.status != 'Commandée' && key.status != 'en cours de traitement' && key.status != 'Traitée'&& key.status != 'Réserve')
          // this.ordersF = data;
          this.orders = datas;
          console.log(datas);
        });
      }
    }
  }
gettingdata() {

  const data  = JSON.parse(sessionStorage.getItem('Admin'));
  if(data[0].Role == 'Agent de Commandes') {
    const ststus = 'Commandée';
    this.serv.getting_orders_altravers_le_role(this.full_name, ststus).subscribe(data=> {
      this.orders = data.data;
      this.ordersF = this.orders;
      this.ordersFd = this.orders;
      console.log(this.orders);
    })
}else if (data[0].Role == 'Agent de livraisons') {
  const ststus = 'préparation de livraison';
  this.serv.getting_orders_altravers_le_role_agentlivr(this.full_name, ststus).subscribe(data=> {
  this.orders = data.data;
    this.ordersF = this.orders;
    this.ordersFd = this.orders;
})
}else if (data[0].Role == 'Livreurs') {
  const ststus = 'en cours de livraison';
  this.serv.getting_orders_altravers_le_role_livreurs(this.full_name, ststus).subscribe(data=> {
    this.orders = data.data;
    this.ordersF = this.orders;
    this.ordersFd = this.orders;
  })
}
}
  Livreurschose(Role, Full_name){
    this.livreurname = Full_name;
    if(this.livreurname != null || this.livreurname != '') {
      this.livreurcheck = true;
    }
}
  agentsLivreurschose(Role, Full_name){
    this.agentlivname = Full_name;
    if(this.agentlivname != null || this.agentlivname != '') {
      this.agentlivreurcheck = true;
    }
  }
  fliterLiv(name, id){
    this.livreurnames= name;
    console.log(name, id, this.checkradiovalue, this.orders);
    if(this.checkradiovalue == 0 || this.checkradiovalue == 1) {
      // alert(1)
      if(this.mystatus != null) {
        // alert(2)
        const data = this.ordersF.filter(key => key.livreur == name && key.status == this.mystatus);
        this.orders = data;
      }else{
        // alert(3)
        const data = this.ordersF.filter(key => key.livreur == name);
        this.orders = data;
      }

    }else if(this.checkradiovalue == 2) {
      // alert(4)
      let ord = [];
      let ordF = [];
      let ord2 = [];
      this.servss.getAllOrders();
      this.servss.emitdataOrdres().subscribe(data => {
        ord = data;
        ord2 = data;
        if(this.mystatus != null) {
          // alert(5)
          const datas = ord2.filter(key => key.livreur == name && key.status == this.mystatus);
          // this.ordersF = data;
          this.orders = datas;
        }else {
          // alert(6)
          const datas = ord2.filter(key => key.livreur == name);
          // this.ordersF = data;
          this.orders = datas;
        }


      });

    }
  }
}
