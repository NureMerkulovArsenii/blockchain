import { logoutUser } from "../../clients/smart-contract-client/smart-contract.client";

export async function logout(username: string): Promise<void> {
    await logoutUser(username);    
}