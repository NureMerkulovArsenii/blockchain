import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageListItem } from '../models/image-list-item.model';
import { ImageService } from 'src/app/core/services/image.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit {

  userName: string | null = null;
  
  images!: Observable<ImageListItem[]>;

  constructor(private imageService: ImageService) {

  }
  ngOnInit(): void {
    this.userName = localStorage.getItem('username');
    this.images = this.imageService.getAllPublicImages();
  }
}
