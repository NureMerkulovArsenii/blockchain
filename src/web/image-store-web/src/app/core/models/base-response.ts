export interface BaseResponseModel<T> {
    isSuccess: boolean;
    message: string;
    data: T;    
}