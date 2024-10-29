import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { DialogData } from '../models/dialog-data.model';

@Component({
  selector: 'app-exchange-modal',
  templateUrl: './exchange-modal.component.html',
  styleUrls: ['./exchange-modal.component.scss']
})
export class ExchangeModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ExchangeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<number, null>,

  ) { }

  ngOnInit(): void {

  }



}
