import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageService } from 'src/app/core/services/image.service';
import { ImageListItem } from '../models/image-list-item.model';

@Component({
  selector: 'app-my-images',
  templateUrl: './my-images.component.html',
  styleUrls: ['./my-images.component.scss']
})
export class MyImagesComponent implements OnInit {
  images!: Observable<ImageListItem[]>;

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.images = this.imageService.getMyImages();
  }

}
