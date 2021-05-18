import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { ServicesService } from '../../services/services.service';
import {Category} from '../../Models/category';
import {Subscription} from 'rxjs';
import {mimeType} from './mime-type.validator';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Products} from '../../Models/products';
import {DOCUMENT} from '@angular/common';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CompressorConfig, ImageCompressorService } from 'ngx-image-compressor';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit, OnDestroy {
  files: File[] = [];
  dropzone_image;
  imageDrop: string;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      }
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  Category: Category[] = [];
 subs: Subscription;
  postForm: FormGroup;
  imagepreview: string;
  Produit: Products;
 mode = 'created';
 titelefr;
 titlearabe;
 proId: string;
  message = '';
  subs1: Subscription;
  selectedcategory;
  propoids;
  checked = false;
  isloading =  false;
  url;
  bio: string ='NOTBIO';
  Fournisseur: any[] = [];
  TstCheck = 0;
  constructor(private services: ServicesService , private route: ActivatedRoute, private  routes: Router,
    @Inject(DOCUMENT) private document: Document,
    private imageCompressor: ImageCompressorService, private snack: MatSnackBar ) { }
  ngOnInit() {
    this.getAllFourni();
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.postForm = new FormGroup({
      state: new FormControl(null, {validators: [Validators.required]}),
      category: new FormControl(null, {
        validators: [Validators.required]
      }),
      title: new FormControl(null, {
      }),
      titlearab: new FormControl(null, {

      }),
      titleeng: new FormControl(null, {
      }),
      forni: new FormControl(null,{}),
      descreption: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
         asyncValidators: [mimeType]
      }),
      pricev: new FormControl(null, {
        validators: [ Validators.maxLength(8)]
      }),
      pricea: new FormControl(null, {
        validators: [Validators.maxLength(8)]
      }),
      pricep: new FormControl(null, {
        validators: [Validators.maxLength(8)]
      }),
      poids: new FormControl(null, {
      }),
      quantity: new FormControl(null, {
        validators: [Validators.maxLength(8)]
      }),
      ciel: new FormControl(null, {
        validators: [Validators.maxLength(8)]
      }),
      min: new FormControl(null, {
        validators: [Validators.maxLength(8)]
      }),
    });
    this.services.getCategories();
    this.subs = this.services.emitcategory().subscribe(data => {
      this.Category = data;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) =>  {
      if (paramMap.has('proId')) {
        this.mode = 'edit';
        this.proId = paramMap.get('proId');
        this.services.getsinglepro(this.proId).subscribe(proData => {
          this.Produit = {
            id: proData[0].product_id,
            catid: proData[0].category_id,
            title: proData[0].title,
            titlearab: proData[0].title_arab,
            titleengalish: proData[0].title_eng,
            descreption: proData[0].descreption,
            image: proData[0].image,
            price: proData[0].price,
            prixa: proData[0].priceAchette,
            prixp: proData[0].pricePromo,
            poids: proData[0].poids,
            pricepoids: proData[0].pricepoids,
            id_forni: proData[0].id_forni,
            quantity: proData[0].quantity,
            Libele: proData[0].titleFr,
            catId: proData[0].cat_id,
            state: proData[0].state,
            ciel: proData[0].Ciel,
            min: proData[0].min
          }
          this.propoids = this.Produit.poids;
          this.selectedcategory = this.Produit.Libele;
          for(let i = 0 ; i< this.Category.length ; i++) {
            if(this.Category[i].id == this.Produit.catid) {
              this.titelefr = this.Category[i].titlefr;
              this.titlearabe = this.Category[i].titlearab;
            }
          }


           if(this.titelefr == 'null') {
            this.selectedcategory = this.titlearabe;
          }else{
            this.selectedcategory = this.titelefr;
          }
          this.postForm.setValue({
            category: this.Produit.catid,
            forni: this.Produit.id_forni,
            title : this.Produit.title !== 'null' ? this.Produit.title : '',
            titlearab: this.Produit.titlearab !== 'null' ? this.Produit.titlearab : '',
            titleeng: this.Produit.titleengalish !== 'null' ? this.Produit.titleengalish : '',
            descreption: this.Produit.descreption !== 'null' ? this.Produit.descreption : '' ,
            image: this.Produit.image,
            pricev: this.Produit.price,
            pricea: this.Produit.prixa,
            pricep: this.Produit.prixp,
            poids: this.Produit.poids !== 'null' ? this.Produit.poids : '',
            quantity: this.Produit.quantity,
            state: this.Produit.state,
            ciel: this.Produit.ciel,
            min: this.Produit.min
          });
        });

      } else {
        this.mode = 'created';
        this.proId = null;
      }
    });
    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      if (data[0].Role == 'super admin' || data[0].Role == 'admin') {
        return;
      } else {
        this.routes.navigate(['/Authentifications']);
      }
    }else {
      this.routes.navigate(['/Authentifications']);
    }
  }
  getAllFourni() {
    this.services.get_all_fournisseur().subscribe(data => {
      this.Fournisseur = data.data;
    })
  }
  testChecked(e) {
    e.checked === true ? this.TstCheck = 1 : this.TstCheck = 0;
  }
  save() {
    if (this.postForm.invalid) {
      return;
    } else {
      const catid = this.postForm.value.category;
      const quantity = this.postForm.value.quantity;
      const state = this.bio;
      if (this.mode === 'edit') {
        this.services.updateProducts(this.proId,this.propoids, catid, this.postForm.value.title?this.postForm.value.title:null, this.postForm.value.titlearab?this.postForm.value.titlearab:null, this.postForm.value.titleeng?this.postForm.value.titleeng:null, this.postForm.value.descreption,
          this.dropzone_image ? this.dropzone_image : null, this.postForm.value.pricev,this.postForm.value.pricea?this.postForm.value.pricea : 0,this.postForm.value.pricep, this.postForm.value.poids, quantity, state,
          this.postForm.value.ciel?this.postForm.value.ciel:0, this.postForm.value.min?this.postForm.value.min:0,
          this.postForm.value.forni ? this.postForm.value.forni : 0, this.TstCheck);
      } else {
        this.isloading = true;
        const catId = this.postForm.value.category;
        const quantitys = this.postForm.value.quantity;
        const status = this.bio;
        this.services.addproduct(catId, this.postForm.value.title?this.postForm.value.title:null, this.postForm.value.titlearab?this.postForm.value.titlearab:null, this.postForm.value.titleeng?this.postForm.value.titleeng:null,
          this.postForm.value.descreption,
          // this.postForm.value.image,
          this.dropzone_image,
         this.postForm.value.pricev,this.postForm.value.pricea ? this.postForm.value.pricea : 0,this.postForm.value.pricep, this.postForm.value.poids, quantitys, status, this.postForm.value.ciel?this.postForm.value.ciel:0,
          this.postForm.value.min?this.postForm.value.min:0, this.postForm.value.forni? this.postForm.value.forni : 0, this.TstCheck);
        this.services.getProduct();
        this.message = 'your products was added succesfully move to next etape bellow';
      }
      setTimeout(()=>{this.isloading = false;this.postForm.reset()},3000);
    }
  }
  onchangeimage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.imagepreview = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }
  check(event){
    this.checked = event.checked;
  }
  checkBio(event) {
    event.checked === true ? this.bio = 'BIO' : this.bio = 'NOTBIO';
  }
  onSelect(event) {
    if (event.addedFiles !== []) {
      this.dropzone_image = event.addedFiles;
      this.files.push(...event.addedFiles);
      this.files.forEach(async (file: File) => {
        if (file.type === 'image/jpeg' ||  file.type === 'image/jpg' || file.type === 'image/png' ) {
          const config: CompressorConfig = { orientation: 1, ratio: 50, quality: 50, enableLogs: true };
          const compressedFile: File = await this.imageCompressor.compressFile(file, config);
          this.dropzone_image = compressedFile;
        } else {
          this.snack.open('this is not a image file please make sur you upload a image file', 'x', { panelClass: 'error', verticalPosition: 'top', duration: 2000 });
        }

      });
    } else {
      this.snack.open('this is not a image file please make sur you upload a image file', 'x', { panelClass: 'error', verticalPosition: 'top', duration: 2000 });
    }
  }
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);

  }
  goToprods() {
    this.routes.navigate(['/dashboard/all_products']);
  }
  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
      // this.subs1.unsubscribe();
    }
  }

}
