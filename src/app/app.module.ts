import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashbordComponent} from './AdminArea/dashbord/dashbord.component';
import { NavbarComponent} from './AdminArea/navbar/navbar/navbar.component';
import { HomeComponent } from './OurSite/home/home.component';
import { SitOverViewLeftComponent } from './AdminArea/sit-over-view-left/sit-over-view-left.component';
import { SitOverViewRightComponent } from './AdminArea/sit-over-view-right/sit-over-view-right.component';
import { AllproductComponent } from './AdminArea/allproduct/allproduct.component';
import { AllCategoryComponent } from './AdminArea/all-category/all-category.component';
import { HttpClientModule } from '@angular/common/http';
import {NgbCarouselModule,NgbModule,NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { PopusNewComponent } from './AdminArea/popus-new/popus-new.component';
import { AddproductComponent } from './AdminArea/new/addproduct/addproduct.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { ManagegramageAndLitrageComponent } from './AdminArea/managegramage-and-litrage/managegramage-and-litrage.component';
import { AddcategoryComponent } from './AdminArea/new/addcategory/addcategory.component';
import {
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatAccordion, MatBottomSheetModule,
  MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatExpansionModule,
  MatIconModule, MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule, MatSliderModule, MatSnackBarModule,
  MatSortModule, MatStepperModule, MatTableModule, MatTabsModule, MatTooltipModule
} from '@angular/material';
import { FilerPipe } from './AdminArea/pipes/filer.pipe';
import { MultipeimagesComponent } from './AdminArea/new/multipeimages/multipeimages.component';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import { AllProductsComponent } from './OurSite/all-products/all-products.component';
import { FooterComponent } from './OurSite/footer/footer.component';
import { ProductDetailComponent } from './OurSite/product-detail/product-detail.component';
import { AllCatProductComponent } from './OurSite/all-cat-product/all-cat-product.component';
import { PanierComponent } from './OurSite/panier/panier.component';
import { CheckoutComponent } from './OurSite/checkout/checkout.component';
import { AchetteComponent } from './OurSite/achette/achette.component';
import { AllClientsComponent } from './AdminArea/all-clients/all-clients.component';
import { AllOrdersComponent } from './AdminArea/all-orders/all-orders.component';
import { DeatilOrdersComponent } from './AdminArea/all-orders/deatil-orders/deatil-orders.component';
import { EditOrdersComponent } from './AdminArea/all-orders/edit-orders/edit-orders.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { PupusmoduleComponent } from './OurSite/pupusmodule/pupusmodule.component';
import { NavbarhomeComponent } from './OurSite/navbarhome/navbarhome.component';
import { SecondnavbarComponent } from './OurSite/secondnavbar/secondnavbar.component';
import { HomenavComponent } from './OurSite/homenav/homenav.component';
import { OfersComponent } from './OurSite/ofers/ofers.component';
import { PrivaceyPolicyComponent } from './OurSite/privacey-policy/privacey-policy.component';
import { FraisLexpeditionComponent } from './OurSite/frais-lexpedition/frais-lexpedition.component';
import { AboutsusComponent } from './OurSite/aboutsus/aboutsus.component';
import { GesionpageComponent } from './AdminArea/yahya/gesionpage/gesionpage.component';
import { AuthpageComponent } from './AdminArea/yahya/authpage/authpage.component';
import { PrivateInformationsComponent } from './AdminArea/yahya/private-informations/private-informations.component';
import { NewbannerimagesComponent } from './AdminArea/new/newbannerimages/newbannerimages.component';
import { BannerImagesComponent } from './AdminArea/banner-images/banner-images.component';
import { BannerIchharComponent } from './AdminArea/banner-images/banner-ichhar/banner-ichhar.component';
import { AllIchharBannerComponent } from './AdminArea/all-ichhar-banner/all-ichhar-banner.component';
import { BannersComponent } from './OurSite/banners/banners.component';
import { SliderPrincipaleImageComponent } from './AdminArea/slider-principale-image/slider-principale-image.component';
import { SliderImagesComponent } from './AdminArea/slider-images/slider-images.component';
import { ManagepoidsComponent } from './AdminArea/managepoids/managepoids.component';
import { UpdatepoidsComponent } from './AdminArea/managepoids/updatepoids/updatepoids.component';
import { GenirateLivraiosnComponent } from './AdminArea/genirate-livraiosn/genirate-livraiosn.component';
import { UpLivraisonComponent } from './AdminArea/genirate-livraiosn/up-livraison/up-livraison.component';
import {DragScrollModule} from 'ngx-drag-scroll';
import {ButtonsModule, InputsModule, MDBBootstrapModule, ModalModule, WavesModule} from 'angular-bootstrap-md';
import { PacksComponent } from './OurSite/packs/packs.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import { ImprimerordersComponent } from './AdminArea/all-orders/imprimerorders/imprimerorders.component';
import { AdministrationsComponent } from './AdminArea/administrations/administrations.component';
import { AdminLoginComponent } from './AdminArea/administrations/admin-login/admin-login.component';
import { VoirMesCommandesComponent } from './OurSite/voir-mes-commandes/voir-mes-commandes.component';
import { OtherUserAuthComponent } from './AdminArea/administrations/admin-login/other-user-auth/other-user-auth.component';
import { GetionnaireCMDComponent } from './AdminArea/all-orders/Agents/getionnaire-cmd/getionnaire-cmd.component';
import { AgentDeStockComponent } from './AdminArea/all-orders/Agents/agent-de-stock/agent-de-stock.component';
import { NosCollectionParapharmasieComponent } from './OurSite/packs/nos-collection-parapharmasie/nos-collection-parapharmasie.component';
import { TopSellingProductComponent } from './OurSite/packs/top-selling-product/top-selling-product.component';
import { CatMeilComponent } from './OurSite/packs/cat-meil/cat-meil.component';
import { CatBeldiComponent } from './OurSite/packs/cat-beldi/cat-beldi.component';
import { CatEsepicesComponent } from './OurSite/packs/cat-esepices/cat-esepices.component';
import { CatFruitSecsComponent } from './OurSite/packs/cat-fruit-secs/cat-fruit-secs.component';
import { CatOliverCornichonsComponent } from './OurSite/packs/cat-oliver-cornichons/cat-oliver-cornichons.component';
import { CatGrainesComponent } from './OurSite/packs/cat-graines/cat-graines.component';
import { TestComponent } from './OurSite/packs/test/test.component';
import { ResBeldiComponent } from './OurSite/packs/responsive/res-beldi/res-beldi.component';
import { ResEseepicesComponent } from './OurSite/packs/responsive/res-eseepices/res-eseepices.component';
import { ResFruitSecsComponent } from './OurSite/packs/responsive/res-fruit-secs/res-fruit-secs.component';
import { ResGraiesComponent } from './OurSite/packs/responsive/res-graies/res-graies.component';
import { ResOliverCornichonComponent } from './OurSite/packs/responsive/res-oliver-cornichon/res-oliver-cornichon.component';
import { ResPacksComponent } from './OurSite/packs/responsive/res-packs/res-packs.component';
import { ResPharmacieComponent } from './OurSite/packs/responsive/res-pharmacie/res-pharmacie.component';
import { SellesComponent } from './OurSite/packs/selles/selles.component';
import { AddboutiqueComponent } from './AdminArea/new/addboutique/addboutique.component';
import { AllBoutiqueComponent } from './AdminArea/all-boutique/all-boutique.component';
import { AddFornisseurComponent } from './AdminArea/new/add-fornisseur/add-fornisseur.component';
import {NgxPrintModule} from 'ngx-print';
import { SwiperWrapperComponent } from './OurSite/home/swiper-wrapper/swiper-wrapper.component';
import {SwiperModule} from 'ngx-swiper-wrapper';
import { SearchbarComponent } from './OurSite/home/searchbar/searchbar.component';
import { ContactezNousComponent } from './OurSite/secondnavbar/contactez-nous/contactez-nous.component';
import { QuickViewsComponent } from './OurSite/quick-views/quick-views.component';
import { RecapOrdersComponent } from './AdminArea/all-orders/recap-orders/recap-orders.component';
import { DamaTestComponent } from './AdminArea/all-orders/dama-test/dama-test.component';
import {AngularEditorModule} from '@kolkov/angular-editor';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxImageCompressorModule } from 'ngx-image-compressor';
@NgModule({
  declarations: [
    AppComponent,
    DashbordComponent,
    NavbarComponent,
    HomeComponent,
    SitOverViewLeftComponent,
    SitOverViewRightComponent,
    AllproductComponent,
    AllCategoryComponent,
    PopusNewComponent,
    AddproductComponent,
    ManagegramageAndLitrageComponent,
    AddcategoryComponent,
    FilerPipe,
    // AutentiicationComponent,
    // HomeregisterComponent,
    // SingupComponent,
    MultipeimagesComponent,
    AllProductsComponent,
    // NavsiteComponent,
    FooterComponent,
    ProductDetailComponent,
    AllCatProductComponent,
    PanierComponent,
    CheckoutComponent,
    AchetteComponent,
    AllClientsComponent,
    AllOrdersComponent,
    DeatilOrdersComponent,
    EditOrdersComponent,
    // MainNavComponent,
    PupusmoduleComponent,
    NavbarhomeComponent,
    SecondnavbarComponent,
    HomenavComponent,
    OfersComponent,
    // OvertureComponent,
    PrivaceyPolicyComponent,
    FraisLexpeditionComponent,
    AboutsusComponent,
    GesionpageComponent,
    AuthpageComponent,
    PrivateInformationsComponent,
    NewbannerimagesComponent,
    BannerImagesComponent,
    BannerIchharComponent,
    AllIchharBannerComponent,
    BannersComponent,
    SliderPrincipaleImageComponent,
    SliderImagesComponent,
    ManagepoidsComponent,
    UpdatepoidsComponent,
    GenirateLivraiosnComponent,
    UpLivraisonComponent,
    PacksComponent,
    ImprimerordersComponent,
    AdministrationsComponent,
    AdminLoginComponent,
    VoirMesCommandesComponent,
    OtherUserAuthComponent,
    GetionnaireCMDComponent,
    AgentDeStockComponent,
    NosCollectionParapharmasieComponent,
    TopSellingProductComponent,
    CatMeilComponent,
    CatBeldiComponent,
    CatEsepicesComponent,
    CatFruitSecsComponent,
    CatOliverCornichonsComponent,
    CatGrainesComponent,
   TestComponent,
    ResBeldiComponent,
    ResEseepicesComponent,
    ResFruitSecsComponent,
    ResGraiesComponent,
    ResOliverCornichonComponent,
    ResPacksComponent,
    ResPharmacieComponent,
    SellesComponent,
    AddboutiqueComponent,
    AllBoutiqueComponent,
    AddFornisseurComponent,
    SwiperWrapperComponent,
    SearchbarComponent,
    ContactezNousComponent,
    QuickViewsComponent,
    RecapOrdersComponent,
    DamaTestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgbTooltipModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ScrollDispatchModule,
    NgbCarouselModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTabsModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatSliderModule,
    MatDialogModule,
    MatExpansionModule,
    MatBottomSheetModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbCarouselModule,
    MatTooltipModule,
    DragScrollModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    CarouselModule,
    MatSnackBarModule,
    // TooltipModule,
    MatStepperModule,
    ModalModule,
    WavesModule,
    InputsModule,
    ButtonsModule,
    NgxPrintModule,
    SwiperModule,
    AngularEditorModule,
    NgxDropzoneModule,
    NgxImageCompressorModule
  ],
  entryComponents: [
    PupusmoduleComponent,
    OfersComponent
  ],
  providers: [ {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
               {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
               MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
