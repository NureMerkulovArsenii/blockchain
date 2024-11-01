import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageListItem } from '../models/image-list-item.model';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-public-images',
  templateUrl: './public-images.component.html',
  styleUrls: ['./public-images.component.scss']
})
export class PublicImagesComponent implements OnInit {

  images!: Observable<ImageListItem[]>;
  activeTabIndex: number = 0;

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    this.images = this.imageService.getAllPublicImages();
    const savedTabIndex = localStorage.getItem('activeTabIndex');
    if (savedTabIndex !== null) {
      this.activeTabIndex = +savedTabIndex;
    }
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
    localStorage.setItem('activeTabIndex', this.activeTabIndex.toString());
  }

}
