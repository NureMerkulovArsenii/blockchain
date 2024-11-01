import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageListItem } from 'src/app/modules/image-store/models/image-list-item.model';
import { environment } from 'src/environment/environment';
import { UploadImageRequest } from '../models/upload-image.model';
import { IpfsFile } from '../models/ipfs-file.model';
import { UpdateImageRequest } from '../models/update-image-request.model';

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

  uploadImage(image: FormData) : Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/upload', image);
  }

  updateImage(request:UpdateImageRequest): Observable<void> {
    return this.httpClient.patch<void>(this.baseUrl + '/update', request);
  }

  deleteImage(imageId: string): Observable<void> {
    return this.httpClient.delete<void>(this.baseUrl + '/delete/' + imageId);
  }

  getImage(imageId: string) : Observable<IpfsFile> {
    return this.httpClient.get<IpfsFile>(this.baseUrl + '/get/' + imageId);
  }


}
