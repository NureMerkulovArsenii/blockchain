import { Component, Input } from '@angular/core';
import { ImageListItem } from '../models/image-list-item.model';
import { SafeUrl } from '@angular/platform-browser';
import { ImageHelper } from 'src/app/core/helpers/image.helper';

@Component({
  selector: 'app-image-list-item',
  templateUrl: './image-list-item.component.html',
  styleUrls: ['./image-list-item.component.scss']
})
export class ImageListItemComponent {
  @Input() imageItem!: ImageListItem; // Input property to receive image item data
  uploadedImageUrl!: SafeUrl; // Safe URL for the image preview

  constructor(private imageService: ImageHelper) {}

  ngOnInit(): void {
    this.uploadedImageUrl = this.imageService.base64ToSafeUrl(this.imageItem.image);
  }

  requestExchange(): void {
    // Logic for handling exchange request goes here
    console.log(`Requesting exchange for image ID: ${this.imageItem.imageCid}`);
    // You can implement the exchange request logic or service call here
  }
}
