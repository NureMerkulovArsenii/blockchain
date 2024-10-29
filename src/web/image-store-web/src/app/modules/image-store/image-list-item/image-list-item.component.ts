import { Component, Input } from '@angular/core';
import { ImageListItem } from '../models/image-list-item.model';
import { SafeUrl } from '@angular/platform-browser';
import { ImageHelper } from 'src/app/core/helpers/image.helper';
import { MatDialog } from '@angular/material/dialog';
import { ExchangeModalComponent } from '../exchange-modal/exchange-modal.component';
import { DialogData } from '../models/dialog-data.model';

@Component({
  selector: 'app-image-list-item',
  templateUrl: './image-list-item.component.html',
  styleUrls: ['./image-list-item.component.scss']
})
export class ImageListItemComponent {
  @Input() imageItem!: ImageListItem; // Input property to receive image item data
  uploadedImageUrl!: SafeUrl; // Safe URL for the image preview

  constructor(
    private imageService: ImageHelper,
    private readonly dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.uploadedImageUrl = this.imageService.base64ToSafeUrl(this.imageItem.image);
  }

  requestExchange(cid: string): void {
    const dialogRef = this.dialog.open(ExchangeModalComponent, {
      data: {data: cid, isEdit: false} as DialogData<string, null>,
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  copyToClipboard(cid:string): void {
  }
}
