import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {mimeType} from '../addproduct/mime-type.validator';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ServicesService} from '../../services/services.service';
import {Products} from '../../Models/products';
import {Multiimage} from '../../Models/multiimage';
import {Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-multipeimages',
  templateUrl: './multipeimages.component.html',
  styleUrls: ['./multipeimages.component.css']
})
export class MultipeimagesComponent implements OnInit, OnDestroy {
  imagepreview: string | ArrayBuffer;
  postForm: FormGroup;
  prodId: string;
  Produit: Multiimage;
  subs1: Subscription;
  url;
  constructor(private services: ServicesService , private route: ActivatedRoute,@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    if(document.location.hostname =='localhost') {
      this.url = document.location.protocol +'//'+ document.location.hostname +':3000/images/';
    }else {
      this.url = document.location.protocol +'//'+ document.location.hostname +'/herbo/images/';
    }
    this.postForm = new FormGroup({
      produit: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      }),
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('prodId')) {
        this.prodId = params.get('prodId');
      }
     this.subs1 = this.services.getsinglepro(this.prodId).subscribe(proData => {
        this.Produit = {
          prod_id: proData[0].product_id,
          pro_name: proData[0].title,
          arabe_name: proData[0].title_arab,
          images: null
        };
        console.log(this.Produit,proData);
        var title;
        if(this.Produit.pro_name == 'null') {
          title = this.Produit.arabe_name;
        }else{
          title = this.Produit.pro_name;
        }
        this.postForm.setValue({
          produit: title,
          image: null
        });
      });
    });
  }
  save() {
    if (this.postForm.invalid) {
      return;
    }
    this.services.addimages(this.Produit.prod_id , this.postForm.value.image);
    console.log(this.postForm.value);
    this.postForm.reset();
    this.postForm.setValue({
      produit: this.Produit.pro_name,
      image: null
    });
  }
  onchangeimage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagepreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  ngOnDestroy(): void {
    this.subs1.unsubscribe();
  }
}
