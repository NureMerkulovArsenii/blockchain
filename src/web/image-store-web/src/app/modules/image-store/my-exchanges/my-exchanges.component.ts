import { Component, OnInit } from '@angular/core';
import { ExchangeService } from 'src/app/core/services/exchange.service';
import { ImageService } from 'src/app/core/services/image.service';
import { ExchangeImage } from '../models/exchange-image.model';
import { ImageHelper } from 'src/app/core/helpers/image.helper';
import { ExchangeRequest } from 'src/app/core/models/exchange-request.model';
import { IpfsFile } from 'src/app/core/models/ipfs-file.model';

@Component({
  selector: 'app-my-exchanges',
  templateUrl: './my-exchanges.component.html',
  styleUrls: ['./my-exchanges.component.scss']
})
export class MyExchangesComponent implements OnInit {

  exchangeRequests: ExchangeImage[] = [];

  constructor(
    private imageService: ImageService,
    private exchangeService: ExchangeService,
    private imageHelper: ImageHelper
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.exchangeService.getUserExchanges().subscribe((data) => {

      data.forEach((exchangeRequest: ExchangeRequest) => {
        let exchangeRequestWithImages: ExchangeImage = exchangeRequest as ExchangeImage;
        exchangeRequestWithImages.id = exchangeRequest.exchangerLogin + exchangeRequest.imageHashToExchange;

        this.imageService.getImage(exchangeRequest.imageHashToExchange).subscribe((image: IpfsFile) => {
          exchangeRequestWithImages.image1 = this.imageHelper.base64ToSafeUrl(image.file);
        });

        this.imageService.getImage(exchangeRequest.imageHashForExchange).subscribe((image: IpfsFile) => {
          exchangeRequestWithImages.image2 = this.imageHelper.base64ToSafeUrl(image.file);
        });

        this.exchangeRequests.push(exchangeRequestWithImages);

      });

    });

  }

  acceptExchange(exchangeRequest: ExchangeRequest) {
    const request: ExchangeRequest = {
      exchangerLogin: exchangeRequest.exchangerLogin,
      imageHashToExchange: exchangeRequest.imageHashToExchange,
      imageHashForExchange: exchangeRequest.imageHashForExchange,
      ownerLogin: exchangeRequest.ownerLogin
    };

    this.exchangeService.acceptExchange(request).subscribe(() => {
      this.refresh();
    });
  }

  rejectExchange(exchangeRequest: ExchangeRequest) {
    const request: ExchangeRequest = {
      exchangerLogin: exchangeRequest.exchangerLogin,
      imageHashToExchange: exchangeRequest.imageHashToExchange,
      imageHashForExchange: exchangeRequest.imageHashForExchange,
      ownerLogin: exchangeRequest.ownerLogin
    };

    this.exchangeService.cancelExchange(request).subscribe(() => {
      this.refresh();
    });
  }

}
