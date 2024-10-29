import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UploadImageRequest } from 'src/app/core/models/upload-image.model';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  uploadImageForm!: FormGroup;
  uploadedImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private imageService: ImageService

  ) { }

  ngOnInit(): void {
    this.uploadImageForm = this.formBuilder.group({
      file: [null, Validators.required],
      visiblePublicly: [true],
      canBeExchanged: [false],
      imageName: [''] // You can set a default or use an input to get this
    });
  }

  onImageFileChange(event: any): void {
    const file = event.target.files[0];
    this.uploadImageForm.patchValue({ file: file });

    console.log(event.target.files);

    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onload = () => {
      this.uploadedImageUrl = reader.result; // Display the image
    };
   
  }

  uploadImage(): void {
    // const uploadModel: UploadImageRequest = {
    //   isVisiblePublicly: this.uploadImageForm.value.visiblePublicly,
    //   isForExchange: this.uploadImageForm.value.canBeExchanged,
    //   fileName: this.uploadImageForm.value.imageName,
    //   file: this.uploadedImageUrl
    // };

    //send this as formdata
    const uploadModel = new FormData();
    uploadModel.append('file', this.uploadImageForm.value.file);
    uploadModel.append('isVisiblePublicly', this.uploadImageForm.value.visiblePublicly);
    uploadModel.append('isForExchange', this.uploadImageForm.value.canBeExchanged);
    uploadModel.append('fileName', this.uploadImageForm.value.imageName);

    console.log(this.uploadImageForm.value.file);
    console.log(this.uploadedImageUrl);


    this.imageService.uploadImage(uploadModel).subscribe({
      next: (result: any) => {
        this.uploadedImageUrl = result.data; // Assume result.data contains the URL of the uploaded image
      },
      error: () => {
        this.toastr.error();
      },
      complete: () => {
        this.toastr.success();
      }
    });
  }

}
