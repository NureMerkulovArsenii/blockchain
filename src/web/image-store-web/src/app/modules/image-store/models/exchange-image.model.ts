import { SafeUrl } from "@angular/platform-browser";
import { ExchangeRequest } from "src/app/core/models/exchange-request.model";

export interface ExchangeImage extends ExchangeRequest {
    image1: SafeUrl;
    image2: SafeUrl;
    id: string;
}