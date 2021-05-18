import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServicesService} from '../../AdminArea/services/services.service';
import {Router} from '@angular/router';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-pupusmodule',
  templateUrl: './pupusmodule.component.html',
  styleUrls: ['./pupusmodule.component.css']
})
export class PupusmoduleComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<PupusmoduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData , private serv: ServicesService , private route: Router) {}

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
 givetime(){
   this.dialogRef.close();
 }
}
