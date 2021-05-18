import { Component, OnInit } from '@angular/core';
import {MatBottomSheet , MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-ofers',
  templateUrl: './ofers.component.html',
  styleUrls: ['./ofers.component.css']
})
export class OfersComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<OfersComponent>) { }

  ngOnInit() {
  }
  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
