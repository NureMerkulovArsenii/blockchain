import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ImageService } from 'src/app/core/services/image.service';
import { DialogData } from '../models/dialog-data.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  uploadImageForm!: FormGroup;
  uploadedImageUrl: string | ArrayBuffer | null = null;

  isDragOver = false;

  constructor(
    public dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<null, null>,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer

  ) { }

  ngOnInit(): void {
    this.uploadImageForm = this.formBuilder.group({
      file: [null, Validators.required],
      visiblePublicly: [''],
      canBeExchanged: [''],
      imageName: ['']
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
      this.uploadedImageUrl = reader.result;
    };
   
  }

  // onImageFileChange(event: Event): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   this.processFile(file!);
  // }

  onImageDrop(event: any): void {
    this.isDragOver = false;
    const file = event.item?.getInput('file')?.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  private processFile(file: File | null): void {
    if (file) {
      this.uploadImageForm.patchValue({ file: file });

      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
      }
  
      reader.onload = () => {
        this.uploadedImageUrl = reader.result;
      };
    }
  }

  uploadImage(): void {
    const uploadModel = new FormData();
    uploadModel.append('file', this.uploadImageForm.value.file);
    uploadModel.append('isVisiblePublicly', this.uploadImageForm.value.visiblePublicly);
    uploadModel.append('isForExchange', this.uploadImageForm.value.canBeExchanged);
    uploadModel.append('fileName', this.uploadImageForm.value.imageName);

    console.log(this.uploadImageForm.value.file);
    console.log(this.uploadedImageUrl);


    this.imageService.uploadImage(uploadModel).subscribe({
      next: (result: any) => {
        console.log(result);
        this.toastr.success();
        this.dialogRef.close();
      }
    });
  }

}
