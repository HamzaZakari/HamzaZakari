export interface Orders {
  id?: number;
  title?:string;
  id_client?: number;
  id_produits?: number;
  clientfulname?: string;
  teleclient?: string;
  frname?: string;
  angname?: string;
  email?: string;
  adress?: string;
  pays?: string;
  ville?: string;
  regions?: string;
  qte_pro?: number;
  pricepro?: number;
  poidspro?: string;
  codepostal?: number;
  arabaname?: string;
  image?: File;
  qte?: number;
  poids?: string;
  price?: number;
  valuestatus?: number;
  status?: string;
  affstatus?: string;
  pricep?: number;
  pricea?: number;
  created_at?: string;
  toprix?: number;
  totalcomonde?: number;
  total_whit_prix_livreson?: number;
  total_whitout_prix_levrison?: number
  CodeLiveraison?: string;
  commentaire?: string;
  prixachats?: number;
  subprixachats?: number;
  prixLevrison?:number;
  frais_levrison?:number;
  count_pro?:number;
  qtycomonde?:number;
  id_detail?:number;
  id_orders?:number;
  charge?:number;
  CodeCMD?:string;
  cmddate?:string;
  poidscmd?:string;
  realprixachat?:number;
  Amdin?:string;
  agent_cmd?: string;
  agent_livraison?:string;
  livreur?:string;
  chargeliv?: number;
}
