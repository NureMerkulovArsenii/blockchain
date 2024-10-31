import { IpfsFile } from "../../clients/ipfs-client/ipfs-file.model";
import { IpfsClient } from "../../clients/ipfs-client/ipfs-network.client";
import { getImages } from "../../clients/smart-contract-client/smart-contract.client";
import { Image } from "../../models/image.model";
import { ImageResponse } from "../../models/response/image-response.model";


const ipfsClient: IpfsClient = new IpfsClient();

export async function getAllImages(): Promise<ImageResponse[]> {
    const images: Image[] = await getImages();

    const files: IpfsFile[] = await ipfsClient.downloadFiles(images.map(image => image.imageHash));

    const imageResponses: ImageResponse[] = images.map((image, index) => {
        return {
            visiblePublicly: image.visiblePublicly,
            canBeExchanged: image.canBeExchanged,
            username: image.userLogin,
            imageName: image.imageName,
            image: files.find(file => file.cid === image.imageHash)!.file,
            imageCid: image.imageHash
        };
    });

    return imageResponses;
}