import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { AuthModel, AuthResponseModel } from '../models/auth.model';
import { Observable } from 'rxjs';
import { BaseResponseModel } from '../models/base-response';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl : string = environment.apiBaseUrl + '/auth';

  constructor(private httpClient: HttpClient) { }

  login(model: AuthModel) : Observable<BaseResponseModel<AuthResponseModel>> {
    return this.httpClient.post<BaseResponseModel<AuthResponseModel>>(`${this.baseUrl}/login`, model);
  }

  register(model: AuthModel) : Observable<BaseResponseModel<AuthResponseModel>> {
    return this.httpClient.post<BaseResponseModel<AuthResponseModel>>(`${this.baseUrl}/register`, model);
  }
  
  logout() {
    localStorage.removeItem('access_token');
  }
}
