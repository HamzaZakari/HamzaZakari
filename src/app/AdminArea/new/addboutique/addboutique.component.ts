import {Component, Inject, OnInit} from '@angular/core';
import {Category} from '../../Models/category';
import {FormControl, FormGroup} from '@angular/forms';
import {CategoryServService} from '../../services/cat_services/category-serv.service';
import {ServicesService} from '../../services/services.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {mimeType} from '../addproduct/mime-type.validator';

@Component({
  selector: 'app-addboutique',
  templateUrl: './addboutique.component.html',
  styleUrls: ['./addboutique.component.css']
})
export class AddboutiqueComponent implements OnInit {
  mode = 'created';
  catid: string;
  imagepreview: string;
  category: Category;
  postForm: FormGroup;
  url;
  Fournisseur: any[] = [];
  constructor(private services: CategoryServService , private catservices: ServicesService  , private route: ActivatedRoute,
              private rou: Router, @Inject(DOCUMENT) private document: Document ) { }
  ngOnInit() {
    this.getAllFourni();
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.postForm = new FormGroup({
      titlefr: new FormControl(null, {

      }),
      titleAng: new FormControl(null, {
      }),
      titlearab: new FormControl(null, {
      }),
      forni: new FormControl(null, {}),
      image: new FormControl(null, {
        asyncValidators: [mimeType]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) =>  {
      if (paramMap.has('catId')) {
        this.mode = 'edit';
        this.catid = paramMap.get('catId');
        this.catservices.getsinglecat(this.catid).subscribe(data => {
          this.category = {
            id: data[0].cat_id,
            titlefr: data[0].titleFr,
            titleAng: data[0].titleAng,
            titlearab: data[0].titleArab,
            id_forni: data[0].id_forni,
            image: data[0].imagecat
          };
          this.postForm.setValue({
            titlefr: this.category.titlefr,
            titleAng : this.category.titleAng,
            titlearab: this.category.titlearab,
            forni: this.category.id_forni,
            image: this.category.image,
          });
          console.log('hahiya data', data);
        });
      } else {
        this.mode = 'created';
        this.catid = null;
      }
    });

    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      if (data[0].Role == 'super admin' || data[0].Role == 'admin') {
        return;
      } else {
        this.rou.navigate(['/Authentifications']);
      }
    }else {
      this.rou.navigate(['/Authentifications']);
    }

  }
  getAllFourni() {
    this.catservices.get_all_fournisseur().subscribe(data => {
      this.Fournisseur = data.data;
    })
  }
  savecat() {
    if (this.postForm.invalid) {
      return;
    }
    if (this.mode === 'edit') {
      // // console.log(this.catid ,this.postForm.value.titlefr ,this.postForm.value.titleAng,this.postForm.value.titlearab,this.postForm.value.image, 'iiiiiiiimmmmmmmmaaaaaggggggeeee');
      // this.services.thisthis.catid ,this.postForm.value.titlefr?this.postForm.value.titlefr:null , this.postForm.value.titleAng?this.postForm.value.titleAng:null,
      //   this.postForm.value.titlearab?this.postForm.value.titlearab:null , this.postForm.value.image);
    } else {
      console.log(this.postForm.value);
      this.services.addBotique(this.postForm.value.titlefr?this.postForm.value.titlefr:null , this.postForm.value.titleAng?this.postForm.value.titleAng:null,
        this.postForm.value.titlearab?this.postForm.value.titlearab:null ,this.postForm.value.forni?this.postForm.value.forni : null, this.postForm.value.image);
    }
    this.postForm.reset();
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
    // console.log(this.imagepreview);
  }


}
