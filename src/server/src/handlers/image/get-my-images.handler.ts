import { IpfsFile } from "../../clients/ipfs-client/ipfs-file.model";
import { IpfsClient } from "../../clients/ipfs-client/ipfs-network.client";
import { getImages, getImagesByUserLogin } from "../../clients/smart-contract-client/smart-contract.client";
import { Image } from "../../models/image.model";
import { ImageResponse } from "../../models/response/image-response.model";


const ipfsClient: IpfsClient = new IpfsClient();

export async function getUserImages(username: string): Promise<ImageResponse[]> {
    const images: Image[] = await getImagesByUserLogin(username);

    const files: IpfsFile[] = await ipfsClient.downloadFiles(images.map(image => image.imageHash));

    const imageResponses: ImageResponse[] = images.map((image, index) => {
        return {
            visiblePublicly: image.visiblePublicly,
            canBeExchanged: image.canBeExchanged,
            username: image.userLogin,
            imageName: image.imageName,
            image: files.find(file => file.cid === image.imageHash)!.buffer.toString("base64"),
            imageCid: image.imageHash
        };
    });

    return imageResponses;
}