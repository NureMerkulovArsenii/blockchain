import { IpfsFile } from "../../clients/ipfs-client/ipfs-file.model";
import { IpfsClient } from "../../clients/ipfs-client/ipfs-network.client";

const ipfsClient = new IpfsClient();

export async function getImageByIdHandle(cid: string): Promise<IpfsFile> {
    const ipfsFile: Buffer = await ipfsClient.downloadFile(cid);

    const result: IpfsFile = {
        file: ipfsFile.toString("base64"),
        cid: cid
    }

    return result;
}
