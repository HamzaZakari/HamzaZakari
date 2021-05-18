import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {mimeType} from '../addproduct/mime-type.validator';
import {AuthservisesService} from '../../authservises.service';

@Component({
  selector: 'app-newbannerimages',
  templateUrl: './newbannerimages.component.html',
  styleUrls: ['./newbannerimages.component.css']
})
export class NewbannerimagesComponent implements OnInit {
  imagepreview: string | ArrayBuffer;
  postForm: FormGroup;
  constructor(private services: AuthservisesService) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]
      }),
    });
  }
  save() {
    if (this.postForm.invalid) {
      return;
    }
    this.services.bannerimages(this.postForm.value.image);
    console.log(this.postForm.value);
    this.postForm.reset();
    this.postForm.setValue({
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
}
