import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class ImageHelper {

    constructor(private sanitizer: DomSanitizer) { }

    public base64ToSafeUrl(base64String: string): SafeUrl {
        const imageUrl = `data:image/png;base64,${base64String}`;
        return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }

    public downloadFile = (data: Blob, fileName: string) => {
        const downloadedFile = new Blob([data], { type: data.type });
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        a.download = fileName;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = '_blank';
        a.click();
        document.body.removeChild(a);
    }
}