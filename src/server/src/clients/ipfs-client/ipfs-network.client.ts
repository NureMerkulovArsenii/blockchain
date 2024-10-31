import axios, { AxiosInstance } from 'axios';
import { readFileSync, writeFileSync } from 'fs';
import { Buffer } from 'buffer';
import { IpfsFile } from './ipfs-file.model';

export class IpfsClient {
    private client: AxiosInstance;
    private ipfsClient: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: 'http://127.0.0.1:5001/api/v0',
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        this.ipfsClient = axios.create({
            baseURL: 'http://127.0.0.1:8080/ipfs',
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });
    }

    async getIpfsFile(cid: string): Promise<IpfsFile> {
        const response = await this.ipfsClient.get(`/${cid}`, {
            responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(response.data);
        const file = buffer.toString('base64');

        return { cid, file };
    }

    async uploadFile(buffer: Buffer): Promise<string> {
        const formData = new FormData();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        formData.append('arg', blob);

        const response = await this.client.post('/add', formData);

        return response.data.Hash;
    }

    async downloadFile(cid: string): Promise<Buffer> {
        const response = await this.ipfsClient.get(`/${cid}`, {
            responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(response.data);

        return buffer;
    }

    async downloadFiles(cids: string[]): Promise<IpfsFile[]> {
        const files: IpfsFile[] = [];
        for (const cid of cids) {
            const response = await this.ipfsClient.get(`/${cid}`, {
                responseType: 'arraybuffer'
            });
            const buffer = Buffer.from(response.data);
            const file: string = buffer.toString('base64');
            files.push({ cid, file });
        }

        return files;
    }

}