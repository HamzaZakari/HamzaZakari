import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AreaServiceService {
  // private host = 'http://138.68.79.202:3000/';
  private host = '';
  // private host =  'http://localhost:3000/';
  constructor(private Http: HttpClient, private route: Router,  @Inject(DOCUMENT) private document: Document) {
    if(document.location.hostname == 'localhost') {
      this.host =  'http://localhost:3000/';
    }else {
      this.host = 'https://www.herboshop.ma/herbo/';
    }
  }


  SingUp(Full_name, password, confirme_password, status) {
    const data = {
      Full_name: Full_name,
      password: password,
      status: status
    }
    return this.Http.post<{err: any, data: any}>(this.host + 'api/Admin_singUp', data);
  }
  superAdminAuth(Full_name, password) {
    const data = {
      name: Full_name,
      pass: password
    }
    return this.Http.post<{err: any, data: any, datasuper: any[]}>(this.host + 'api/Auth_super_Admin' ,data);
  }
  otherusersauth(Full_name, password){
    const data = {
      name: Full_name,
      password: password
    };
    return this.Http.post<{err: any, data: any, datajson: any[]}>(this.host + 'api/other_users_auth', data);

  }

  getAgentsCMD() {
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/get_Agent_cmd');
  }
  getAgentsLivraison() {
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/get_Agent_livraison');
  }
  getLivreurs() {
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/get_Livreurs');
  }
  validertraitemtagents (idord,admin,agentcmd?, agentliv?, livreur?: string) {
    var data;

    if(agentcmd != null && agentliv != null && livreur != null) {
      data = {
        Admin: admin,
        agent_cmd: agentcmd,
        agent_livraison: agentliv,
        livreur: livreur
      };
    }else if(agentcmd != null && agentliv != null && livreur == null){
      data = {
        Admin: admin,
        agent_cmd: agentcmd,
        agent_livraison: agentliv
      };
    }else if(agentcmd != null && agentliv == null && livreur == null){
      data = {
        Admin: admin,
        agent_cmd: agentcmd
      };
    }else if(agentcmd != null && agentliv == null && livreur != null){
      data = {
        Admin: admin,
        agent_cmd: agentcmd,
        livreur: livreur
      };
    }else if(agentcmd == null && agentliv != null && livreur == null){
      data = {
        agent_livraison: agentliv
      };
    }else if(agentcmd == null && agentliv != null && livreur != null){
      data = {
        agent_livraison: agentliv,
        livreur: livreur
      };
    }


    return this.Http.put<{arr: any, data: any}>(this.host + 'api/traitement_de_agents/'+ idord, data);
    // return data;
  }
  getting_orders_altravers_le_role(full_name, status) {
    const data = {
      full_name: full_name,
      status: status
    };
    return this.Http.post<{err: any, data: any[]}>(this.host + 'api/getting_orders_altravers_le_role', data);
  }
  getting_orders_altravers_le_role_agentlivr(full_name, status) {
    const data = {
      full_name: full_name,
      status: status
    };
    return this.Http.post<{err: any, data: any[]}>(this.host + 'api/getting_orders_altravers_le_role_agentliv', data);
  }
  getting_orders_altravers_le_role_livreurs(full_name, status) {
    const data = {
      full_name: full_name,
      status: status
    };
    return this.Http.post<{err: any, data: any[]}>(this.host + 'api/getting_orders_altravers_le_role_livreur', data);
  }
  // en cour de traistement
  ecourdetraitement(id_orders, status) {
    const data = {
      id: id_orders,
      status: status
    }
    return this.Http.put<{data: any, err: any}>(this.host + 'api/en_cours_de_traitement', data);
  }
// end cour de traistement
//valider Taraitement
  validerTaraitement(id_orders, status) {
    const data = {
      id: id_orders,
      status: status
    }
    return this.Http.put<{data: any, err: any}>(this.host + 'api/valider_traitement', data);
  }
  // end valider Taraitement

  //preparation de livraison
  pareparationdelivraison(id_orders, status, name) {
    // alert(name);
    var data;
    if(name == null) {
      data = {
        status: status,
        textstatus: status
      }
    }else {
      data = {
        status: status,
        textstatus: status,
        agent_livraison: name
      }
    }

    return this.Http.put<{data: any, err: any}>(this.host + 'api/preparation_de_livraison/' + id_orders , data);
  }
  payee_cmd(id_orders, status){
    const data = {
      id: id_orders,
      status: status,
      name: name
    }
    return this.Http.put<{data: any, err: any}>(this.host + 'api/CMD_payee', data);
  }
  // end praparations de livraison
  // en courd de livraison
  en_cour_de_livraison(id_orders, status, livname?: string) {
    const data = {
      id: id_orders,
      status: status,
      livname: livname?livname:'NULL'
    }
    return this.Http.put<{data: any, err: any}>(this.host + 'api/en_cours_de_livraison', data);
  }
  // end en cours de livraison
  success_livraison(id_orders,status){
    const data = {
      id: id_orders,
      status: status
    }
    return this.Http.put<{data: any, err: any}>(this.host + 'api/success_livraison', data);
  }
  reversecmd(id_orders,status) {
    const data = {
      id: id_orders,
      status: status
    }
    return this.Http.put<{data: any, err: any}>(this.host + 'api/reverse_cmd', data);
  }
  success_no_livraison(id_orders, status) {
    const data = {
      id: id_orders,
      status: status
    }
    return this.Http.put<{data: any, err: any}>(this.host + 'api/success_no_livraison', data);
  }
  getting_all_agents() {
    return this.Http.get<{err: any, data: any[]}>(this.host + 'api/getting_all_agents');
  }
  delete_agents(id_Admin) {
    return this.Http.delete<{err: any, data: any}>(this.host + 'api/delete_agent/'+id_Admin);
  }
  editingagents(id_Admin, name, pass, role) {
    const data = {
      id: id_Admin,
      name: name,
      pass: pass,
      // confirmepass: confirmepass,
      role: role
    }
    return this.Http.put<{err: any, data:any}>(this.host + 'api/editing_amdin_agents', data);
  }
  checkiflivreur(id) {
    return this.Http.get<{err: any, data: any}>(this.host +'api/checkif_liv/'+ id);
  }
  checkagent_liv(id){
    //api/checkif_agent_liv/:id'
    return this.Http.get<{err: any, data: any}>(this.host +'api/checkif_agent_liv/'+ id);
  }
  vidercashe(id) {
    const data = {
      id: id
    }
    return this.Http.put<{err: any, data: any}>(this.host+'api/videliv',data);
  }
}

