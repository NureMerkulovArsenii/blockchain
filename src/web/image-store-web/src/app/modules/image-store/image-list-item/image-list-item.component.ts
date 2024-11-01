import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageListItem } from '../models/image-list-item.model';
import { SafeUrl } from '@angular/platform-browser';
import { ImageHelper } from 'src/app/core/helpers/image.helper';
import { MatDialog } from '@angular/material/dialog';
import { ExchangeModalComponent } from '../exchange-modal/exchange-modal.component';
import { DialogData } from '../models/dialog-data.model';
import { EditImageComponent } from '../edit-image/edit-image.component';

@Component({
  selector: 'app-image-list-item',
  templateUrl: './image-list-item.component.html',
  styleUrls: ['./image-list-item.component.scss']
})
export class ImageListItemComponent {

  @Output() imageSelected = new EventEmitter<ImageListItem>();

  @Input() imageItem!: ImageListItem;
  @Input() canExchange: boolean = true;
  @Input() isMyImage: boolean = false;

  uploadedImageUrl!: SafeUrl;

  constructor(
    private imageHelper: ImageHelper,
    private readonly dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.uploadedImageUrl = this.imageHelper.base64ToSafeUrl(this.imageItem.image);
  }

  requestExchange(cid: string): void {
    const dialogRef = this.dialog.open(ExchangeModalComponent, {
      data: {data: this.imageItem, isEdit: false} as DialogData<ImageListItem, null>,
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  editImage(): void {
    const dialogRef = this.dialog.open(EditImageComponent, {
      data: {data: this.imageItem, isEdit: true} as DialogData<ImageListItem, null>,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.imageItem.canBeExchanged = result.canBeExchanged;
        this.imageItem.visiblePublicly = result.visiblePublicly;        
      }
      
    });
  }

  onCardClick(imageItem: ImageListItem): void {
    this.imageSelected.emit(imageItem);  
  }
  
}
