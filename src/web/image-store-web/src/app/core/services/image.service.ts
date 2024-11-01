import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageListItem } from 'src/app/modules/image-store/models/image-list-item.model';
import { environment } from 'src/environment/environment';
import { UploadImageRequest } from '../models/upload-image.model';
import { IpfsFile } from '../models/ipfs-file.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseUrl: string = environment.apiBaseUrl + '/images';

  constructor(private httpClient: HttpClient) { }

  getAllPublicImages() : Observable<ImageListItem[]> {
    return this.httpClient.get<ImageListItem[]>(this.baseUrl + '/get-all');
  }

  getMyImages() : Observable<ImageListItem[]> {
    return this.httpClient.get<ImageListItem[]>(this.baseUrl + '/my-images');
  }

  uploadImage(image: FormData) : Observable<Object> {
    return this.httpClient.post(this.baseUrl + '/upload', image);
  }

  getImage(imageId: string) : Observable<IpfsFile> {
    return this.httpClient.get<IpfsFile>(this.baseUrl + '/get/' + imageId);
  }
}
