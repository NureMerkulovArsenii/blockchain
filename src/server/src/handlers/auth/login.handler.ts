import { createJwtToken } from "../../helpers/jwt.helper";
import { BaseResponseModel } from "../../models/base-response.model";
import { AuthRequestModel } from "../../models/request/auth-request.model";
import { AuthResponseModel } from "../../models/response/auth-reponse.model";


export async function login(model: AuthRequestModel): Promise<BaseResponseModel<AuthResponseModel>> {

    console.log(model);

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