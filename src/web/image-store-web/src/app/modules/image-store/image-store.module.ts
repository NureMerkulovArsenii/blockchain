import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageStoreRoutingModule } from './image-store-routing.module';
import { ImageListItemComponent } from './image-list-item/image-list-item.component';
import { ImageListComponent } from './image-list/image-list.component';
import { PublicImagesComponent } from './public-images/public-images.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MyImagesComponent } from './my-images/my-images.component';
import { MatIconModule } from '@angular/material/icon';
import { ExchangeModalComponent } from './exchange-modal/exchange-modal.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    ImageListComponent,
    ImageListItemComponent,
    PublicImagesComponent,
    UploadImageComponent,
    MyImagesComponent,
    ExchangeModalComponent
  ],
  imports: [
    CommonModule,
    ImageStoreRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class ImageStoreModule { }
