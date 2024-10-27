import { buildClient, loginUser } from "../../clients/smart-contract-client/smart-contract.client";
import { createJwtToken } from "../../helpers/jwt.helper";
import { BaseResponseModel } from "../../models/base-response.model";
import { AuthRequestModel } from "../../models/request/auth-request.model";
import { AuthResponseModel } from "../../models/response/auth-reponse.model";

export async function login(model: AuthRequestModel): Promise<BaseResponseModel<AuthResponseModel>> {

    console.log(model);

    const authResult = await loginUser(model.username, model.password);
    if(!authResult){
        return {
            data: null,
            isSuccess: false,
            message: "Invalid login"
        }
    }

    const token = createJwtToken({ username: model.username });
    const res =  {
        data: {
            accessToken: token
        },
        isSuccess: true,
        message: null
    }

    return res;    
}