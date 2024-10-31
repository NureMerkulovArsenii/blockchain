import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/core/services/image.service';
import { ImageListItem } from '../models/image-list-item.model';
import { UploadImageComponent } from '../upload-image/upload-image.component';
import { DialogData } from '../models/dialog-data.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-images',
  templateUrl: './my-images.component.html',
  styleUrls: ['./my-images.component.scss']
})
export class MyImagesComponent implements OnInit {

  @Output() imageSelected = new EventEmitter<ImageListItem>();
  
  images!: Observable<ImageListItem[]>;

  constructor(
    private imageService: ImageService,
    private readonly dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.images = this.imageService.getMyImages();
  }

  uploadImage() {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      data: { isEdit: false } as DialogData<null, null>,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  onCardClick(imageItem: ImageListItem): void {
    this.imageSelected.emit(imageItem);  
  }

  onImageSelected(cid: ImageListItem) {
    this.imageSelected.emit(cid);
  }

}
