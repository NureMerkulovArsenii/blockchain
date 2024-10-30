import { createExchangeRequest, getExchangeRequests } from "../../clients/smart-contract-client/smart-contract.client";
import { ExchangeRequest } from "../../models/exchange-request.model";


export async function getUserExchangeRequests(model: ExchangeRequest): Promise<void> {
    await createExchangeRequest(model);
}