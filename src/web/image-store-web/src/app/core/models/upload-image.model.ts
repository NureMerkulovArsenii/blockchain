export interface UploadImageRequest {
    file: string | ArrayBuffer | null;
    fileName: string
    isVisiblePublicly: boolean;
    isForExchange: boolean;
}