import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {CategoryServService} from '../../services/cat_services/category-serv.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Category} from '../../Models/category';
import {ServicesService} from '../../services/services.service';
import {mimeType} from '../addproduct/mime-type.validator';
import {DOCUMENT} from '@angular/common';
import {PackserviceService} from '../../../OurSite/packs/pack/packservice.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css']
})
export class AddcategoryComponent implements OnInit {
mode = 'created';
catid: string;
imagepreview: string;
category: Category;
postForm: FormGroup;
url;
boutique: any[] = [];
  constructor(private services: CategoryServService , private catservices: ServicesService  , private route: ActivatedRoute, private packserv: PackserviceService
              ,private rou: Router, @Inject(DOCUMENT) private document: Document ) { }
  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.postForm = new FormGroup({
      boutique: new FormControl(null, {

      }),
      titlefr: new FormControl(null, {

      }),
      titleAng: new FormControl(null, {
      }),
      titlearab: new FormControl(null, {
      }),
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
            id_boutique:data[0].id_boutique,
            titlefr: data[0].titleFr,
            titleAng: data[0].titleAng,
            titlearab: data[0].titleArab,
            image: data[0].imagecat
          };
          this.postForm.setValue({
            boutique: this.category.id_boutique,
            titlefr: this.category.titlefr !== 'null' ? this.category.titlefr : '',
            titleAng : this.category.titleAng !== 'null' ? this.category.titleAng : '',
            titlearab: this.category.titlearab !== 'null' ? this.category.titlearab : '',
            image: this.category.image,
          });
        });
      } else {
        this.mode = 'created';
        this.catid = null;
      }
    });

    const data = JSON.parse(sessionStorage.getItem('Admin'));
    if(data) {
      if (data[0].Role == 'super admin' || data[0].Role == 'admin') {
        this.packserv.para_func().subscribe(data => {
          this.boutique = data.data;
        })
      } else {
        this.rou.navigate(['/Authentifications']);
      }
    }else {
      this.rou.navigate(['/Authentifications']);
    }

  }
  savecat() {
    if (this.postForm.invalid) {
      return;
    }
    if (this.mode === 'edit') {
      this.services.updatedcat('1',this.catid ,this.postForm.value.titlefr?this.postForm.value.titlefr:'null' , this.postForm.value.titleAng?this.postForm.value.titleAng:'null',
        this.postForm.value.titlearab?this.postForm.value.titlearab:'null',this.postForm.value.image);
    } else {
      console.log(this.postForm.value);
      this.services.addcategory('1',this.postForm.value.titlefr?this.postForm.value.titlefr:null , this.postForm.value.titleAng?this.postForm.value.titleAng:null,
        this.postForm.value.titlearab?this.postForm.value.titlearab:null , this.postForm.value.image);
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
  goToCat() {
    this.rou.navigate(['/dashboard/all_categorys']);
  }
}
