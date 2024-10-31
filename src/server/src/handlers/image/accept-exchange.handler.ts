import { exchangeImages } from "../../clients/smart-contract-client/smart-contract.client";
import { ExchangeRequest } from "../../models/exchange-request.model";


export async function acceptExchangeRequestHandle(model: ExchangeRequest): Promise<void> {
    await exchangeImages(model);
}
