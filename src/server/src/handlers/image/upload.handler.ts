import { IpfsClient } from "../../clients/ipfs-client/ipfs-network.client";
import { storeImage } from "../../clients/smart-contract-client/smart-contract.client";
import { UploadImageRequest } from "../../models/request/upload-image-request.model";

const ipfsClient: IpfsClient = new IpfsClient();

export async function uploadImage(file: Buffer, model: UploadImageRequest, userName: string): Promise<boolean> {

    try {
        
        //const buffer = Buffer.from(model.file, "base64");
        const fileCid = await ipfsClient.uploadFile(file);

        const contractResult = await storeImage(userName, fileCid, model.isVisiblePublicly, model.fileName, model.isForExchange);

        return contractResult;
    }
    catch (error) {
        console.error(error);
        return false;
    }

}