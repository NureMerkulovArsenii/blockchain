import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageStoreRoutingModule } from './image-store-routing.module';
import { ImageListItemComponent } from './image-list-item/image-list-item.component';
import { ImageListComponent } from './image-list/image-list.component';
import { PublicImagesComponent } from './public-images/public-images.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ImageListComponent,
    ImageListItemComponent,
    PublicImagesComponent,
    UploadImageComponent
  ],
  imports: [
    CommonModule,
    ImageStoreRoutingModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ImageStoreModule { }
