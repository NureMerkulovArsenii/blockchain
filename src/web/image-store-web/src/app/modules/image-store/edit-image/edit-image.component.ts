import { Component, Inject, OnInit } from '@angular/core';
import { DialogData } from '../models/dialog-data.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExchangeModalComponent } from '../exchange-modal/exchange-modal.component';
import { ImageListItem } from '../models/image-list-item.model';
import { ImageService } from 'src/app/core/services/image.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateImageRequest } from 'src/app/core/models/update-image-request.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss']
})
export class EditImageComponent implements OnInit {
  editImageForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<ImageListItem, null>,
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.editImageForm = this.formBuilder.group({
      visiblePublicly: [this.data.data?.visiblePublicly],
      canBeExchanged: [this.data.data?.canBeExchanged]
    });
  }


  updateImage() {
    const request: UpdateImageRequest = {
      cid: this.data.data!.imageCid,
      isForExchange: this.editImageForm.get('canBeExchanged')?.value,
      isVisiblePublicly: this.editImageForm.get('visiblePublicly')?.value
    };

    this.imageService.updateImage(request).subscribe({
      next: (result) => {
        this.dialogRef.close(this.data.data);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error('Error updating image');
      }
    });

  }
  

}
