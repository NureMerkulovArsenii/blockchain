import { Component, Input, OnInit } from '@angular/core';
import { ImageListItem } from '../models/image-list-item.model';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent {
  @Input() images!: ImageListItem[] | null; // Input property to receive the list of images
}
