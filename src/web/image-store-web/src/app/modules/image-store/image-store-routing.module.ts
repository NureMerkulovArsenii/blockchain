import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicImagesComponent } from './public-images/public-images.component';

const routes: Routes = [
  { path: '', component: PublicImagesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageStoreRoutingModule { }
