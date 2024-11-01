import { updateImage } from "../../clients/smart-contract-client/smart-contract.client";
import { UpdateImageRequest } from "../../models/request/update-image-request.model";

export async function updateImageHandle(model: UpdateImageRequest, userName: string): Promise<boolean> {
    try {
        const contractResult = await updateImage(userName, model.cid, model.isVisiblePublicly, model.isForExchange);
        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }

}