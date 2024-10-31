import { createExchangeRequest } from "../../clients/smart-contract-client/smart-contract.client";
import { ExchangeRequest } from "../../models/exchange-request.model";


export async function createExchangeRequestHandle(model: ExchangeRequest): Promise<void> {
    await createExchangeRequest(model);
}