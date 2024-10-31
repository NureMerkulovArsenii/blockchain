import { ExchangeRequest } from "../../models/exchange-request.model";
import { Image } from "../../models/image.model";

const Web3Lib = require('web3');
const { abi, bytecode } = require('./../../../../smart-contracts/user-image-store/scripts/compile');

let accounts;
let userImageStore;
let contract: any;

const web3 = new Web3Lib.Web3('http://127.0.0.1:8545');

let fromAddress : string;

export async function buildClient() {
    await deployContract();
    const contractAddress = userImageStore!.options.address;
    contract = new web3.eth.Contract(abi, contractAddress);  
    fromAddress = accounts![0]; 
}

async function deployContract() {
    accounts = await web3.eth.getAccounts();
    userImageStore = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: 30000000 });
}

//#region auth

export async function registerUser(login: string, password: string): Promise<boolean> {
    try{
        await contract.methods.registerUser(login, password).send({ from: fromAddress });
        return true;
    }
    catch(error){
        console.error(error);
        return false;
    }
}

export async function loginUser(login: string, password: string): Promise<boolean> {
    try {
        await contract.methods.loginUser(login, password).send({ from: fromAddress });
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}

export async function logoutUser(login: string): Promise<void> {
    await contract.methods.logoutUser(login).send({ from: fromAddress });
}

//#endregion


//#region images

export async function storeImage(
    userLogin: string,
    imageHash: string,
    visiblePublicly: boolean,
    imageName: string,
    canBeExchanged: boolean
): Promise<boolean> {
    try {
        await contract.methods.storeImage(userLogin, imageHash, true, imageName, true).send({ from: fromAddress });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getImagesByUserLogin(userLogin: string): Promise<Image[]> {
    try {
        const images = await contract.methods.getImagesByUserLogin(userLogin).call();
        console.log(images);
        return images;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getImages(): Promise<Image[]> {
    try {
        const images = await contract.methods.getImages().call();
        console.log(images);
        return images;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getExchangeRequests(userLogin: string): Promise<ExchangeRequest[]> {
    try {
        const exchangeRequests = await contract.methods.getExchangeRequests(userLogin)
            .call({ from: fromAddress });;
        console.log(exchangeRequests);
        return exchangeRequests;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function exchangeImages(model: ExchangeRequest) {
    try {
        await contract.methods.exchangeImages(model.ownerLogin, model.exchangerLogin, model.imageHashToExchange, model.imageHashForExchange)
            .send({ from: fromAddress });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function cancelExchangeRequest(model: ExchangeRequest) {
    try {
        await contract.methods.cancelExchangeRequest(model.ownerLogin, model.exchangerLogin, model.imageHashToExchange, model.imageHashForExchange)
            .send({ from: fromAddress });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function createExchangeRequest(model: ExchangeRequest) {
    try {        
        await contract.methods.createExchangeRequest(model.ownerLogin, model.exchangerLogin, model.imageHashToExchange, model.imageHashForExchange)
            .send({ from: fromAddress });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

//#endregion
