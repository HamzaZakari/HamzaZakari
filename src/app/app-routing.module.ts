import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './AdminArea/navbar/navbar/navbar.component';
import { DashbordComponent } from './AdminArea/dashbord/dashbord.component';
import { HomeComponent } from './OurSite/home/home.component';
import { SitOverViewRightComponent } from './AdminArea/sit-over-view-right/sit-over-view-right.component';
import { AllproductComponent } from './AdminArea/allproduct/allproduct.component';
import { AllCategoryComponent } from './AdminArea/all-category/all-category.component';
import { AddproductComponent } from './AdminArea/new/addproduct/addproduct.component';
import {AddcategoryComponent} from './AdminArea/new/addcategory/addcategory.component';
// import {AutentiicationComponent} from './AdminArea/Auth/autentiication/autentiication.component';
// import {HomeregisterComponent} from './AdminArea/homeregister/homeregister.component';
// import {SingupComponent} from './AdminArea/Auth/singup/singup.component';
import {MultipeimagesComponent} from './AdminArea/new/multipeimages/multipeimages.component';
import {AllProductsComponent} from './OurSite/all-products/all-products.component';
import {ProductDetailComponent} from './OurSite/product-detail/product-detail.component';
import {AllCatProductComponent} from './OurSite/all-cat-product/all-cat-product.component';
import {PanierComponent} from './OurSite/panier/panier.component';
import {CheckoutComponent} from './OurSite/checkout/checkout.component';
import {AchetteComponent} from './OurSite/achette/achette.component';
import {AllClientsComponent} from './AdminArea/all-clients/all-clients.component';
import {AllOrdersComponent} from './AdminArea/all-orders/all-orders.component';
import {DeatilOrdersComponent} from './AdminArea/all-orders/deatil-orders/deatil-orders.component';
import {EditOrdersComponent} from './AdminArea/all-orders/edit-orders/edit-orders.component';
// import {OvertureComponent} from './overture/overture.component';
import {FraisLexpeditionComponent} from './OurSite/frais-lexpedition/frais-lexpedition.component';
import {AuthpageComponent} from './AdminArea/yahya/authpage/authpage.component';
import {PrivateInformationsComponent} from './AdminArea/yahya/private-informations/private-informations.component';
import {NewbannerimagesComponent} from './AdminArea/new/newbannerimages/newbannerimages.component';
import {BannerImagesComponent} from './AdminArea/banner-images/banner-images.component';
import {BannerIchharComponent} from './AdminArea/banner-images/banner-ichhar/banner-ichhar.component';
import {AllIchharBannerComponent} from './AdminArea/all-ichhar-banner/all-ichhar-banner.component';
import {SliderPrincipaleImageComponent} from './AdminArea/slider-principale-image/slider-principale-image.component';
import {SliderImagesComponent} from './AdminArea/slider-images/slider-images.component';
import {ManagepoidsComponent} from './AdminArea/managepoids/managepoids.component';
import {UpdatepoidsComponent} from './AdminArea/managepoids/updatepoids/updatepoids.component';
import {GenirateLivraiosnComponent} from './AdminArea/genirate-livraiosn/genirate-livraiosn.component';
import {UpLivraisonComponent} from './AdminArea/genirate-livraiosn/up-livraison/up-livraison.component';
import {PacksComponent} from './OurSite/packs/packs.component';
import {ImprimerordersComponent} from './AdminArea/all-orders/imprimerorders/imprimerorders.component';
import {AdministrationsComponent} from './AdminArea/administrations/administrations.component';
import {AdminLoginComponent} from './AdminArea/administrations/admin-login/admin-login.component';
import {VoirMesCommandesComponent} from './OurSite/voir-mes-commandes/voir-mes-commandes.component';
import {OtherUserAuthComponent} from './AdminArea/administrations/admin-login/other-user-auth/other-user-auth.component';
import {GetionnaireCMDComponent} from './AdminArea/all-orders/Agents/getionnaire-cmd/getionnaire-cmd.component';
import {AgentDeStockComponent} from './AdminArea/all-orders/Agents/agent-de-stock/agent-de-stock.component';
import {NosCollectionParapharmasieComponent} from './OurSite/packs/nos-collection-parapharmasie/nos-collection-parapharmasie.component';
import {TopSellingProductComponent} from './OurSite/packs/top-selling-product/top-selling-product.component';
import {TestComponent} from './OurSite/packs/test/test.component';
import {ResBeldiComponent} from './OurSite/packs/responsive/res-beldi/res-beldi.component';
import {ResEseepicesComponent} from './OurSite/packs/responsive/res-eseepices/res-eseepices.component';
import {ResFruitSecsComponent} from './OurSite/packs/responsive/res-fruit-secs/res-fruit-secs.component';
import {ResPacksComponent} from './OurSite/packs/responsive/res-packs/res-packs.component';
import {SellesComponent} from './OurSite/packs/selles/selles.component';
import {AddboutiqueComponent} from './AdminArea/new/addboutique/addboutique.component';
import {AllBoutiqueComponent} from './AdminArea/all-boutique/all-boutique.component';
import {AddFornisseurComponent} from './AdminArea/new/add-fornisseur/add-fornisseur.component';
import {AboutsusComponent} from './OurSite/aboutsus/aboutsus.component';
import {ContactezNousComponent} from './OurSite/secondnavbar/contactez-nous/contactez-nous.component';
import {RecapOrdersComponent} from './AdminArea/all-orders/recap-orders/recap-orders.component';
import {DamaTestComponent} from './AdminArea/all-orders/dama-test/dama-test.component';


