import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageListComponent } from './image-list/image-list.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { PublicImagesComponent } from './public-images/public-images.component';

const routes: Routes = [
  { path: 'public', component: PublicImagesComponent },
  { path: 'upload', component: UploadImageComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageStoreRoutingModule { }
