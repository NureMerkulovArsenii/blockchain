import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ImageService } from 'src/app/core/services/image.service';
import { DialogData } from '../models/dialog-data.model';

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

    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onload = () => {
      this.uploadedImageUrl = reader.result;
    };
   
  }

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

    this.imageService.uploadImage(uploadModel).subscribe({
      next: (result: any) => {
        console.log(result);
        this.toastr.success();
        this.dialogRef.close();
      }
    });
  }
}
