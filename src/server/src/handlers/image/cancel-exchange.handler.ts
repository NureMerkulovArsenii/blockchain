import { cancelExchangeRequest } from "../../clients/smart-contract-client/smart-contract.client";
import { ExchangeRequest } from "../../models/exchange-request.model";


export async function cancelExchangeRequestHandle(model: ExchangeRequest): Promise<void> {
    await cancelExchangeRequest(model);
}
