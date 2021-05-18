import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthservisesService} from '../authservises.service';
import {mimeType} from '../new/addproduct/mime-type.validator';
import {NewserviceforproductService} from '../allproduct/newserviceforproduct.service';
import {ServicesService} from '../services/services.service';
import {Products} from '../Models/products';
import {Subscription} from 'rxjs';
import {Category} from '../Models/category';

@Component({
  selector: 'app-slider-principale-image',
  templateUrl: './slider-principale-image.component.html',
  styleUrls: ['./slider-principale-image.component.css']
})
export class SliderPrincipaleImageComponent implements OnInit {

  imagepreview: string | ArrayBuffer;
  postForm: FormGroup;
  Produits: Products[] = [];
  Produitsf: Products[] = [];
  Category: Category[] = [];
  Categoryf: Category[] = [];
  subs: Subscription;
  boId = 0;
  constructor(private services: AuthservisesService, private serv: ServicesService) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      }),
      prod: new FormControl(null,{}),
      cat: new FormControl(null,{})
    });
    this.getAllprod();
    this.getCat();
  }
  fliterprod(id, boutique_id) {
    this.boId = boutique_id;
    const data = this.Produitsf.filter(key => key.catid === id);
    this.Produits = data;
}
  getAllprod() {
    this.serv.getProduct();
    this.subs = this.serv.emitDatapro().subscribe(data => {
      this.Produits = data;
      this.Produitsf = data;
    })

  }
  getCat(){
    this.serv.getCategories();
    this.subs = this.serv.emitcategory().subscribe(data => {
      this.Category = data;
      this.Categoryf = data;
    })
  }
  save() {
    if (this.postForm.invalid) {
      return;
    }
    this.services.Sliderimages(this.postForm.value.image, this.postForm.value.prod, this.postForm.value.cat, this.boId);
    console.log(this.postForm.value);
    this.postForm.reset();
    this.postForm.setValue({
      image: null,
      prod: 0,
      cat: 0
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

}
