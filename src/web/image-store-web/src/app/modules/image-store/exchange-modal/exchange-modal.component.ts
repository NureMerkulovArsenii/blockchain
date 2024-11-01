import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogData } from '../models/dialog-data.model';
import { ImageHelper } from 'src/app/core/helpers/image.helper';
import { SafeUrl } from '@angular/platform-browser';
import { ImageListItem } from '../models/image-list-item.model';
import { ExchangeService } from 'src/app/core/services/exchange.service';
import { ExchangeRequest } from 'src/app/core/models/exchange-request.model';

@Component({
  selector: 'app-exchange-modal',
  templateUrl: './exchange-modal.component.html',
  styleUrls: ['./exchange-modal.component.scss']
})
export class ExchangeModalComponent implements OnInit {

  uploadedImageUrl: SafeUrl | undefined;

  imageToExchangeUrl: SafeUrl | undefined;
  imageToExchangeItem!: ImageListItem;

  constructor(
    public dialogRef: MatDialogRef<ExchangeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ImageListItem, null>,
    private imageHelper: ImageHelper,
    private exchangeService: ExchangeService

  ) { }

  ngOnInit(): void {
    this.uploadedImageUrl = this.imageHelper.base64ToSafeUrl(this.data.data!.image);
  }

  onImageSelected(imageListItem: ImageListItem) {
    this.imageToExchangeItem = imageListItem;
    this.imageToExchangeUrl = this.imageHelper.base64ToSafeUrl(imageListItem.image);
  }

  selectImage() {
    this.imageToExchangeUrl = undefined;
  }

  requestExchange() {
    const requestModel: ExchangeRequest = {
      imageHashToExchange: this.data.data!.imageCid,
      imageHashForExchange: this.imageToExchangeItem.imageCid,
      ownerLogin: this.data.data!.username,
      exchangerLogin: this.imageToExchangeItem.username
    };
    this.exchangeService.createExchange(requestModel).subscribe(() => {
      next: this.dialogRef.close();
      error: (error:any) => console.log(error);
    });
  }
}
