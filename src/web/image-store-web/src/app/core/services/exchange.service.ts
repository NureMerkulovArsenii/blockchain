import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ExchangeRequest } from '../models/exchange-request.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  baseUrl: string = environment.apiBaseUrl + '/exchange';

  constructor(private httpClient: HttpClient) { }

  getUserExchanges() : Observable<ExchangeRequest[]> {
    return this.httpClient.get<ExchangeRequest[]>(this.baseUrl + '/my');
  }

  createExchange(request: ExchangeRequest) : Observable<Object> {
    return this.httpClient.post(this.baseUrl + '/create', request);
  }

  cancelExchange(request: ExchangeRequest) : Observable<any> {
    return this.httpClient.post(this.baseUrl + '/cancel', request);
  }

  acceptExchange(request: ExchangeRequest) : Observable<any> {
    return this.httpClient.post(this.baseUrl + '/accept', request);
  }
}
