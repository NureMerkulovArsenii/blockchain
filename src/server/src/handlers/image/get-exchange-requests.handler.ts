import { getExchangeRequests } from "../../clients/smart-contract-client/smart-contract.client";
import { ExchangeRequest } from "../../models/exchange-request.model";


export async function getUserExchangeRequests(username: string): Promise<ExchangeRequest[]> {
    const exchangeRequests: ExchangeRequest[] = await getExchangeRequests(username);

    return exchangeRequests;
}