const routes: Routes = [
  // {path: '', component: OvertureComponent ,  pathMatch: 'full'},
  {path: '', component: HomeComponent ,  pathMatch: 'full'},
  // {path: 'all_product', component: AllProductsComponent},
  // {path: 'Packs', component: PacksComponent},
  {path: 'policies/shipping-policy', component: FraisLexpeditionComponent},
  {path: 'product_detail/:proId', component: ProductDetailComponent},
  {path: 'all_categories_produits/:catId', component: AllCatProductComponent},
  // {path: 'admin', component: HomeregisterComponent},
  // {path: 'admin_auth', component: AutentiicationComponent},
  // {path: 'admin_singup', component: SingupComponent},
  {path: 'panier', component: PanierComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'Remerciement', component: AchetteComponent},
  {path: 'dashboard', component: DashbordComponent, children: [
    {path:'Creat-acount', component: AdminLoginComponent},
    {path: 'index', component: SitOverViewRightComponent},
    {path: 'all_products', component: AllproductComponent},
    {path: 'new_founisseur', component: AddFornisseurComponent},
    {path: 'all_categorys', component: AllCategoryComponent},
    {path: 'all_clients', component: AllClientsComponent},
    {path: 'all_boutique', component: AllBoutiqueComponent},
    {path: 'all_orders', component: AllOrdersComponent},
    {path: 'managepoids/:prodId', component: ManagepoidsComponent},
    {path: 'update_poids/:poidId', component: UpdatepoidsComponent},
    {path: 'detail_Order/:idOrd', component: DeatilOrdersComponent},
    {path: 'edit_Orders/:idOrd', component: EditOrdersComponent},
    {path: 'edit_product/:proId', component: AddproductComponent},
    {path: 'add_product', component: AddproductComponent},
    {path: 'add_category', component: AddcategoryComponent},
    {path: 'add_boutique', component: AddboutiqueComponent},
    {path: 'new-banner-images', component: NewbannerimagesComponent},
    {path: 'new-title-banner', component: BannerIchharComponent},
    {path: 'tout-titres-banner', component: AllIchharBannerComponent},
    {path: 'new-image-slider', component: SliderPrincipaleImageComponent},
    {path: 'all-image-slider', component: SliderImagesComponent},
    {path: 'All-banner-images', component: BannerImagesComponent},
    {path: 'update_category/:catId', component: AddcategoryComponent},
    {path: 'upload_multiple_images/:prodId', component: MultipeimagesComponent},
    {path: 'Informations-pour-Livraison/:orid', component: GenirateLivraiosnComponent},
    {path: 'livraisn-modifier', component: UpLivraisonComponent},
    {path: 'Download-orders-commandee', component: ImprimerordersComponent},
    {path: 'recap_orders', component: RecapOrdersComponent},
    {path: 'Dama', component: DamaTestComponent}
  ]},
  {path:'Auth-forms', component: AuthpageComponent},
  {path:'all_product', component: SellesComponent},
  {path:'products/:id_pro', component: SellesComponent},
  {path:'products/:id_pro/:cat_id', component: SellesComponent},
  {path: 'Agents_cmd', component: GetionnaireCMDComponent},
  {path: 'agents_stock', component: AgentDeStockComponent},
  {path:'my-ordres', component: VoirMesCommandesComponent},
  {path:'Super_Auth', component: AdministrationsComponent},
  {path:'about-us', component: ContactezNousComponent},
  {path:'Authentifications', component: OtherUserAuthComponent},
  {path:'data/gestions', component: PrivateInformationsComponent},
  {path: '**' , redirectTo: '/', pathMatch: 'full'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
